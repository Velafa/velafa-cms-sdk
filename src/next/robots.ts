import type { CmsClient } from "../client.js";
import {
  CHARSET,
  CONTENT_TYPE,
  HTTP_HEADER,
  HTTP_STATUS,
} from "../constants/index.js";
import type { CmsRequestOptions } from "../types/index.js";

/** Proxies Atlas robots.txt for `app/robots.txt/route.ts`. */
export async function robotsTxtResponse(
  client: CmsClient,
  options?: CmsRequestOptions,
): Promise<Response> {
  const text = await client.getRobotsTxt(options);
  return new Response(text, {
    status: HTTP_STATUS.OK,
    headers: {
      [HTTP_HEADER.CONTENT_TYPE]: `${CONTENT_TYPE.PLAIN}; ${CHARSET.UTF8}`,
    },
  });
}
