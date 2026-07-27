# Concepts

How Velafa Atlas public delivery works, and what this SDK is responsible for.

## Multi-tenancy model

```
Tenant
  └── Site (site_…)
        ├── Environments (env_…)  ← each pins a content version
        ├── Locales
        ├── Live items (not versioned)
        └── Versioned content (templates, collections, entries, pages)
```

Public consumers always address a **site** + **environment**:

- `siteId` — opaque id (`site_…`)
- `envId` — opaque id (`env_…`)

There is **no public discovery API**. You configure these ids (and the Atlas base URL) in your website’s environment variables. Knowing the ids is the capability; public routes do not use cookies, bearer tokens, or a `tenantId` header.

## Public vs admin

| Surface | Auth | Used by |
|---------|------|---------|
| `/public/sites/...` | None | This SDK / headless websites |
| Admin routes (`/sites/...`, `/auth/...`, …) | JWT cookie + `tenantId` | Velafa CMS admin |

Do not call admin APIs from a public website. Prefer **server-side** fetches (RSC, route handlers). Atlas does not expose CORS middleware for browser-direct calls.

## Resolve vs publish

**Resolve** (`GET .../resolve`) reads **published** content for the environment’s pinned version (or `latest`) from DynamoDB:

1. Load environment; must belong to `siteId`
2. Resolve locale (query param or site default)
3. Match a published page by path (static, listing, or dynamic `:slug` via template `routePattern`)
4. For collection detail routes, load the published entry by slug
5. Return `{ page, template, entry?, seo? }`

**Publish** writes S3 **artifacts** used by:

- `GET .../sitemap.xml`
- `GET .../llms.txt`

If an environment has never been published, those artifact endpoints return `ARTIFACT_NOT_FOUND` (404). Resolve can still work for content that exists in the pinned published version independently of whether you care about sitemap/llms.

## What resolve returns

```ts
type ResolveResult = {
  page: Page;         // path, type, sections, templateId, …
  template: Template; // layoutPreset, routePattern, kind, …
  entry?: Entry;      // present for collection detail routes
  seo?: SeoFields;    // usually from the entry when present
};
```

Drive your UI from:

- `template.layoutPreset` — which layout/component set to render
- `page.type` — `static` | `collection` | `dynamic`
- `page.sections` / `entry.fields` / `entry.body` / `entry.sections` — content payload (`ContentSection` is open `{ type, data }`; `SECTION_TYPE` presets are optional conventions)

## Live items

Live items are **site-scoped**, not version-pinned. Typical uses: header nav, footer, site-wide banners.

```ts
await cms.getLiveItem("header-nav", { locale: "en-gb" });
```

Lookup is exact on `(siteId, key, locale?)`. There is no documented automatic fallback to the default locale in the public live endpoint.

## Spotify (site-linked)

When Spotify is connected on an Atlas user account and linked on a site, reserved live keys serve listening data through the normal live item API:

```ts
import { SPOTIFY_LIVE_KEY } from "@velafa/cms-sdk";

await cms.getLiveItem(SPOTIFY_LIVE_KEY.CURRENTLY_PLAYING);
await cms.getLiveItem(SPOTIFY_LIVE_KEY.TOP_TRACKS_THIS_YEAR);
```

`this_year` maps to Spotify’s `medium_term` affinity (~last 6 months), not a calendar year.

## Media

There is **no** public media list/get API. Media URLs (CloudFront / CDN) are embedded inside page sections, entry fields, and live item `data`. Render those URLs as-is.

## Layout presets

Atlas seeds templates with these `layoutPreset` values (string constants also exported as `LAYOUT_PRESET`):

| Value | Typical use |
|-------|-------------|
| `content-page` | Generic content page |
| `listing` | Collection / index listing |
| `blog-article` | Blog post detail |
| `docs-article` | Docs article detail |
| `landing` | Landing / marketing page |

The SDK does **not** ship React components for these presets. Your site maps each preset to its own components.
