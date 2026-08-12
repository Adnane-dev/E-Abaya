import { Locale, DEFAULT_LOCALE } from "./locales";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";
import { ha } from "./dictionaries/ha";
import { ar } from "./dictionaries/ar";

export type Dictionary = typeof fr;

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ha, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
