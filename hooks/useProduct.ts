import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { featuredProducts } from "@/public/featured-products"; // Importation de vos données locales

// Le hook utilise maintenant les données de featuredProducts
export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recherche du produit par ID dans les featuredProducts
    const foundProduct = featuredProducts.find((p) => p.id === id);

    // Mise à jour de l'état avec le produit trouvé ou null si non trouvé
    setProduct(foundProduct || null);
    setIsLoading(false); // Fin du chargement
  }, [id]); // Rechercher à chaque changement d'ID

  return { product, isLoading }; // Retour du produit et état de chargement
}
