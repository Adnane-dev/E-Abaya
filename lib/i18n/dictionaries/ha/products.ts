import { ProductsDict } from "../types";

export const products: ProductsDict = {
  pageTitle: "Duk kayayyaki",
  filters: {
    title: "Tace",
    categoriesHeading: "Rukunoni",
    budgetHeading: "Kudi",
    brandsHeading: "Alamomi",
    colorsHeading: "Launuka",
    sizesHeading: "Girma",
    resetButton: "Sake saita tace",
    mobileButton: "Tace",
    closeAria: "Rufe tace",
    viewResults: (count) => `Duba sakamako ${count}`,
  },
  sort: {
    placeholder: "Jera ta",
    newest: "Sabbi",
    priceLow: "Kudi mafi ƴanƴanci",
    priceHigh: "Kudi mafi tsada",
  },
  collectionTitle: (category) => `Tarin ${category}`,
  searchPlaceholder: (category) => `Bincika kayan ${category.toLowerCase()}...`,
  allColors: "Duk launuka",
  allMaterials: "Duk kayan aikin",
  allPrices: "Duk kudi",
  noProductsInCategory: (category) => `Babu kayan ${category.toLowerCase()} a yanzu — ku dawo daga baya.`,
  noResults: "Babu kaya da suka dace da tace naki.",
  inStock: "Akwai",
  outOfStock: "Babu",
  soldBy: (name) => `An sayar da shi daga ${name}`,
};
