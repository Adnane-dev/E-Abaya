"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { Product } from "@/types/product";

const CATEGORY_MAP: Record<string, string> = {
  abayas: "Abayas",
  hijabs: "Hijabs",
  kaftans: "Kaftans",
  dresses: "Dresses",
};

const CATEGORY_LABELS: Record<string, string> = {
  abayas: "Abayas",
  hijabs: "Hijabs",
  kaftans: "Kaftans",
  dresses: "Robes",
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const searchParams = useSearchParams();
  const slug = params.category;
  const dbCategory = CATEGORY_MAP[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("style") ?? "");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!dbCategory) return;
    async function loadProducts() {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, shops(name, slug)")
        .eq("category", dbCategory);
      setProducts((data as Product[]) ?? []);
      setIsLoading(false);
    }
    loadProducts();
  }, [dbCategory]);

  if (!dbCategory) {
    notFound();
  }

  const uniqueColors = Array.from(new Set(products.flatMap((p) => p.colors ?? [])));
  const uniqueMaterials = Array.from(new Set(products.map((p) => p.material).filter(Boolean)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesColor = selectedColor ? product.colors?.includes(selectedColor) : true;
    const matchesMaterial = selectedMaterial ? product.material === selectedMaterial : true;
    let matchesPrice = true;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      matchesPrice = product.price >= min && (!max || product.price <= max);
    }
    return matchesSearch && matchesColor && matchesMaterial && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-center mb-8 text-foreground">
            Collection {CATEGORY_LABELS[slug]}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={`Rechercher une pièce ${CATEGORY_LABELS[slug].toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 bg-background border border-border rounded-lg flex items-center gap-2 justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </button>

            <div className="hidden md:flex gap-4">
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Toutes les couleurs</option>
                {uniqueColors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>

              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Toutes les matières</option>
                {uniqueMaterials.map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">Tous les prix</option>
                <option value="0-10000">0 - 10 000 CFA</option>
                <option value="10000-25000">10 000 - 25 000 CFA</option>
                <option value="25000-50000">25 000 - 50 000 CFA</option>
                <option value="50000-0">50 000 CFA+</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="md:hidden fixed inset-0 bg-background z-50 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl font-bold">Filtres</h2>
                <button onClick={() => setShowFilters(false)} aria-label="Fermer les filtres">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Couleur</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="">Toutes les couleurs</option>
                    {uniqueColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Matière</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="">Toutes les matières</option>
                    {uniqueMaterials.map((material) => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Prix</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="0-10000">0 - 10 000 CFA</option>
                    <option value="10000-25000">10 000 - 25 000 CFA</option>
                    <option value="25000-50000">25 000 - 50 000 CFA</option>
                    <option value="50000-0">50 000 CFA+</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Voir {filteredProducts.length} résultat{filteredProducts.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              Aucune pièce {CATEGORY_LABELS[slug].toLowerCase()} en ligne pour le moment — revenez très vite.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border">
                <CardHeader className="p-0">
                  <div className="aspect-square relative bg-muted">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-sm text-muted-foreground">{product.colors?.join(", ")}</p>
                  {product.shops && (
                    <p className="text-xs text-muted-foreground mt-1">Vendu par {product.shops.name}</p>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-lg font-bold text-accent">
                    {product.price.toLocaleString("fr-FR")} CFA
                  </span>
                  <Badge variant={product.in_stock ? "default" : "destructive"}>
                    {product.in_stock ? "En stock" : "Rupture"}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>

          {!isLoading && products.length > 0 && filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              Aucune pièce ne correspond à vos critères de recherche.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
