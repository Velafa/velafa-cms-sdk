# API reference

TypeScript surfaces exported by `@velafa/cms-sdk` and `@velafa/cms-sdk/next`. Field shapes match Atlas camelCase API mappers.

## Package: `@velafa/cms-sdk`

### Functions

#### `createCmsClient(config: CmsClientConfig): CmsClient`

Creates a public delivery client.

#### `isCmsApiError(error: unknown): error is CmsApiError`

#### `isResolveNotFound(error: unknown): boolean`

True when `code === "RESOLVE_NOT_FOUND"`.

#### `isNotFoundError(error: unknown): boolean`

True for resolve / data-feed / artifact not-found codes or HTTP 404.

### Classes

#### `CmsApiError`

| Member | Type | Description |
|--------|------|-------------|
| `message` | `string` | Human-readable message |
| `status` | `number` | HTTP status (`0` for network errors) |
| `code` | `string \| undefined` | Atlas or SDK error code |

### `CmsClient` methods

| Method | Returns |
|--------|---------|
| `resolve(path, options?: LocaleOptions)` | `Promise<ResolveResult>` |
| `listEntries(collectionId, options?: LocaleOptions)` | `Promise<Entry[]>` |
| `getDataFeed(key, options?: LocaleOptions)` | `Promise<DataFeed>` |
| `getSiteSettings(options?: CmsRequestOptions)` | `Promise<PublicSiteSettings>` |
| `getSitemap(options?: CmsRequestOptions)` | `Promise<string>` |
| `getLlmsTxt(options?: CmsRequestOptions)` | `Promise<string>` |
| `getLlmsFullTxt(options?: CmsRequestOptions)` | `Promise<string>` |
| `getRobotsTxt(options?: CmsRequestOptions)` | `Promise<string>` |

Readonly `config`: `{ baseUrl, siteId, envId, defaultLocale? }`.

### Config and options

```ts
type CmsClientConfig = {
  baseUrl: string;
  siteId: string;
  envId: string;
  defaultLocale?: string;
  fetch?: typeof fetch;
};

type CmsRequestOptions = {
  cache?: RequestCache;
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

### Domain types

#### `ResolveResult`

| Field | Type | Notes |
|-------|------|--------|
| `page` | `Page` | Always present |
| `template` | `Template` | Always present |
| `entry` | `Entry \| undefined` | Collection detail routes |
| `entries` | `Entry[] \| undefined` | Collection listing routes |
| `seo` | `SeoFields \| undefined` | Often from entry |

#### `Page`

| Field | Type |
|-------|------|
| `id` | `string` |
| `envId` | `string` |
| `siteId` | `string` |
| `versionId` | `string` |
| `locale` | `string` |
| `path` | `string` |
| `type` | `string` (`static` \| `collection` \| `dynamic`) |
| `templateId` | `string` |
| `collectionId` | `string \| undefined` |
| `slugField` | `string \| undefined` |
| `sections` | `ContentSection[] \| undefined` |
| `status` | `string` |
| `seo` | `SeoFields \| undefined` |
| `sitemap` | `SitemapRule \| undefined` |
| `llmsTxt` | `LlmsTxtRule \| undefined` |
| `entityType` | `string` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

#### `Template`

| Field | Type |
|-------|------|
| `id` | `string` |
| `siteId` | `string` |
| `versionId` | `string` |
| `name` | `string` |
| `routePattern` | `string` |
| `kind` | `string` |
| `layoutPreset` | `string` |
| `requiredFields` | `string[]` |
| `builtIn` | `boolean` |
| `entityType` | `string` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

#### `Entry`

| Field | Type |
|-------|------|
| `id` | `string` |
| `collectionId` | `string` |
| `siteId` | `string` |
| `versionId` | `string` |
| `locale` | `string` |
| `slug` | `string` |
| `status` | `string` |
| `fields` | `Record<string, unknown>` |
| `body` | `string \| undefined` |
| `sections` | `ContentSection[] \| undefined` |
| `seo` | `SeoFields \| undefined` |
| `entityType` | `string` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

#### `DataFeed`

| Field | Type |
|-------|------|
| `id` | `string` |
| `siteId` | `string` |
| `versionId` | `string` |
| `key` | `string` |
| `locale` | `string \| undefined` |
| `data` | `Record<string, unknown>` |
| `entityType` | `string` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

#### `SeoFields`

| Field | Type |
|-------|------|
| `title` | `string \| undefined` |
| `description` | `string \| undefined` |
| `canonical` | `string \| undefined` |
| `noindex` | `boolean \| undefined` |
| `ogImage` | `string \| undefined` |
| `ogImageAlt` | `string \| undefined` |

On `ResolveResult.seo`, `ogImage` / `ogImageAlt` are merged by Atlas: page → entry → site default OG (env pinned version).

#### `PublicSiteSettings`

| Field | Type |
|-------|------|
| `favicons` | `PublicSiteFavicon[]` |
| `defaultOgImageUrl` | `string \| undefined` |
| `defaultOgImageAlt` | `string \| undefined` |

#### `PublicSiteFavicon`

| Field | Type |
|-------|------|
| `format` | `string` |
| `url` | `string` |

#### `ContentSection`

Loose wire shape (any `type` is allowed):

| Field | Type |
|-------|------|
| `id` | `string \| undefined` |
| `type` | `string` |
| `data` | `Record<string, unknown> \| undefined` |

**Presets** (`SECTION_TYPE`) are conventions for common blocks — not an API allowlist. Optional typed views (`HeroSection`, `ParagraphSection`, …) and `isSectionType(section, "paragraph")` help when `type` matches a preset.

| Preset | Typical `data` fields |
|------|----------------|
| `hero` | `heading`, `subheading?`, `imageUrl?`, `ctaLabel?`, `ctaHref?` |
| `paragraph` | `title?`, `markdown` |
| `list` | `title?`, `items[]` (`heading`, `body?`, `imageUrl?`, `href?`) |
| `gallery` | `variant` (`carousel` \| `grid`), `items[]` (`imageUrl`, `alt?`, `caption?`) |
| `cta` | `heading`, `body?`, `buttonLabel`, `buttonHref` |
| `quote` | `quote`, `attribution?`, `role?` |

Sites may define their own `type` values. Render preset markdown fields with `react-markdown` (or equivalent) — the SDK does not ship React renderers.

#### `SitemapRule` / `LlmsTxtRule`

```ts
type SitemapRule = {
  include?: boolean;
  priority?: number;
  changefreq?: string;
};

