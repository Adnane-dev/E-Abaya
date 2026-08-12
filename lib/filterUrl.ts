import { ActiveFilters } from "@/types/product";
import { SortOption } from "@/components/products/ProductSort";

export interface FilterUrlState {
  filters: ActiveFilters;
  sort: SortOption;
}

const DEFAULT_SORT: SortOption = "newest";

function splitParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function filtersToSearchParams(
  filters: ActiveFilters,
  sort: SortOption,
  maxPrice: number
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("cat", filters.categories.join(","));
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.colors.length) params.set("color", filters.colors.join(","));
  if (filters.sizes.length) params.set("size", filters.sizes.join(","));
  if (filters.priceRange[0] > 0) params.set("min", String(filters.priceRange[0]));
  if (filters.priceRange[1] < maxPrice) params.set("max", String(filters.priceRange[1]));
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  return params;
}

export function searchParamsToFilters(params: URLSearchParams, maxPrice: number): FilterUrlState {
  const min = Number(params.get("min") ?? 0);
  const max = Number(params.get("max") ?? maxPrice);
  const sortParam = params.get("sort");
  const sort: SortOption =
    sortParam === "price-low" || sortParam === "price-high" ? sortParam : DEFAULT_SORT;

  return {
    filters: {
      categories: splitParam(params.get("cat")),
      brands: splitParam(params.get("brand")),
      colors: splitParam(params.get("color")),
      sizes: splitParam(params.get("size")),
      priceRange: [
        Number.isFinite(min) ? min : 0,
        Number.isFinite(max) ? max : maxPrice,
      ],
    },
    sort,
  };
}
