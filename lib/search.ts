import { SupabaseClient } from "@supabase/supabase-js";

export interface SearchProductResult {
  id: number;
  name: string;
  image: string;
  price: number;
}

export interface SearchShopResult {
  id: number;
  name: string;
  slug: string;
}

export interface SearchCategoryResult {
  id: number;
  name: string;
  slug: string;
}

export interface SearchResults {
  products: SearchProductResult[];
  shops: SearchShopResult[];
  categories: SearchCategoryResult[];
}

const EMPTY_RESULTS: SearchResults = { products: [], shops: [], categories: [] };

// Matches literal text stored in Supabase (product/shop/category names),
// regardless of the UI's active language — translating that free-text
// content is out of scope (see plan: only UI chrome is localized), so a
// French product name won't match a Hausa/Arabic-language query and vice
// versa. This is an accepted limitation, not a bug.
export async function searchAll(query: string, supabase: SupabaseClient): Promise<SearchResults> {
  const term = query.trim();
  if (!term) return EMPTY_RESULTS;

  const [productsRes, shopsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("id,name,image,price").ilike("name", `%${term}%`).limit(5),
    supabase.from("shops").select("id,name,slug").eq("is_approved", true).ilike("name", `%${term}%`).limit(3),
    supabase.from("categories").select("id,name,slug").ilike("name", `%${term}%`).limit(3),
  ]);

  return {
    products: (productsRes.data as SearchProductResult[]) ?? [],
    shops: (shopsRes.data as SearchShopResult[]) ?? [],
    categories: (categoriesRes.data as SearchCategoryResult[]) ?? [],
  };
}
