import { SearchDict } from "../types";

export const search: SearchDict = {
  ariaLabel: "بحث",
  placeholder: "بحث",
  productsHeading: "المنتجات",
  shopsHeading: "المتاجر",
  categoriesHeading: "الفئات",
  noResults: "لا توجد نتائج.",
  seeAllResults: (query) => `عرض كل النتائج لـ « ${query} »`,
  resultsFor: (query) => `النتائج لـ « ${query} »`,
};
