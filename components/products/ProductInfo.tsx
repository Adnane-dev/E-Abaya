"use client";

import Link from "next/link";
import { Product, getDiscountedPrice } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/lib/cart";

interface ProductInfoProps {
  product: Product;
}

const COLOR_HEX_MAP: Record<string, string> = {
  Black: "#111111",
  White: "#f5f5f5",
  Beige: "#e8dcc8",
  Gold: "#c9a227",
  Navy: "#1b2a4a",
  Blue: "#2f5fa8",
  "Denim Blue": "#3a5a8c",
  Burgundy: "#6b1d2b",
  Cream: "#f2ead9",
  Brown: "#5b3a29",
  Green: "#2f5d3a",
  Pink: "#e0a1b5",
  Red: "#a3272f",
  Gray: "#888888",
  Silver: "#c0c0c0",
  Ivory: "#f4f0e6",
};

function colorToSwatch(color: string) {
  return COLOR_HEX_MAP[color] ?? "#a3a3a3";
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  function handleAddToCart() {
    addToCart({ ...product, price: getDiscountedPrice(product) });
    toast.success(`${product.name} ajouté au panier`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-xl text-accent font-semibold">
            {getDiscountedPrice(product).toLocaleString("fr-FR")} CFA
          </p>
          {(product.discount_percent ?? 0) > 0 && (
            <>
              <p className="text-base text-muted-foreground line-through">
                {product.price.toLocaleString("fr-FR")} CFA
              </p>
              <span className="text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                -{product.discount_percent}%
              </span>
            </>
          )}
        </div>
        {product.shops && (
          <Link href={`/boutique/${product.shops.slug}`} className="text-sm text-muted-foreground hover:text-accent">
            Vendu par {product.shops.name}
          </Link>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-foreground">Description</h3>
        <p className="mt-2 text-muted-foreground">{product.description}</p>
      </div>

      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground">Taille</h3>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm border rounded-md transition duration-200 ${
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground">Couleur</h3>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
                className={`flex items-center justify-center px-2 py-2 border rounded-md transition duration-200 ${
                  selectedColor === color ? "border-accent ring-2 ring-accent" : "border-border hover:bg-muted"
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-border/50"
                  style={{ backgroundColor: colorToSwatch(color) }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
        {product.material && (
          <p className="text-sm text-muted-foreground">Matière : {product.material}</p>
        )}
        <p className="text-sm text-muted-foreground flex items-center">
          {product.in_stock ? (
            <CheckCircle className="text-accent mr-2 h-4 w-4" />
          ) : (
            <XCircle className="text-destructive mr-2 h-4 w-4" />
          )}
          {product.in_stock ? "En stock" : "Rupture de stock"}
        </p>
      </div>

      <Button className="w-full" disabled={!product.in_stock} onClick={handleAddToCart}>
        Ajouter au panier
      </Button>
    </div>
  );
}
