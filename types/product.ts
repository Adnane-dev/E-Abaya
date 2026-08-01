export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // Single image URL
  images?: string[]; // If you want multiple images
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  brand: string;
  in_stock: boolean;
  is_new?: boolean;
  shop_id?: number | null;
  shops?: { name: string; slug: string } | null;
}

export type ProductWithFile = Product; // No changes needed here unless you extend it

export interface ActiveFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}
