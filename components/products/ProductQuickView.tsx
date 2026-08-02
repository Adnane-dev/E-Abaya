"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Product, getDiscountedPrice } from "@/types/product";
import { addToCart } from "@/lib/cart";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  if (!product) return null;
  const currentProduct = product;

  function handleAddToCart() {
    addToCart({ ...currentProduct, price: getDiscountedPrice(currentProduct) });
    toast.success(`${currentProduct.name} ajouté au panier`);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="font-serif text-xl">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">{product.description}</DialogDescription>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-64 rounded-md overflow-hidden bg-muted">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          <p className="text-center text-muted-foreground">{product.description}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold text-accent">
              {getDiscountedPrice(product).toLocaleString("fr-FR")} CFA
            </p>
            {(product.discount_percent ?? 0) > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString("fr-FR")} CFA
              </p>
            )}
          </div>

          <div className="w-full space-y-1 text-sm text-muted-foreground text-center">
            {product.colors?.length > 0 && (
              <p>
                Couleurs : <span className="text-foreground">{product.colors.join(", ")}</span>
              </p>
            )}
            {product.material && (
              <p>
                Matière : <span className="text-foreground">{product.material}</span>
              </p>
            )}
          </div>

          <Button onClick={handleAddToCart} className="w-full">
            Ajouter au panier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
