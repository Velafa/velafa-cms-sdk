import type { CmsClient } from "../client.js";
import { CONTENT_TYPE, HTTP_HEADER, HTTP_STATUS } from "../constants/index.js";
import type { CmsRequestOptions } from "../types/index.js";

/**
 * Proxies Atlas sitemap XML for `app/sitemap.xml/route.ts`.
 * Not for Next `app/sitemap.ts` (`MetadataRoute.Sitemap` is a different shape).
 */
export async function sitemapResponse(
  client: CmsClient,
  options?: CmsRequestOptions,
): Promise<Response> {
  const xml = await client.getSitemap(options);
  return new Response(xml, {
    status: HTTP_STATUS.OK,
    headers: {
      [HTTP_HEADER.CONTENT_TYPE]: CONTENT_TYPE.XML,
    },
  });
}
