# @velafa-cms/sdk

Typed TypeScript client and Next.js App Router helpers for **Velafa Atlas public CMS delivery APIs**.

Use this package from a Next.js (or any Node 18+) website to resolve published pages, load live items, and proxy published `sitemap.xml` / `llms.txt` artifacts.

This SDK does **not** cover the admin CMS (auth, CRUD, publish UI). Those APIs stay behind JWT + `tenantId` and are used by Velafa CMS itself.

## Install (private)

The package is `"private": true`. Install from git or a local path until you publish to GitHub Packages / npm.

```bash
# Git (replace with your remote)
npm install git+https://github.com/YOUR_ORG/velafa-cms-sdk.git

# Local workspace sibling
npm install file:../velafa-cms-sdk
```

Peer dependency (optional): `next@^16` when using `@velafa-cms/sdk/next`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VELAFA_ATLAS_URL` | Yes | Atlas base URL (no trailing slash), e.g. `https://atlas.example.com` |
| `VELAFA_SITE_ID` | Yes | Site id (`site_…`) |
| `VELAFA_ENV_ID` | Yes | Environment id (`env_…`) |
| `VELAFA_DEFAULT_LOCALE` | No | Default locale (e.g. `en-gb`) when calls omit `locale` |

## Quick start

```ts
import { createCmsClientFromEnv } from "@velafa-cms/sdk/next";

const cms = createCmsClientFromEnv();

const page = await cms.resolve("/blog/hello-world");
console.log(page.template.layoutPreset, page.entry?.slug);
```

Or configure explicitly with `createCmsClient` from `@velafa-cms/sdk` when you already have validated `baseUrl` / `siteId` / `envId` strings.

Next.js App Router (Server Component):

```tsx
import {
  createCmsClientFromEnv,
  resolvePage,
  buildMetadata,
} from "@velafa-cms/sdk/next";
import type { Metadata } from "next";

const cms = createCmsClientFromEnv();

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await resolvePage(cms, slug);
  return buildMetadata(result);
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const result = await resolvePage(cms, slug);
  // Map result.template.layoutPreset / page.sections by type.
  // SECTION_TYPE presets are conventions; custom types are allowed.
  // Render paragraph markdown with react-markdown (or similar) in your app.
  return <main>{result.page.path}</main>;
}
```

## Documentation

| Guide | Contents |
|-------|----------|
| [Concepts](./docs/concepts.md) | Sites, environments, publish vs resolve, auth model |
| [Client API](./docs/client.md) | `createCmsClient` and every method |
| [Next.js](./docs/nextjs.md) | Catch-all pages, metadata, sitemap / llms route handlers |
| [Errors](./docs/errors.md) | `CmsApiError` and Atlas error codes |
| [Locales](./docs/locales.md) | Locale query behavior and URL strategies |
| [Caching](./docs/caching.md) | `revalidate`, tags, and publish invalidation |
| [API reference](./docs/api-reference.md) | Types, constants, and signatures |

## Package exports

| Import | Use when |
|--------|----------|
| `@velafa-cms/sdk` | Framework-agnostic client |
| `@velafa-cms/sdk/next` | Next.js 16 helpers (`notFound`, `Metadata`, route `Response`s) |

## License

UNLICENSED — private package.
