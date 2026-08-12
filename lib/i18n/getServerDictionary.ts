import { cookies } from "next/headers";
import { Locale, DEFAULT_LOCALE, isLocale } from "./locales";
import { getDictionary } from "./dictionary";

// For async Server Components that need translations without becoming
// Client Components — reads the same "locale" cookie LanguageProvider
// writes client-side. Only safe to use in routes that are already
// dynamic (read cookies elsewhere too), since cookies() forces dynamic
// rendering — see app/layout.tsx's comment on why it deliberately avoids
// this for the site-wide accent color read.
export async function getServerDictionary() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  const locale: Locale = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { locale, t: getDictionary(locale) };
}
