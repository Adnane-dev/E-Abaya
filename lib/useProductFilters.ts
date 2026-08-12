"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActiveFilters } from "@/types/product";
import { SortOption } from "@/components/products/ProductSort";
import { filtersToSearchParams, searchParamsToFilters } from "./filterUrl";

const DEFAULT_PRICE_MAX = 100000;

function roundUpPrice(value: number): number {
  const step = value > 100000 ? 10000 : 5000;
  return Math.max(step, Math.ceil(value / step) * step);
}

// Shared by app/products/page.tsx and app/category/[category]/page.tsx so
// both routes filter/sort identically and keep the choice in the URL
// (shareable, survives refresh) instead of local component state.
export function useProductFilters(products: { price: number }[], lockedCategory?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const maxPrice = useMemo(() => {
    if (products.length === 0) return DEFAULT_PRICE_MAX;
    return roundUpPrice(Math.max(...products.map((p) => p.price)));
  }, [products]);

  const { filters, sort } = useMemo(() => {
    const state = searchParamsToFilters(searchParams, maxPrice);
    if (lockedCategory && !state.filters.categories.includes(lockedCategory)) {
      state.filters.categories = [lockedCategory];
    }
    return state;
  }, [searchParams, maxPrice, lockedCategory]);

  const update = useCallback(
    (nextFilters: ActiveFilters, nextSort: SortOption) => {
      const params = filtersToSearchParams(nextFilters, nextSort, maxPrice);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, maxPrice]
  );

  const setFilters = useCallback((next: ActiveFilters) => update(next, sort), [update, sort]);
  const setSort = useCallback((next: SortOption) => update(filters, next), [update, filters]);

  const resetFilters = useCallback(() => {
    update(
      {
        categories: lockedCategory ? [lockedCategory] : [],
        brands: [],
        colors: [],
        sizes: [],
        priceRange: [0, maxPrice],
      },
      sort
    );
  }, [update, sort, lockedCategory, maxPrice]);

  return { filters, sort, setFilters, setSort, resetFilters, maxPrice };
}
