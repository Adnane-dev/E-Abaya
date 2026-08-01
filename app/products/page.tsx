"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort, SortOption } from "@/components/products/ProductSort";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/layout/SearchBar";
import { createClient } from "@/lib/supabase";
import { ActiveFilters, Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 100000],
  });

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, shops(name, slug)")
        .order("created_at", { ascending: false });
      setProducts((data as Product[]) ?? []);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortOption === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sortOption === "price-high") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, sortOption]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters products={products} filters={activeFilters} onChange={setActiveFilters} />
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-foreground">Tous les produits</h1>
              <ProductSort value={sortOption} onChange={setSortOption} />
            </div>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Chargement…</p>
            ) : (
              <ProductGrid products={sortedProducts} filters={activeFilters} />
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
