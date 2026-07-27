# Caching

Atlas does **not** push cache invalidation to your website when editors publish. Your Next.js app owns TTL and on-demand revalidation.

## How Next.js interacts with this SDK

In the App Router, Next.js **patches** `fetch` inside Server Components and Route Handlers. Calls made by `createCmsClient` use global `fetch` by default, so Next’s cache options apply when you pass them through:

```ts
await cms.resolve("/about", {
  next: { revalidate: 60, tags: ["cms-resolve"] },
});
```

The SDK forwards `cache`, `next.revalidate`, `next.tags`, and `signal` to `fetch` without interpreting them.

## Recommended patterns

### Time-based revalidation (ISR-style)

```ts
await cms.resolve(path, {
  next: { revalidate: 60 },
});
```

Good default for marketing sites where a minute of lag after publish is acceptable.

### Tag-based on-demand revalidation

```ts
await cms.resolve(path, {
  next: { revalidate: false, tags: ["cms", `cms:path:${path}`] },
});
```

After a publish (webhook, manual action, or admin hook you build), call:

```ts
import { revalidateTag } from "next/cache";

revalidateTag("cms");
// or revalidateTag(`cms:path:/about`);
```

Wire the webhook yourself; Atlas does not invoke your site automatically in v1 of this SDK.

### Always fresh

```ts
await cms.resolve(path, { cache: "no-store" });
```

Use sparingly (preview-like flows). Preview / draft modes are **out of scope** for this SDK today.

### Artifacts (sitemap / llms)

These change only on publish. Longer TTL is usually fine:

```ts
return sitemapResponse(cms, {
  next: { revalidate: 3600, tags: ["cms-sitemap"] },
});
```

## Sharing options between `page` and `generateMetadata`

`generateMetadata` and the page often resolve the same path. Use the **same** `next.tags` / `revalidate` so Next can dedupe the underlying `fetch` when the URL and options match.

```ts
const RESOLVE_OPTS = {
  next: { revalidate: 60, tags: ["cms-resolve"] },
} as const;

export async function generateMetadata(props: Props) {
  const { slug } = await props.params;
  return buildMetadata(await resolvePage(cms, slug, RESOLVE_OPTS));
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const result = await resolvePage(cms, slug, RESOLVE_OPTS);
  return <Content result={result} />;
}
```

## Custom `fetch`

For tests or non-Next runtimes, pass `fetch` into `createCmsClient`:

```ts
const cms = createCmsClient({
  baseUrl,
  siteId,
  envId,
  fetch: myFetch,
});
```

Outside Next, `next: { revalidate }` is ignored by standard `fetch` implementations unless your wrapper understands it.
