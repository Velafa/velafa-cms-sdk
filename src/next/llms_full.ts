import type { CmsClient } from "../client.js";
import {
  CHARSET,
  CONTENT_TYPE,
  HTTP_HEADER,
  HTTP_STATUS,
} from "../constants/index.js";
import type { CmsRequestOptions } from "../types/index.js";

/** Proxies Atlas llms-full.txt for `app/llms-full.txt/route.ts`. */
export async function llmsFullTxtResponse(
  client: CmsClient,
  options?: CmsRequestOptions,
): Promise<Response> {
  const text = await client.getLlmsFullTxt(options);
  return new Response(text, {
    status: HTTP_STATUS.OK,
    headers: {
      [HTTP_HEADER.CONTENT_TYPE]: `${CONTENT_TYPE.PLAIN}; ${CHARSET.UTF8}`,
    },
  });
}
