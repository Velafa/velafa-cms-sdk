# Locales

## Format

Atlas locales use a language-country code such as `en-gb` or `nl-nl` (typically `^[a-z]{2,3}-[a-z]{2}$` on public resolve).

## How the public API picks a locale

For **resolve**:

1. If the request includes `?locale=…`, Atlas uses that locale.
2. If omitted, Atlas uses the site’s **default** locale.

The SDK mirrors this:

1. Method `options.locale` if provided
2. Else `createCmsClient({ defaultLocale })` / `VELAFA_DEFAULT_LOCALE`
3. Else omit the query param and let Atlas apply the site default

```ts
await cms.resolve("/about", { locale: "nl-nl" });
await cms.resolve("/about"); // defaultLocale or Atlas default
```

## No public locale list

There is **no** public “list locales” endpoint. Configure supported locales in your website (constants, routing config, or CMS-exported config you maintain yourself).

## Live items

`getLiveItem` matches **exactly** on key + optional locale. The public live endpoint does not document an automatic fallback to the default locale when a localized item is missing. If you store locale-specific live items, pass the locale you need; if you store a single non-localized item, omit locale consistently on write and read.

## URL strategies in Next.js

Atlas only accepts locale as a **query parameter** on public APIs. Your site chooses how users see locales:

### Single locale

Set `VELAFA_DEFAULT_LOCALE` and ignore locale in the URL.

### Query or cookie

```tsx
export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const { slug } = await props.params;
  const { locale } = await props.searchParams;
  const result = await resolvePage(cms, slug, { locale });
  return <Content result={result} />;
}
```

### Path prefix (`/en-gb/...`)

Strip the first segment yourself, then resolve the rest:

```ts
const { slug = [] } = await props.params;
const [maybeLocale, ...rest] = slug;
const locale = isLocale(maybeLocale) ? maybeLocale : undefined;
const pathSegments = locale ? rest : slug;
const result = await resolvePage(cms, pathSegments, { locale });
```

`isLocale` is your site’s helper — not part of the SDK.
