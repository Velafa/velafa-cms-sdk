import {
  CLIENT_ERRORS,
  CONTENT_TYPE,
  CONTENT_TYPE_MATCH,
  HTTP_HEADER,
} from "./constants/index.js";
import { parseEnvelope, unwrapEnvelope } from "./envelope.js";
import { CmsApiError, throwClientError } from "./errors.js";
import {
  buildCollectionEntriesUrl,
  buildLiveItemUrl,
  buildLlmsFullTxtUrl,
  buildLlmsTxtUrl,
  buildResolveUrl,
  buildRobotsTxtUrl,
  buildSitemapUrl,
} from "./paths.js";
import type {
  CmsClientConfig,
  CmsRequestOptions,
  Entry,
  LiveItem,
  LocaleOptions,
  ResolveResult,
} from "./types/index.js";

export interface CmsClient {
  readonly config: Readonly<
    Pick<CmsClientConfig, "baseUrl" | "siteId" | "envId" | "defaultLocale">
  >;
  /**
   * @param path CMS path including leading slash (e.g. `/blog/hello-world`).
   */
  resolve(path: string, options?: LocaleOptions): Promise<ResolveResult>;
  listEntries(
    collectionId: string,
    options?: LocaleOptions,
  ): Promise<Entry[]>;
  getLiveItem(key: string, options?: LocaleOptions): Promise<LiveItem>;
  /** Published sitemap.xml artifact (raw XML). */
  getSitemap(options?: CmsRequestOptions): Promise<string>;
  /** Published llms.txt artifact (plain text). */
  getLlmsTxt(options?: CmsRequestOptions): Promise<string>;
  /** Published llms-full.txt artifact (plain text). */
  getLlmsFullTxt(options?: CmsRequestOptions): Promise<string>;
  /** Published robots.txt artifact (plain text). */
  getRobotsTxt(options?: CmsRequestOptions): Promise<string>;
}

/**
 * Public Atlas delivery client — no auth; configure `baseUrl`, `siteId`, `envId`.
 */
export function createCmsClient(config: CmsClientConfig): CmsClient {
  validateConfig(config);

  const baseUrl = trimTrailingSlash(config.baseUrl);
  const fetcher = config.fetch ?? fetch;
  const clientConfig = {
    baseUrl,
    siteId: config.siteId,
    envId: config.envId,
    defaultLocale: config.defaultLocale,
  } as const;

  return {
    config: clientConfig,

    async resolve(path, options = {}) {
      const locale = resolveLocale(options.locale, config.defaultLocale);
      const url = buildResolveUrl(
        baseUrl,
        config.siteId,
        config.envId,
        path,
        locale,
      );
      return requestJson<ResolveResult>(fetcher, url, options);
    },

    async listEntries(collectionId, options = {}) {
      const locale = resolveLocale(options.locale, config.defaultLocale);
      const url = buildCollectionEntriesUrl(
        baseUrl,
        config.siteId,
        config.envId,
        collectionId,
        locale,
      );
      return requestJson<Entry[]>(fetcher, url, options);
    },

    async getLiveItem(key, options = {}) {
      const locale = resolveLocale(options.locale, config.defaultLocale);
      const url = buildLiveItemUrl(baseUrl, config.siteId, key, locale);
      return requestJson<LiveItem>(fetcher, url, options);
    },

    async getSitemap(options = {}) {
      const url = buildSitemapUrl(baseUrl, config.siteId, config.envId);
      return requestText(fetcher, url, CONTENT_TYPE.XML, options);
    },

    async getLlmsTxt(options = {}) {
      const url = buildLlmsTxtUrl(baseUrl, config.siteId, config.envId);
      return requestText(fetcher, url, CONTENT_TYPE.PLAIN, options);
    },

    async getLlmsFullTxt(options = {}) {
      const url = buildLlmsFullTxtUrl(baseUrl, config.siteId, config.envId);
      return requestText(fetcher, url, CONTENT_TYPE.PLAIN, options);
    },

    async getRobotsTxt(options = {}) {
      const url = buildRobotsTxtUrl(baseUrl, config.siteId, config.envId);
      return requestText(fetcher, url, CONTENT_TYPE.PLAIN, options);
    },
  };
}

function validateConfig(config: CmsClientConfig): void {
  if (!config.baseUrl?.trim()) {
    throwClientError(CLIENT_ERRORS.BASE_URL_REQUIRED);
  }
  if (!config.siteId?.trim()) {
    throwClientError(CLIENT_ERRORS.SITE_ID_REQUIRED);
  }
  if (!config.envId?.trim()) {
    throwClientError(CLIENT_ERRORS.ENV_ID_REQUIRED);
  }
}

function resolveLocale(
  locale: string | undefined,
  defaultLocale: string | undefined,
): string | undefined {
  return locale ?? defaultLocale;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function toFetchInit(options: CmsRequestOptions): RequestInit {
  const init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {};

  if (options.cache !== undefined) {
    init.cache = options.cache;
  }
  if (options.signal !== undefined) {
    init.signal = options.signal;
  }
  if (options.next !== undefined) {
    init.next = options.next;
  }

  return init;
}

async function requestJson<T>(
  fetcher: typeof fetch,
  url: string,
  options: CmsRequestOptions,
): Promise<T> {
  const response = await safeFetch(fetcher, url, options);
  const body: unknown = await parseJsonBody(response);
  const envelope = parseEnvelope(body);

  if (!response.ok) {
    throw new CmsApiError(
      envelope.message,
      response.status,
      envelope.code,
    );
  }

  return unwrapEnvelope<T>(envelope, response.status);
}

async function requestText(
  fetcher: typeof fetch,
  url: string,
  expectedContentType: string,
  options: CmsRequestOptions,
): Promise<string> {
  const response = await safeFetch(fetcher, url, options);

  if (!response.ok) {
    await throwFromFailedResponse(response);
  }

  const contentType =
    response.headers.get(HTTP_HEADER.CONTENT_TYPE) ?? "";
  if (
    contentType &&
    !contentType.includes(expectedContentType) &&
    !contentType.includes(CONTENT_TYPE_MATCH.TEXT_PREFIX) &&
    !contentType.includes(CONTENT_TYPE_MATCH.XML_TOKEN)
  ) {
    throwClientError(CLIENT_ERRORS.UNEXPECTED_CONTENT_TYPE);
  }

  return response.text();
}

async function safeFetch(
  fetcher: typeof fetch,
  url: string,
  options: CmsRequestOptions,
): Promise<Response> {
  try {
    return await fetcher(url, toFetchInit(options));
  } catch (error) {
    if (error instanceof CmsApiError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : CLIENT_ERRORS.NETWORK_FAILED.message;
    throwClientError(CLIENT_ERRORS.NETWORK_FAILED, message);
  }
}

async function parseJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throwClientError(CLIENT_ERRORS.INVALID_JSON);
  }
}

async function throwFromFailedResponse(response: Response): Promise<never> {
  const contentType =
    response.headers.get(HTTP_HEADER.CONTENT_TYPE) ?? "";
  if (contentType.includes(CONTENT_TYPE.JSON)) {
    try {
      const body: unknown = await response.json();
      const envelope = parseEnvelope(body);
      throw new CmsApiError(
        envelope.message,
        response.status,
        envelope.code,
      );
    } catch (error) {
      if (error instanceof CmsApiError) {
        throw error;
      }
    }
  }

  throw new CmsApiError(
    `Request failed with status ${response.status}.`,
    response.status,
  );
}
