"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase";
import { Product } from "@/types/product";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, shops(name, slug)")
        .eq("is_new", true)
        .order("created_at", { ascending: false });
      setProducts((data as Product[]) ?? []);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Nouveautés</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          Découvrez nos dernières arrivées en mode modeste — abayas, hijabs, kaftans
          et robes, choisis pour leur qualité et leur style.
        </p>

        {!isLoading && products.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Pas encore de nouveauté en ligne — revenez très vite.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border shadow-sm rounded-lg p-4 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-muted">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
                <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                  {product.description}
                </p>
                <p className="text-accent font-semibold mt-2">
                  {product.price.toLocaleString("fr-FR")} CFA
                </p>
                {product.shops && (
                  <p className="text-xs text-muted-foreground mt-1">Vendu par {product.shops.name}</p>
                )}
                <div className="mt-3">
                  <Badge variant={product.in_stock ? "default" : "destructive"}>
                    {product.in_stock ? "En stock" : "Rupture de stock"}
                  </Badge>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="text-accent hover:text-accent/80 mt-4 inline-block font-medium"
                >
                  Voir plus →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
