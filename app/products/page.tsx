"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { ProductSort } from "@/components/products/ProductSort";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase";
import { useProductFilters } from "@/lib/useProductFilters";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Product } from "@/types/product";

function ProductsPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { filters, sort, setFilters, setSort, resetFilters, maxPrice } = useProductFilters(products);

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

  const textFiltered = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const sortedProducts = [...textFiltered];
  if (sort === "price-low") sortedProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-high") sortedProducts.sort((a, b) => b.price - a.price);

  function clearSearch() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const visibleCount = sortedProducts.filter((product) => {
    const isCategoryMatch = filters.categories.length ? filters.categories.includes(product.category) : true;
    const isBrandMatch = filters.brands.length ? filters.brands.includes(product.brand || "") : true;
    const isColorMatch = filters.colors.length ? product.colors?.some((c) => filters.colors.includes(c)) : true;
    const isSizeMatch = filters.sizes.length ? product.sizes?.some((s) => filters.sizes.includes(s)) : true;
    const isPriceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    return isCategoryMatch && isBrandMatch && isColorMatch && isSizeMatch && isPriceMatch;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {searchTerm && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t.search.resultsFor(searchTerm)}</span>
            <button onClick={clearSearch} className="p-1 hover:text-accent" aria-label={t.common.close}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
            <ProductFilters products={products} filters={filters} onChange={setFilters} onReset={resetFilters} maxPrice={maxPrice} />
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h1 className="font-serif text-2xl font-bold text-foreground">{t.products.pageTitle}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden px-4 py-2 bg-background border border-border rounded-lg flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {t.products.filters.mobileButton}
                </button>
                <ProductSort value={sort} onChange={setSort} />
              </div>
            </div>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">{t.common.loading}</p>
            ) : (
              <ProductGrid products={sortedProducts} filters={filters} />
            )}
          </main>
        </div>
      </div>

      <MobileFilterDrawer isOpen={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} resultCount={visibleCount}>
        <ProductFilters products={products} filters={filters} onChange={setFilters} onReset={resetFilters} maxPrice={maxPrice} />
      </MobileFilterDrawer>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
}
