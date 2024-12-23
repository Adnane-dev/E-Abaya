import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { featuredProducts } from "@/public/featured-products"; // Importation de vos données locales

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Essayez de récupérer le produit via l'API
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        // Si une erreur survient, essayer de récupérer depuis les données locales
        setError("An error occurred while fetching the product.");
        const fallbackProduct = featuredProducts.find(
          (product) => product.id === productId
        );
        if (fallbackProduct) {
          setProduct(fallbackProduct); // Définir un produit à partir des données locales
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
}
