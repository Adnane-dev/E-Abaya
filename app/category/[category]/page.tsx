"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { createClient } from "@/lib/supabase";
import { useProductFilters } from "@/lib/useProductFilters";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Product } from "@/types/product";

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
}

function CategoryPageContent() {
  const { t } = useTranslation();
  const params = useParams<{ category: string }>();
  const slug = params.category;

  const [category, setCategory] = useState<CategoryRow | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadCategoryAndProducts() {
      setIsLoading(true);
      const supabase = createClient();
      const { data: categoryRow } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", slug)
        .maybeSingle();

      setCategory(categoryRow ?? null);

      if (!categoryRow) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("*, shops(name, slug)")
        .eq("category", categoryRow.name);
      setProducts((data as Product[]) ?? []);
      setIsLoading(false);
    }
    loadCategoryAndProducts();
  }, [slug]);

  const categoryLabel = category?.name ?? "";
  const { filters, sort, setFilters, setSort, resetFilters, maxPrice } = useProductFilters(products, categoryLabel);

  if (category === null) {
    notFound();
  }
  if (category === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 flex items-center justify-center text-muted-foreground">
          {t.common.loading}
        </main>
        <Footer />
      </div>
    );
  }

  const visibleCount = products.filter((product) => {
    const isBrandMatch = filters.brands.length ? filters.brands.includes(product.brand || "") : true;
    const isColorMatch = filters.colors.length ? product.colors?.some((c) => filters.colors.includes(c)) : true;
    const isSizeMatch = filters.sizes.length ? product.sizes?.some((s) => filters.sizes.includes(s)) : true;
    const isPriceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    return isBrandMatch && isColorMatch && isSizeMatch && isPriceMatch;
  }).length;

  const sortedProducts = [...products];
  if (sort === "price-low") sortedProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-high") sortedProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-center mb-8 text-foreground">
            {t.products.collectionTitle(categoryLabel)}
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
              <ProductFilters
                products={products}
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                maxPrice={maxPrice}
                hideCategories
              />
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden px-4 py-2 bg-background border border-border rounded-lg flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {t.products.filters.mobileButton}
                </button>
                <ProductSort value={sort} onChange={setSort} />
              </div>

              {!isLoading && products.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">
                  {t.products.noProductsInCategory(categoryLabel)}
                </p>
              )}

              {!isLoading && products.length > 0 && (
                <ProductGrid products={sortedProducts} filters={filters} />
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileFilterDrawer isOpen={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} resultCount={visibleCount}>
        <ProductFilters
          products={products}
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          maxPrice={maxPrice}
          hideCategories
        />
      </MobileFilterDrawer>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryPageContent />
    </Suspense>
  );
}
