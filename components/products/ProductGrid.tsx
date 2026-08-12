"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProductQuickView } from "./ProductQuickView";
import { WishlistButton } from "./WishlistButton";
import { ActiveFilters, Product, getDiscountedPrice } from "@/types/product";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { scrollReveal, staggerDelay } from "@/lib/motion";

interface ProductGridProps {
  products: Product[];
  filters: ActiveFilters;
}

export function ProductGrid({ products, filters }: ProductGridProps) {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const isCategoryMatch = filters.categories.length
      ? filters.categories.includes(product.category)
      : true;
    const isBrandMatch = filters.brands.length
      ? filters.brands.includes(product.brand || "")
      : true;
    const isColorMatch = filters.colors.length
      ? product.colors?.some((color) => filters.colors.includes(color))
      : true;
    const isSizeMatch = filters.sizes.length
      ? product.sizes?.some((size) => filters.sizes.includes(size))
      : true;
    const isPriceMatch =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    return isCategoryMatch && isBrandMatch && isColorMatch && isSizeMatch && isPriceMatch;
  });

  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        {t.home.featured.empty}
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            {...scrollReveal}
            transition={{ ...scrollReveal.transition, ...staggerDelay(i % 6, 0.06) }}
            className="group relative rounded-lg border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative w-full h-64 rounded-t-lg overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {(product.discount_percent ?? 0) > 0 && (
                <span className="absolute top-2 left-2 text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  -{product.discount_percent}%
                </span>
              )}
              {!product.in_stock && (
                <span className="absolute bottom-2 left-2 text-xs font-semibold bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                  {t.products.outOfStock}
                </span>
              )}
              <WishlistButton productId={product.id} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background shadow-sm" />
            </div>
            <div className="p-4">
              <h3 className="text-sm text-muted-foreground">{product.category}</h3>
              <p className="mt-1 text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                {product.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-lg text-accent">
                  {getDiscountedPrice(product).toLocaleString("fr-FR")} CFA
                </p>
                {(product.discount_percent ?? 0) > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    {product.price.toLocaleString("fr-FR")} CFA
                  </p>
                )}
              </div>
              {product.shops && (
                <p className="mt-1 text-xs text-muted-foreground">{t.products.soldBy(product.shops.name)}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          {t.products.noResults}
        </p>
      )}

      <ProductQuickView
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
