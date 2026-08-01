import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase";

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      }
      setProduct((data as Product) ?? null);
      setIsLoading(false);
    }

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
}