type LlmsTxtRule = {
  include?: boolean;
  section?: string;
};
```

#### `ApiEnvelope<T>`

```ts
type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
};
```

### Constants

#### `LAYOUT_PRESET`

| Key | Value |
|-----|-------|
| `CONTENT_PAGE` | `"content-page"` |
| `LISTING` | `"listing"` |
| `BLOG_ARTICLE` | `"blog-article"` |
| `DOCS_ARTICLE` | `"docs-article"` |
| `LANDING` | `"landing"` |

#### `PAGE_TYPE`

| Key | Value |
|-----|-------|
| `STATIC` | `"static"` |
| `COLLECTION` | `"collection"` |
| `DYNAMIC` | `"dynamic"` |

#### `SECTION_TYPE`

| Key | Value |
|-----|-------|
| `HERO` | `"hero"` |
| `PARAGRAPH` | `"paragraph"` |
| `LIST` | `"list"` |
| `GALLERY` | `"gallery"` |
| `CTA` | `"cta"` |
| `QUOTE` | `"quote"` |

#### `SPOTIFY_LIVE_KEY`

Reserved data feed keys when Spotify is linked on the site. Load with `getDataFeed`.

| Key | Value |
|-----|-------|
| `CURRENTLY_PLAYING` | `"spotify-currently-playing"` |
| `TOP_TRACKS_ALL_TIME` | `"spotify-top-tracks-all-time"` |
| `TOP_TRACKS_THIS_YEAR` | `"spotify-top-tracks-this-year"` |
| `TOP_ARTISTS_ALL_TIME` | `"spotify-top-artists-all-time"` |
| `TOP_ARTISTS_THIS_YEAR` | `"spotify-top-artists-this-year"` |
| `TOP_GENRES_ALL_TIME` | `"spotify-top-genres-all-time"` |
| `TOP_GENRES_THIS_YEAR` | `"spotify-top-genres-this-year"` |

`this_year` → Spotify `medium_term`; `all_time` → `long_term`.

#### `GALLERY_VARIANT`

| Key | Value |
|-----|-------|
| `CAROUSEL` | `"carousel"` |
| `GRID` | `"grid"` |

#### `ERROR_CODE`

| Key | Value |
|-----|-------|
| `RESOLVE_NOT_FOUND` | `"RESOLVE_NOT_FOUND"` |
| `DATA_FEED_NOT_FOUND` | `"DATA_FEED_NOT_FOUND"` |
| `ARTIFACT_NOT_FOUND` | `"ARTIFACT_NOT_FOUND"` |
| `ENVIRONMENT_NOT_FOUND` | `"ENVIRONMENT_NOT_FOUND"` |
| `VALIDATION_FAILED` | `"VALIDATION_FAILED"` |
| `INVALID_RESPONSE` | `"INVALID_RESPONSE"` |
| `NETWORK_ERROR` | `"NETWORK_ERROR"` |

#### `ENV_VAR`

| Key | Value |
|-----|-------|
| `ATLAS_URL` | `"VELAFA_ATLAS_URL"` |
| `SITE_ID` | `"VELAFA_SITE_ID"` |
| `ENV_ID` | `"VELAFA_ENV_ID"` |
| `DEFAULT_LOCALE` | `"VELAFA_DEFAULT_LOCALE"` |

#### `CONTENT_TYPE`

| Key | Value |
|-----|-------|
| `JSON` | `"application/json"` |
| `XML` | `"application/xml"` |
| `PLAIN` | `"text/plain"` |

### Type aliases

- `LayoutPreset` — union of `LAYOUT_PRESET` values
- `PageType` — union of `PAGE_TYPE` values

---

## Package: `@velafa/cms-sdk/next`

Re-exports the core client symbols above, plus:

### `createCmsClientFromEnv(env?: NodeJS.ProcessEnv): CmsClient`

Reads `VELAFA_*` from `process.env` by default.

### `cmsPathFromSegments(segments?: readonly string[] | string | null): string`

### `resolvePage(client, segments?, options?): Promise<ResolveResult>`

Calls `notFound()` on `RESOLVE_NOT_FOUND`.

### `buildMetadata(result: ResolveResult): Metadata`

Returns Next.js `Metadata` from SEO / entry title fallbacks, including `openGraph` and `twitter` when `seo.ogImage` (or title/description) is present.

### `sitemapResponse(client, options?): Promise<Response>`

Raw Atlas XML for `app/sitemap.xml/route.ts` only.

### `llmsTxtResponse(client, options?): Promise<Response>`

Plain text for `app/llms.txt/route.ts`.

### `llmsFullTxtResponse(client, options?): Promise<Response>`

Plain text for `app/llms-full.txt/route.ts`.

### `robotsTxtResponse(client, options?): Promise<Response>`

Plain text for `app/robots.txt/route.ts`.
