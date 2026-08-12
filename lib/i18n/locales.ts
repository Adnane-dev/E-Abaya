export type Locale = "fr" | "en" | "ha" | "ar";

export const LOCALES: Locale[] = ["fr", "en", "ha", "ar"];
export const DEFAULT_LOCALE: Locale = "fr";
export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ha: "Hausa",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
