"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/layout/SearchBar";
import { featuredProducts } from "@/public/featured-products"; // Import des produits locaux

// Définition des types pour les filtres actifs
export interface ActiveFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

export default function ProductsPage() {
  // État local pour les filtres actifs
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, 1000],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Contenu principal : Filtres et produits */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Section des filtres */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              filters={activeFilters}
              onChange={setActiveFilters}
            />
          </aside>

          {/* Section principale : Liste des produits */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
              <ProductSort />
            </div>
            {/* Grille des produits avec les filtres appliqués */}
            <ProductGrid products={featuredProducts} filters={activeFilters} />
          </main>
        </div>
      </div>

      {/* Pied de page */}
      <Footer />
    </div>
  );
}
