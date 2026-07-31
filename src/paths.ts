import { API_PATH_SEGMENT, API_QUERY_PARAM } from "./constants/index.js";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

function buildPublicSitePath(
  siteId: string,
  ...segments: string[]
): string {
  return [
    "",
    API_PATH_SEGMENT.PUBLIC,
    API_PATH_SEGMENT.SITES,
    encodeSegment(siteId),
    ...segments,
  ].join("/");
}

export function buildResolveUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
  path: string,
  locale?: string,
): string {
  const url = new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.RESOLVE,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  );
  url.searchParams.set(API_QUERY_PARAM.PATH, path);
  if (locale) {
    url.searchParams.set(API_QUERY_PARAM.LOCALE, locale);
  }
  return url.toString();
}

export function buildDataFeedUrl(
  baseUrl: string,
  siteId: string,
  key: string,
  locale?: string,
): string {
  const url = new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.DATA_FEEDS,
      encodeSegment(key),
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  );
  if (locale) {
    url.searchParams.set(API_QUERY_PARAM.LOCALE, locale);
  }
  return url.toString();
}

export function buildSitemapUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
): string {
  return new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.SITEMAP_XML,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  ).toString();
}

export function buildLlmsTxtUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
): string {
  return new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.LLMS_TXT,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  ).toString();
}

export function buildLlmsFullTxtUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
): string {
  return new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.LLMS_FULL_TXT,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  ).toString();
}

export function buildRobotsTxtUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
): string {
  return new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.ROBOTS_TXT,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  ).toString();
}

export function buildCollectionEntriesUrl(
  baseUrl: string,
  siteId: string,
  envId: string,
  collectionId: string,
  locale?: string,
): string {
  const url = new URL(
    buildPublicSitePath(
      siteId,
      API_PATH_SEGMENT.ENVS,
      encodeSegment(envId),
      API_PATH_SEGMENT.COLLECTIONS,
      encodeSegment(collectionId),
      API_PATH_SEGMENT.ENTRIES,
    ),
    `${trimTrailingSlash(baseUrl)}/`,
  );
  if (locale) {
    url.searchParams.set(API_QUERY_PARAM.LOCALE, locale);
  }
  return url.toString();
}
