import { createCmsClient, type CmsClient } from "../client.js";
import { CLIENT_ERRORS, ENV_VAR } from "../constants/index.js";
import { throwClientError } from "../errors.js";

/**
 * Build a CMS client from `ENV_VAR` (`VELAFA_*`) process env.
 * Required: `ATLAS_URL`, `SITE_ID`, `ENV_ID`. Optional: `DEFAULT_LOCALE`.
 */
export function createCmsClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): CmsClient {
  const baseUrl = requireEnv(env, ENV_VAR.ATLAS_URL);
  const siteId = requireEnv(env, ENV_VAR.SITE_ID);
  const envId = requireEnv(env, ENV_VAR.ENV_ID);
  const defaultLocale = env[ENV_VAR.DEFAULT_LOCALE]?.trim() || undefined;

  return createCmsClient({
    baseUrl,
    siteId,
    envId,
    defaultLocale,
  });
}

function requireEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) {
    throwClientError(
      CLIENT_ERRORS.MISSING_ENV_VAR,
      `${CLIENT_ERRORS.MISSING_ENV_VAR.message} ${name}.`,
    );
  }
  return value;
}
