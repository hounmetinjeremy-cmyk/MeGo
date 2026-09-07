import { TLocale } from '../types/locale';
import { DEFAULT_LOCALE } from '../constants';

// Static export (Cloudflare Workers static assets, no Node server) can't run
// Server Actions or read cookies per-request — mego serves one fixed locale
// (see i18n/request.ts) instead of per-user language switching.
export async function getUserLocale() {
  return DEFAULT_LOCALE;
}

export async function setUserLocale(_locale: TLocale) {
  // No-op: language switching isn't available in this static deployment.
}
