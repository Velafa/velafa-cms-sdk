# Next.js App Router

Helpers from `@velafa/cms-sdk/next` for Next.js **16** (peer `next@^16`).

Import these only in **Server Components**, `generateMetadata`, and Route Handlers. Do not call the client from browser Client Components (Atlas public APIs are not CORS-enabled for that pattern).

## Environment setup

```bash
VELAFA_ATLAS_URL=https://atlas.example.com
VELAFA_SITE_ID=site_…
VELAFA_ENV_ID=env_…
VELAFA_DEFAULT_LOCALE=en-gb
```

```ts
import { createCmsClientFromEnv } from "@velafa/cms-sdk/next";

const cms = createCmsClientFromEnv();
```

Throws `CmsApiError` (`VALIDATION_FAILED`) if a required env var is missing.

You can also call `createCmsClient({ … })` from `@velafa/cms-sdk` if you prefer explicit config.

## Catch-all page

Create an optional catch-all so every CMS path maps to one route:

```text
app/
  [[...slug]]/
    page.tsx
  layout.tsx
```

In Next.js 15+/16, `params` is a **Promise** — always `await` it.

```tsx
// app/[[...slug]]/page.tsx
import {
  createCmsClientFromEnv,
  resolvePage,
  buildMetadata,
  LAYOUT_PRESET,
} from "@velafa/cms-sdk/next";
import type { Metadata } from "next";

const cms = createCmsClientFromEnv();

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await resolvePage(cms, slug, {
    next: { revalidate: 60, tags: ["cms-resolve"] },
  });
  return buildMetadata(result);
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const result = await resolvePage(cms, slug, {
    next: { revalidate: 60, tags: ["cms-resolve"] },
  });

  switch (result.template.layoutPreset) {
    case LAYOUT_PRESET.BLOG_ARTICLE:
      return <BlogArticle result={result} />;
    case LAYOUT_PRESET.LISTING:
      return <Listing result={result} />;
    case LAYOUT_PRESET.LANDING:
      return <Landing result={result} />;
    case LAYOUT_PRESET.DOCS_ARTICLE:
      return <DocsArticle result={result} />;
    case LAYOUT_PRESET.CONTENT_PAGE:
    default:
      return <ContentPage result={result} />;
  }
}
```

`resolvePage`:

1. Converts segments with `cmsPathFromSegments` (`undefined` / `[]` → `/`)
2. Calls `client.resolve`
3. On `RESOLVE_NOT_FOUND`, calls Next’s `notFound()` from `next/navigation`
4. Re-throws other errors

### `cmsPathFromSegments`

```ts
cmsPathFromSegments(undefined);        // "/"
cmsPathFromSegments([]);               // "/"
cmsPathFromSegments(["blog", "hi"]);   // "/blog/hi"
cmsPathFromSegments("about");          // "/about"
```

## Metadata

`buildMetadata(result)` returns a Next `Metadata` object from `result.seo` (or `result.entry?.seo`):

- `title` — SEO title, else `entry.fields.title` if it is a string
- `description`
- `alternates.canonical` when `canonical` is set
- `robots: { index: false, follow: false }` when `noindex` is true
- `openGraph` / `twitter` when title, description, or `ogImage` is present
  - `openGraph.images` / `twitter.images` use absolute `seo.ogImage` URLs (Atlas merges page → entry → site default)
  - `twitter.card` is `summary_large_image` when an image is set

You can still merge with your own fields:

```ts
return {
  ...buildMetadata(result),
  openGraph: {
    ...buildMetadata(result).openGraph,
    siteName: "Acme",
  },
};
```

## Sitemap (raw Atlas XML)

Atlas publishes a **pre-built XML** artifact. Next’s `app/sitemap.ts` expects a `MetadataRoute.Sitemap` **array of URL objects** — a different shape. Do **not** pass Atlas XML into `sitemap.ts`.

Use a route handler that proxies the XML:

```ts
// app/sitemap.xml/route.ts
import {
  createCmsClientFromEnv,
  sitemapResponse,
} from "@velafa/cms-sdk/next";

const cms = createCmsClientFromEnv();

export async function GET() {
  return sitemapResponse(cms, {
    next: { revalidate: 3600, tags: ["cms-sitemap"] },
  });
}
```

If you prefer Next’s native `app/sitemap.ts`, build the URL array yourself from your own data sources — that path is out of scope for this helper.

## llms.txt

Next has no special file convention for `llms.txt`. Use a route handler:

```ts
// app/llms.txt/route.ts
import {
  createCmsClientFromEnv,
  llmsTxtResponse,
} from "@velafa/cms-sdk/next";

const cms = createCmsClientFromEnv();

export async function GET() {
  return llmsTxtResponse(cms, {
    next: { revalidate: 3600, tags: ["cms-llms"] },
  });
}
```

## llms-full.txt

Optional longer index for language models:

```ts
// app/llms-full.txt/route.ts
import {
  createCmsClientFromEnv,
  llmsFullTxtResponse,
} from "@velafa/cms-sdk/next";

const cms = createCmsClientFromEnv();

export async function GET() {
  return llmsFullTxtResponse(cms, {
    next: { revalidate: 3600, tags: ["cms-llms-full"] },
  });
}
```

## robots.txt

Prefer a route handler that proxies the published artifact (instead of a static `robots.ts`) so the sitemap URL stays in sync with publish:

```ts
// app/robots.txt/route.ts
import {
  createCmsClientFromEnv,
  robotsTxtResponse,
} from "@velafa/cms-sdk/next";

const cms = createCmsClientFromEnv();

export async function GET() {
  return robotsTxtResponse(cms, {
    next: { revalidate: 3600, tags: ["cms-robots"] },
  });
}
```

## Locales in the App Router

Atlas accepts locale as a **query param** on resolve/live. The SDK does not parse locale from the URL path for you.

Common site strategies:

1. **Single locale** — set `VELAFA_DEFAULT_LOCALE` and omit `locale` on calls.
2. **Query or cookie** — read `searchParams` / cookie in the page and pass `{ locale }` to `resolvePage`.
3. **Path prefix** (`/en-gb/blog/...`) — strip the first segment in your page, pass it as `locale`, and resolve the remaining path (custom glue; not built into the helper).

See [Locales](./locales.md).

## Layout presets (your components)

The SDK documents presets; you own the React:

| `layoutPreset` | Constant |
|----------------|----------|
| `content-page` | `LAYOUT_PRESET.CONTENT_PAGE` |
| `listing` | `LAYOUT_PRESET.LISTING` |
| `blog-article` | `LAYOUT_PRESET.BLOG_ARTICLE` |
| `docs-article` | `LAYOUT_PRESET.DOCS_ARTICLE` |
| `landing` | `LAYOUT_PRESET.LANDING` |
