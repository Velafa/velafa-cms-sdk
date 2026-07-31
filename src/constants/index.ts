export const LAYOUT_PRESET = {
  CONTENT_PAGE: "content-page",
  LISTING: "listing",
  BLOG_ARTICLE: "blog-article",
  DOCS_ARTICLE: "docs-article",
  LANDING: "landing",
} as const;

export const SECTION_TYPE = {
  HERO: "hero",
  PARAGRAPH: "paragraph",
  LIST: "list",
  GALLERY: "gallery",
  CTA: "cta",
  QUOTE: "quote",
} as const;

export const GALLERY_VARIANT = {
  CAROUSEL: "carousel",
  GRID: "grid",
} as const;

export const PAGE_TYPE = {
  STATIC: "static",
  COLLECTION: "collection",
  DYNAMIC: "dynamic",
} as const;

export const ERROR_CODE = {
  RESOLVE_NOT_FOUND: "RESOLVE_NOT_FOUND",
  DATA_FEED_NOT_FOUND: "DATA_FEED_NOT_FOUND",
  ARTIFACT_NOT_FOUND: "ARTIFACT_NOT_FOUND",
  ENVIRONMENT_NOT_FOUND: "ENVIRONMENT_NOT_FOUND",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  NETWORK_ERROR: 0,
} as const;

export const HTTP_HEADER = {
  CONTENT_TYPE: "Content-Type",
} as const;

export const CONTENT_TYPE = {
  JSON: "application/json",
  XML: "application/xml",
  PLAIN: "text/plain",
} as const;

export const CONTENT_TYPE_MATCH = {
  TEXT_PREFIX: "text/",
  XML_TOKEN: "xml",
} as const;

export const CHARSET = {
  UTF8: "charset=utf-8",
} as const;

export const ENV_VAR = {
  ATLAS_URL: "VELAFA_ATLAS_URL",
  SITE_ID: "VELAFA_SITE_ID",
  ENV_ID: "VELAFA_ENV_ID",
  DEFAULT_LOCALE: "VELAFA_DEFAULT_LOCALE",
} as const;

export const API_PATH_SEGMENT = {
  PUBLIC: "public",
  SITES: "sites",
  ENVS: "envs",
  RESOLVE: "resolve",
  COLLECTIONS: "collections",
  ENTRIES: "entries",
  DATA_FEEDS: "data-feeds",
  SITEMAP_XML: "sitemap.xml",
  LLMS_TXT: "llms.txt",
  LLMS_FULL_TXT: "llms-full.txt",
  ROBOTS_TXT: "robots.txt",
} as const;

export const API_QUERY_PARAM = {
  PATH: "path",
  LOCALE: "locale",
} as const;

export const SPOTIFY_LIVE_KEY = {
  CURRENTLY_PLAYING: "spotify-currently-playing",
  TOP_TRACKS_ALL_TIME: "spotify-top-tracks-all-time",
  TOP_TRACKS_THIS_YEAR: "spotify-top-tracks-this-year",
  TOP_ARTISTS_ALL_TIME: "spotify-top-artists-all-time",
  TOP_ARTISTS_THIS_YEAR: "spotify-top-artists-this-year",
  TOP_GENRES_ALL_TIME: "spotify-top-genres-all-time",
  TOP_GENRES_THIS_YEAR: "spotify-top-genres-this-year",
} as const;

export const ENTRY_FIELD = {
  TITLE: "title",
} as const;

export const CLIENT_ERRORS = {
  INVALID_RESPONSE: {
    code: ERROR_CODE.INVALID_RESPONSE,
    status: HTTP_STATUS.INTERNAL_ERROR,
    message: "Invalid response from server.",
  },
  EMPTY_DATA: {
    code: ERROR_CODE.INVALID_RESPONSE,
    status: HTTP_STATUS.INTERNAL_ERROR,
    message: "Response succeeded but returned no data.",
  },
  UNEXPECTED_CONTENT_TYPE: {
    code: ERROR_CODE.INVALID_RESPONSE,
    status: HTTP_STATUS.INTERNAL_ERROR,
    message: "Unexpected content type from server.",
  },
  INVALID_JSON: {
    code: ERROR_CODE.INVALID_RESPONSE,
    status: HTTP_STATUS.INTERNAL_ERROR,
    message: "Invalid JSON response from server.",
  },
  NETWORK_FAILED: {
    code: ERROR_CODE.NETWORK_ERROR,
    status: HTTP_STATUS.NETWORK_ERROR,
    message: "Network request failed.",
  },
  BASE_URL_REQUIRED: {
    code: ERROR_CODE.VALIDATION_FAILED,
    status: HTTP_STATUS.BAD_REQUEST,
    message: "baseUrl is required.",
  },
  SITE_ID_REQUIRED: {
    code: ERROR_CODE.VALIDATION_FAILED,
    status: HTTP_STATUS.BAD_REQUEST,
    message: "siteId is required.",
  },
  ENV_ID_REQUIRED: {
    code: ERROR_CODE.VALIDATION_FAILED,
    status: HTTP_STATUS.BAD_REQUEST,
    message: "envId is required.",
  },
  MISSING_ENV_VAR: {
    code: ERROR_CODE.VALIDATION_FAILED,
    status: HTTP_STATUS.INTERNAL_ERROR,
    message: "Missing required environment variable.",
  },
} as const satisfies Record<
  string,
  { code: string; status: number; message: string }
>;
