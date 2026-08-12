import { Locale } from "./locales";

const COLOR_LABELS: Record<string, Record<Locale, string>> = {
  Black: { fr: "Noir", en: "Black", ha: "Baƙi", ar: "أسود" },
  White: { fr: "Blanc", en: "White", ha: "Fari", ar: "أبيض" },
  Beige: { fr: "Beige", en: "Beige", ha: "Beige", ar: "بيج" },
  Gold: { fr: "Or", en: "Gold", ha: "Zinare", ar: "ذهبي" },
  Navy: { fr: "Bleu marine", en: "Navy", ha: "Shuɗi mai duhu", ar: "كحلي" },
  Blue: { fr: "Bleu", en: "Blue", ha: "Shuɗi", ar: "أزرق" },
  "Denim Blue": { fr: "Bleu denim", en: "Denim Blue", ha: "Shuɗin Denim", ar: "أزرق جينز" },
  Burgundy: { fr: "Bordeaux", en: "Burgundy", ha: "Ja mai duhu", ar: "خمري" },
  Cream: { fr: "Crème", en: "Cream", ha: "Kirim", ar: "كريمي" },
  Brown: { fr: "Marron", en: "Brown", ha: "Ruwan kasa", ar: "بني" },
  Green: { fr: "Vert", en: "Green", ha: "Kore", ar: "أخضر" },
  Pink: { fr: "Rose", en: "Pink", ha: "Ruwan hoda", ar: "وردي" },
  Red: { fr: "Rouge", en: "Red", ha: "Ja", ar: "أحمر" },
  Gray: { fr: "Gris", en: "Gray", ha: "Toka", ar: "رمادي" },
  Silver: { fr: "Argent", en: "Silver", ha: "Azurfa", ar: "فضي" },
  Ivory: { fr: "Ivoire", en: "Ivory", ha: "Farin hauren giwa", ar: "عاجي" },
};

// Fixed, small enum of vendor-entered color values (not free text), so a
// lookup table is safe here — unlike product names/descriptions, which stay
// untranslated by design (see plan: only UI chrome + this fixed color set
// are localized, not vendor-authored content).
export function getColorLabel(raw: string, locale: Locale): string {
  const entry = COLOR_LABELS[raw] ?? COLOR_LABELS[raw?.trim()];
  return entry?.[locale] ?? raw;
}
