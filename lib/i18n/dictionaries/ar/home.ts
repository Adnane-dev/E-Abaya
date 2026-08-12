import { HomeDict } from "../types";

export const home: HomeDict = {
  hero: {
    ariaLabel: "تقديم متجر Islamic Style-Girls",
    kicker: "أزياء محتشمة، أفريقيا وعالم العرب",
    title: "أناقة الحجاب، بروح جديدة",
    subtitle:
      "عبايات وحجابات وقفاطين وفساتين مُختارة بعناية، تجمع بين التراث الأفريقي والرقي العربي.",
    ctaPrimary: "تصفح أحدث المنتجات",
    ctaSecondary: "قصتنا",
  },
  featured: {
    heading: "مفضلاتنا",
    empty: "الكتالوج قادم قريبًا جدًا — عودوا لاحقًا!",
    viewDetails: (name) => `عرض تفاصيل ${name}`,
    soldBy: (name) => `يُباع من قبل ${name}`,
  },
  categoriesShowcase: {
    heading: "عالمنا",
    discover: (name) => `اكتشف ${name}`,
  },
  newsletter: {
    heading: "تابعي جديدنا",
    subtitle:
      "سجّلي لتكوني أول من يكتشف مجموعاتنا الجديدة وعروضنا الحصرية.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "بريدك الإلكتروني",
    submit: "اشتراك",
    submitting: "جارٍ الإرسال…",
    alreadySubscribed: "أنتِ مسجّلة مسبقًا في نشرتنا الإخبارية.",
    error: (message) => `خطأ في التسجيل: ${message}`,
    success: "شكرًا لك! تم تسجيلك في نشرتنا الإخبارية.",
    privacyNotice: "نحترم خصوصيتك. راجعي",
    privacyLink: "سياسة الخصوصية",
  },
};
