import { getRequestConfig } from "next-intl/server";

// Static export (Cloudflare Workers static assets, no Node server) can't
// read a per-request locale cookie — mego serves one fixed locale (French)
// for this site instead of per-user language switching.
const STATIC_LOCALE = "fr";

export default getRequestConfig(async () => ({
  locale: STATIC_LOCALE,
  messages: (await import(`../locales/${STATIC_LOCALE}.json`)).default,
}));
