"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Product, getDiscountedPrice } from "@/types/product";
import { scrollReveal, staggerDelay } from "@/lib/motion";
import { ProductQuickView } from "@/components/products/ProductQuickView";
import { WishlistButton } from "@/components/products/WishlistButton";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, shops(name, slug)")
        .order("created_at", { ascending: false })
        .limit(10);
      setProducts((data as Product[]) ?? []);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">
        Nos coups de cœur
      </h2>

      {!isLoading && products.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Le catalogue arrive très bientôt — revenez vite !
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            {...scrollReveal}
            transition={{ ...scrollReveal.transition, ...staggerDelay(i, 0.05) }}
            className="group relative rounded-md border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div
              className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden cursor-pointer bg-muted"
              onClick={() => setSelectedProduct(product)}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {(product.discount_percent ?? 0) > 0 && (
                <span className="absolute top-2 left-2 text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  -{product.discount_percent}%
                </span>
              )}
              <WishlistButton productId={product.id} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background shadow-sm" size="h-3.5 w-3.5" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/40 transition-opacity duration-300">
                <button
                  aria-label={`Voir les détails de ${product.name}`}
                  className="p-3 rounded-full bg-background text-foreground shadow-md hover:bg-accent hover:text-accent-foreground transition duration-300"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm text-muted-foreground">{product.category}</h3>
              <p className="mt-1 text-sm sm:text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {product.name}
              </p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <p className="text-sm sm:text-lg text-accent">
                  {getDiscountedPrice(product).toLocaleString("fr-FR")} CFA
                </p>
                {(product.discount_percent ?? 0) > 0 && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-through">
                    {product.price.toLocaleString("fr-FR")} CFA
                  </p>
                )}
              </div>
              {product.shops && (
                <p className="mt-1 text-xs text-muted-foreground">Vendu par {product.shops.name}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
