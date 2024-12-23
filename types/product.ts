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
  inStock: boolean;
}

export type ProductWithFile = Product; // No changes needed here unless you extend it
