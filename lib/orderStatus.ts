import { Locale } from "./i18n/locales";

const STATUS_LABELS_BY_LOCALE: Record<string, Record<Locale, string>> = {
  pending: { fr: "En attente", en: "Pending", ha: "Ana jira", ar: "قيد الانتظار" },
  confirmed: { fr: "Confirmée", en: "Confirmed", ha: "An tabbatar", ar: "مؤكد" },
  picked_up: {
    fr: "Récupérée par le livreur",
    en: "Picked up by courier",
    ha: "Mai kaiwa ya karɓa",
    ar: "استلمها عامل التوصيل",
  },
  shipped: { fr: "Expédiée", en: "Shipped", ha: "An aika", ar: "تم الشحن" },
  delivered: { fr: "Livrée", en: "Delivered", ha: "An kai", ar: "تم التوصيل" },
  cancelled: { fr: "Annulée", en: "Cancelled", ha: "An soke", ar: "ملغي" },
};

export function getStatusLabel(status: string, locale: Locale): string {
  return STATUS_LABELS_BY_LOCALE[status]?.[locale] ?? status;
}

// French-only map kept for the admin/vendeur dashboards, not yet wired to
// the language switcher (see plan: dashboards are translated in wave 2).
export const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_LABELS_BY_LOCALE).map(([status, labels]) => [status, labels.fr])
);
