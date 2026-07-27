import { notFound } from "next/navigation";
import type { CmsClient } from "../client.js";
import { isResolveNotFound } from "../errors.js";
import type { LocaleOptions, ResolveResult } from "../types/index.js";
import { cmsPathFromSegments } from "./path.js";

/**
 * Resolves a catch-all path; calls `notFound()` on Atlas `RESOLVE_NOT_FOUND`.
 */
export async function resolvePage(
  client: CmsClient,
  segments?: readonly string[] | string | null,
  options?: LocaleOptions,
): Promise<ResolveResult> {
  const path = cmsPathFromSegments(segments);

  try {
    return await client.resolve(path, options);
  } catch (error) {
    if (isResolveNotFound(error)) {
      notFound();
    }
    throw error;
  }
}
