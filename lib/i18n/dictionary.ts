import { Locale, DEFAULT_LOCALE } from "./locales";
import { CommonDict, NavDict, FooterDict, HomeDict, ProductsDict } from "./dictionaries/types";

import { common as commonFr } from "./dictionaries/fr/common";
import { nav as navFr } from "./dictionaries/fr/nav";
import { footer as footerFr } from "./dictionaries/fr/footer";
import { home as homeFr } from "./dictionaries/fr/home";
import { products as productsFr } from "./dictionaries/fr/products";

import { common as commonEn } from "./dictionaries/en/common";
import { nav as navEn } from "./dictionaries/en/nav";
import { footer as footerEn } from "./dictionaries/en/footer";
import { home as homeEn } from "./dictionaries/en/home";
import { products as productsEn } from "./dictionaries/en/products";

import { common as commonHa } from "./dictionaries/ha/common";
import { nav as navHa } from "./dictionaries/ha/nav";
import { footer as footerHa } from "./dictionaries/ha/footer";
import { home as homeHa } from "./dictionaries/ha/home";
import { products as productsHa } from "./dictionaries/ha/products";

import { common as commonAr } from "./dictionaries/ar/common";
import { nav as navAr } from "./dictionaries/ar/nav";
import { footer as footerAr } from "./dictionaries/ar/footer";
import { home as homeAr } from "./dictionaries/ar/home";
import { products as productsAr } from "./dictionaries/ar/products";

export interface Dictionary {
  common: CommonDict;
  nav: NavDict;
  footer: FooterDict;
  home: HomeDict;
  products: ProductsDict;
}

const DICTIONARIES: Record<Locale, Dictionary> = {
  fr: { common: commonFr, nav: navFr, footer: footerFr, home: homeFr, products: productsFr },
  en: { common: commonEn, nav: navEn, footer: footerEn, home: homeEn, products: productsEn },
  ha: { common: commonHa, nav: navHa, footer: footerHa, home: homeHa, products: productsHa },
  ar: { common: commonAr, nav: navAr, footer: footerAr, home: homeAr, products: productsAr },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
