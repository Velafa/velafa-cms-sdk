# Client API

Framework-agnostic client exported from `@velafa/cms-sdk`.

## `createCmsClient(config)`

```ts
import { createCmsClient } from "@velafa/cms-sdk";

const cms = createCmsClient({
  baseUrl: "https://atlas.example.com",
  siteId: "site_…",
  envId: "env_…",
  defaultLocale: "en-gb", // optional
  // fetch: customFetch,  // optional override (tests, agents)
});
```

| Option | Required | Description |
|--------|----------|-------------|
| `baseUrl` | Yes | Atlas origin without trailing slash |
| `siteId` | Yes | Site id |
| `envId` | Yes | Environment id |
| `defaultLocale` | No | Used when a method omits `locale` |
| `fetch` | No | Defaults to global `fetch` |

Missing `baseUrl` / `siteId` / `envId` throws `CmsApiError` with code `VALIDATION_FAILED`.

`cms.config` exposes a readonly copy of `baseUrl`, `siteId`, `envId`, and `defaultLocale`.

## Request options

Every method accepts optional fetch passthrough options (useful under Next.js RSC, where `fetch` is patched):

```ts
type CmsRequestOptions = {
  cache?: RequestCache; // e.g. "force-cache" | "no-store"
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  signal?: AbortSignal;
};

type LocaleOptions = CmsRequestOptions & {
  locale?: string;
};
```

See [Caching](./caching.md).

## Envelope vs raw bodies

JSON endpoints (`resolve`, `getLiveItem`) return Atlas’s envelope:

```json
{ "success": true, "message": "Route resolved.", "data": { … } }
```

The client **unwraps `data`** and returns it. On `success: false` (or non-OK HTTP with an envelope), it throws `CmsApiError`.

Artifact endpoints (`getSitemap`, `getLlmsTxt`) return **raw strings** (XML / plain text), not an envelope.

## `resolve(path, options?)`

**Atlas:** `GET /public/sites/:siteId/envs/:envId/resolve?path=&locale=`

```ts
const result = await cms.resolve("/");
const article = await cms.resolve("/blog/hello-world", {
  locale: "nl-nl",
  next: { revalidate: 60, tags: ["cms"] },
});
```

| Param | Notes |
|-------|--------|
| `path` | Must include leading slash (`/about`). Required by Atlas. |
| `options.locale` | Optional; falls back to `defaultLocale`, then Atlas site default. |

**Returns:** `ResolveResult` (`page`, `template`, `entry?`, `entries?`, `seo?`).

- Collection **detail** routes set `entry`.
- Collection **listing** routes (path without `:slug`) set `entries` to published entries for that page’s collection.

**Common errors:** `RESOLVE_NOT_FOUND` (404), `ENVIRONMENT_NOT_FOUND`, `VALIDATION_FAILED` (missing path).

### Examples

Homepage:

```ts
const home = await cms.resolve("/");
// home.template.layoutPreset → e.g. "landing" or "content-page"
```

Collection listing:

```ts
const blogs = await cms.resolve("/blogs");
// blogs.entries → published blog entries (when page is a collection listing)
```

Collection detail (slug page):

```ts
const post = await cms.resolve("/blog/hello-world");
// post.entry is set; post.seo may mirror entry SEO
```

## `listEntries(collectionId, options?)`

**Atlas:** `GET /public/sites/:siteId/envs/:envId/collections/:collectionId/entries?locale=`

```ts
const entries = await cms.listEntries("col_…", {
  locale: "en-mt",
  next: { revalidate: 60, tags: ["cms"] },
});
```

**Returns:** published `Entry[]` for the environment’s pinned version and locale.

**Common errors:** `COLLECTION_NOT_FOUND` (404), `ENVIRONMENT_NOT_FOUND`, `RESOLVE_NOT_FOUND` (unknown locale).

## `getLiveItem(key, options?)`

**Atlas:** `GET /public/sites/:siteId/live/:key?locale=`

```ts
const nav = await cms.getLiveItem("header-nav", { locale: "en-gb" });
// nav.data → Record<string, unknown>
```

**Returns:** `LiveItem`.

**Common errors:** `LIVE_ITEM_NOT_FOUND` (404).

Note: live items are **not** scoped to `envId` in the URL (site + key + locale only).

## Spotify (reserved live keys)

When Spotify is connected and linked on a site, Atlas serves reserved live keys via `getLiveItem`. No separate Spotify client methods.

```ts
import { SPOTIFY_LIVE_KEY } from "@velafa/cms-sdk";

const now = await cms.getLiveItem(SPOTIFY_LIVE_KEY.CURRENTLY_PLAYING, {
  next: { revalidate: 15 },
});
// now.data → { isPlaying, progressMs?, track? }

const tops = await cms.getLiveItem(SPOTIFY_LIVE_KEY.TOP_TRACKS_THIS_YEAR);
// tops.data → { range, spotifyTimeRange, items }
```

Keys: `spotify-currently-playing`, `spotify-top-tracks-all-time`, `spotify-top-tracks-this-year`, `spotify-top-artists-all-time`, `spotify-top-artists-this-year`, `spotify-top-genres-all-time`, `spotify-top-genres-this-year`.

`this_year` maps to Spotify `medium_term` (~last 6 months), not a calendar year.

## `getSitemap(options?)`

**Atlas:** `GET /public/sites/:siteId/envs/:envId/sitemap.xml`

```ts
const xml = await cms.getSitemap({ next: { revalidate: 3600 } });
// string — application/xml body
```

**Common errors:** `ARTIFACT_NOT_FOUND` if never published.

For Next.js, prefer [`sitemapResponse`](./nextjs.md) so you return a proper `Response` from a route handler.

## `getLlmsTxt(options?)`

**Atlas:** `GET /public/sites/:siteId/envs/:envId/llms.txt`

```ts
const text = await cms.getLlmsTxt();
```

**Common errors:** `ARTIFACT_NOT_FOUND` if never published.

## Error handling

```ts
import { CmsApiError, isResolveNotFound } from "@velafa/cms-sdk";

try {
  await cms.resolve("/missing");
} catch (error) {
  if (isResolveNotFound(error)) {
    // show 404
  } else if (error instanceof CmsApiError) {
    console.error(error.status, error.code, error.message);
  } else {
    throw error;
  }
}
```

Full code list: [Errors](./errors.md).
