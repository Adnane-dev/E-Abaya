import { ProductsDict } from "../types";

export const products: ProductsDict = {
  pageTitle: "جميع المنتجات",
  filters: {
    title: "التصفية",
    categoriesHeading: "الفئات",
    budgetHeading: "الميزانية",
    brandsHeading: "الماركات",
    colorsHeading: "الألوان",
    sizesHeading: "المقاسات",
    resetButton: "إعادة تعيين التصفية",
    mobileButton: "التصفية",
    closeAria: "إغلاق التصفية",
    viewResults: (count) => `عرض ${count} نتيجة`,
  },
  sort: {
    placeholder: "الترتيب حسب",
    newest: "الأحدث",
    priceLow: "السعر: من الأقل للأعلى",
    priceHigh: "السعر: من الأعلى للأقل",
  },
  collectionTitle: (category) => `مجموعة ${category}`,
  searchPlaceholder: (category) => `البحث عن قطعة ${category}...`,
  allColors: "جميع الألوان",
  allMaterials: "جميع الخامات",
  allPrices: "جميع الأسعار",
  noProductsInCategory: (category) => `لا توجد قطع ${category} متوفرة حاليًا — عودوا قريبًا جدًا.`,
  noResults: "لا توجد منتجات تطابق عوامل التصفية.",
  inStock: "متوفر",
  outOfStock: "غير متوفر",
  soldBy: (name) => `يُباع من قبل ${name}`,
};
