import { SearchDict } from "../types";

export const search: SearchDict = {
  ariaLabel: "Search",
  placeholder: "Search",
  productsHeading: "Products",
  shopsHeading: "Shops",
  categoriesHeading: "Categories",
  noResults: "No results.",
  seeAllResults: (query) => `See all results for "${query}"`,
  resultsFor: (query) => `Results for "${query}"`,
};
