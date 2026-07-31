# Errors

## `CmsApiError`

Thrown by the client when Atlas returns a failed envelope, a non-OK artifact response, invalid JSON, or a network failure.

```ts
class CmsApiError extends Error {
  readonly name: "CmsApiError";
  readonly message: string;
  readonly status: number; // HTTP status; `0` for network failures
  readonly code: string | undefined; // Atlas `code` when present
}
```

```ts
import { CmsApiError, isCmsApiError } from "@velafa/cms-sdk";

try {
  await cms.resolve("/missing");
} catch (error) {
  if (isCmsApiError(error)) {
    console.error(error.status, error.code, error.message);
  }
}
```

## Helpers

| Helper | Meaning |
|--------|---------|
| `isCmsApiError(error)` | `error instanceof CmsApiError` |
| `isResolveNotFound(error)` | `code === "RESOLVE_NOT_FOUND"` |
| `isNotFoundError(error)` | Resolve / data-feed / artifact not-found codes, or HTTP 404 |

## Atlas error codes

These codes appear on failed JSON envelopes (and are set on `CmsApiError.code` when present):

| Code | Typical status | When |
|------|----------------|------|
| `RESOLVE_NOT_FOUND` | 404 | No published page matches the path/locale |
| `DATA_FEED_NOT_FOUND` | 404 | No data feed for key/locale |
| `ARTIFACT_NOT_FOUND` | 404 | Sitemap, llms.txt, llms-full.txt, or robots.txt never published for the env |
| `ENVIRONMENT_NOT_FOUND` | 404 | `envId` missing or not under `siteId` |
| `VALIDATION_FAILED` | 400 | Missing/invalid input (e.g. resolve without `path`) |

SDK-generated codes (not from Atlas):

| Code | When |
|------|------|
| `INVALID_RESPONSE` | Body is not a valid envelope / unexpected shape |
| `NETWORK_ERROR` | `fetch` threw (DNS, abort, offline); `status` is `0` |
| `VALIDATION_FAILED` | Missing client config or required env vars |

Constants are exported as `ERROR_CODE` from `@velafa/cms-sdk`.

## Next.js `resolvePage` and `notFound()`

```ts
import { resolvePage } from "@velafa/cms-sdk/next";

const result = await resolvePage(cms, slug);
```

If Atlas returns `RESOLVE_NOT_FOUND`, the helper calls `notFound()` from `next/navigation`, which renders your `not-found.tsx` UI. Other errors propagate to the nearest error boundary.

`generateMetadata` may also call `notFound()` the same way when it uses `resolvePage`.

## Network and retries

The SDK does **not** retry failed requests. For transient failures:

- Use your platform’s retries (edge config, queue), or
- Wrap calls with your own retry helper and pass `signal` for timeouts

```ts
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8_000);
try {
  await cms.resolve("/", { signal: controller.signal });
} finally {
  clearTimeout(timer);
}
```
