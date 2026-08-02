"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WishlistButton } from "@/components/products/WishlistButton";
import { createClient } from "@/lib/supabase";
import { Product, getDiscountedPrice } from "@/types/product";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("wishlists")
        .select("products(*)")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      const rows = (data ?? []) as unknown as { products: Product | null }[];
      setProducts(rows.map((row) => row.products).filter((p): p is Product => p !== null));
      setIsLoading(false);
    }
    loadWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Mes favoris</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : !isLoggedIn ? (
          <p className="text-muted-foreground">
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Connectez-vous
            </Link>{" "}
            pour voir vos favoris.
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de favoris.</p>
            <Link href="/products" className="text-accent hover:text-accent/80 font-medium">
              Découvrir nos produits →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[3/4] bg-muted">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-accent mt-1">
                      {getDiscountedPrice(product).toLocaleString("fr-FR")} CFA
                    </p>
                  </div>
                </Link>
                <WishlistButton
                  productId={product.id}
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background shadow-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
