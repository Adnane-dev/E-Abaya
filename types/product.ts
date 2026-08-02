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
  discount_percent?: number;
  shop_id?: number | null;
  shops?: { name: string; slug: string } | null;
}

export function getDiscountedPrice(product: Product): number {
  const discount = product.discount_percent ?? 0;
  return discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price;
}

export type ProductWithFile = Product; // No changes needed here unless you extend it

export interface ActiveFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}
