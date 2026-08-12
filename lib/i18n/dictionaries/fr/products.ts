import { ProductsDict } from "../types";

export const products: ProductsDict = {
  pageTitle: "Tous les produits",
  filters: {
    title: "Filtres",
    categoriesHeading: "Catégories",
    budgetHeading: "Budget",
    brandsHeading: "Marques",
    colorsHeading: "Couleurs",
    sizesHeading: "Tailles",
    resetButton: "Réinitialiser les filtres",
    mobileButton: "Filtres",
    closeAria: "Fermer les filtres",
    viewResults: (count) => `Voir ${count} résultat${count !== 1 ? "s" : ""}`,
  },
  sort: {
    placeholder: "Trier par",
    newest: "Nouveautés",
    priceLow: "Prix croissant",
    priceHigh: "Prix décroissant",
  },
  collectionTitle: (category) => `Collection ${category}`,
  searchPlaceholder: (category) => `Rechercher une pièce ${category.toLowerCase()}...`,
  allColors: "Toutes les couleurs",
  allMaterials: "Toutes les matières",
  allPrices: "Tous les prix",
  noProductsInCategory: (category) => `Aucune pièce ${category.toLowerCase()} en ligne pour le moment — revenez très vite.`,
  noResults: "Aucun produit ne correspond à vos filtres.",
  inStock: "En stock",
  outOfStock: "Rupture",
  soldBy: (name) => `Vendu par ${name}`,
};
