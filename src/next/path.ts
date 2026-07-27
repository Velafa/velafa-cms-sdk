/**
 * Maps App Router catch-all segments to a CMS path
 * (`undefined` / `[]` → `/`, `["blog","hello"]` → `/blog/hello`).
 */
export function cmsPathFromSegments(
  segments?: readonly string[] | string | null,
): string {
  if (segments == null) {
    return "/";
  }

  if (typeof segments === "string") {
    return normalizePath(segments);
  }

  if (segments.length === 0) {
    return "/";
  }

  return normalizePath(segments.join("/"));
}

function normalizePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }
  const withoutLeading = trimmed.replace(/^\/+/, "");
  return `/${withoutLeading}`;
}
