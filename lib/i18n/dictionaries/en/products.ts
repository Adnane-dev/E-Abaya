import { ProductsDict } from "../types";

export const products: ProductsDict = {
  pageTitle: "All products",
  filters: {
    title: "Filters",
    categoriesHeading: "Categories",
    budgetHeading: "Budget",
    brandsHeading: "Brands",
    colorsHeading: "Colors",
    sizesHeading: "Sizes",
    resetButton: "Reset filters",
    mobileButton: "Filters",
    closeAria: "Close filters",
    viewResults: (count) => `View ${count} result${count !== 1 ? "s" : ""}`,
  },
  sort: {
    placeholder: "Sort by",
    newest: "Newest",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
  },
  collectionTitle: (category) => `${category} collection`,
  searchPlaceholder: (category) => `Search for a ${category.toLowerCase()} piece...`,
  allColors: "All colors",
  allMaterials: "All materials",
  allPrices: "All prices",
  noProductsInCategory: (category) => `No ${category.toLowerCase()} pieces online yet — check back very soon.`,
  noResults: "No products match your filters.",
  inStock: "In stock",
  outOfStock: "Out of stock",
  soldBy: (name) => `Sold by ${name}`,
};
