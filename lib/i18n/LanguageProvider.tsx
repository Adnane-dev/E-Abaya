"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Locale, DEFAULT_LOCALE, isLocale, getDirection } from "./locales";
import { Dictionary, getDictionary } from "./dictionary";

const STORAGE_KEY = "locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Corrects the locale client-side after mount — app/layout.tsx keeps a
  // static lang="fr" on <html> (reading cookies() there would force the
  // whole app dynamic, the same trap already avoided for site_settings).
  // Same accepted first-paint flash already used for the dark/light theme.
  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);

  function setLocale(next: Locale) {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000`;
    setLocaleState(next);
  }

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t: getDictionary(locale),
    dir: getDirection(locale),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguageContext must be used within a LanguageProvider");
  return ctx;
}
