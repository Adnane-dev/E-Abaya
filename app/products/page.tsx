"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/layout/SearchBar";
import { featuredProducts } from "@/public/featured-products"; // Import de la liste des produits

// Define the type for the filter state
export interface ActiveFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

export default function ProductsPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 1000],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              filters={activeFilters}
              onChange={setActiveFilters}
            />
          </aside>
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
              <ProductSort />
            </div>
            {/* Pass the products and filters to the ProductGrid */}
            <ProductGrid products={featuredProducts} filters={activeFilters} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
