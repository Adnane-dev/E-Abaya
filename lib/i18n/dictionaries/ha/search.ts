import { SearchDict } from "../types";

export const search: SearchDict = {
  ariaLabel: "Bincike",
  placeholder: "Bincike",
  productsHeading: "Kayayyaki",
  shopsHeading: "Shaguna",
  categoriesHeading: "Rukunoni",
  noResults: "Babu sakamako.",
  seeAllResults: (query) => `Duba dukan sakamako na « ${query} »`,
  resultsFor: (query) => `Sakamako na « ${query} »`,
};
