import { SearchDict } from "../types";

export const search: SearchDict = {
  ariaLabel: "Rechercher",
  placeholder: "Rechercher",
  productsHeading: "Produits",
  shopsHeading: "Boutiques",
  categoriesHeading: "Catégories",
  noResults: "Aucun résultat.",
  seeAllResults: (query) => `Voir tous les résultats pour « ${query} »`,
  resultsFor: (query) => `Résultats pour « ${query} »`,
};
