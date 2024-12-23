"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ProductDialog } from "./ProductDialog";
import { Product } from "@/types/product"; // Importation du type Product
// Définir le type pour les filtres actifs
interface ActiveFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

interface ProductGridProps {
  products: Product[];
  filters: ActiveFilters;
}

export function ProductGrid({ products, filters }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  // Filtrer les produits en fonction des filtres actifs
  const filteredProducts = products.filter((product) => {
    const isCategoryMatch = filters.categories.length
      ? filters.categories.includes(product.category)
      : true;
    const isBrandMatch = filters.brands.length
      ? filters.brands.includes(product.brand || "")
      : true;
    const isColorMatch = filters.colors.length
      ? product.colors?.some((color) => filters.colors.includes(color))
      : true;
    const isSizeMatch = filters.sizes.length
      ? product.sizes?.some((size) => filters.sizes.includes(size))
      : true;
    const isPriceMatch =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];

    return (
      isCategoryMatch &&
      isBrandMatch &&
      isColorMatch &&
      isSizeMatch &&
      isPriceMatch
    );
  });

  // Créer l'URL de l'image pour les fichiers et les gérer dans un useEffect
  useEffect(() => {
    const newImageUrls = new Map<string, string>();

    products.forEach((product) => {
      if (typeof product.image === "object") {
        const imageUrl = URL.createObjectURL(product.image);
        newImageUrls.set(String(product.id), imageUrl);
      }
    });

    setImageUrls(newImageUrls);

    // Nettoyage: révoquer les URLs créées
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [products]);

  // Gérer l'ouverture du dialogue pour voir les détails du produit
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Fermer le dialogue
  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(false);
  };

  // Ajouter le produit au panier
  const handleAddToCart = (product: Product, quantity: number) => {
    console.log("Added to cart:", product, quantity);
    handleCloseDialog();
  };

  // Fonction pour afficher l'image
  const renderImage = useCallback(
    (image: string | File, productId: string) => {
      if (typeof image === "string") {
        return (
          <Image
            src={image}
            alt="Product"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
          />
        );
      }

      // Si l'image est un objet File, utiliser l'URL déjà stockée
      const imageUrl = imageUrls.get(productId);
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30px"
          className="group-hover:scale-105 transition-transform duration-300 object-cover"
        />
      ) : null;
    },
    [imageUrls]
  );

  return (
    <div>
      {/* Grid pour les produits filtrés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative w-full h-64 rounded-t-lg overflow-hidden">
              {renderImage(product.image, String(product.id))}
            </div>
            <div className="p-4">
              <h3 className="text-sm text-gray-500">{product.category}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <p className="mt-1 text-lg text-gray-900">{product.price} MAD</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogue pour afficher les détails du produit */}
      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
