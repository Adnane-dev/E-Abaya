"use client";

import { useRouter } from "next/router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { useProduct } from "@/hooks/useProduct"; // Importation du hook

export default function ProductPage({ params }: { params: { id: string } }) {
  const { product, isLoading } = useProduct(parseInt(params.id)); // Utilisation de l'ID depuis les paramètres

  if (isLoading) {
    return <div>Loading...</div>; // Affichage pendant le chargement des données
  }

  if (!product) {
    return <div>Product not found</div>; // Affichage si le produit n'est pas trouvé
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar /> {/* Barre de navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Affichage des galeries d'images du produit */}
          <ProductGallery images={product.images || []} />
          {/* Affichage des informations détaillées du produit */}
          <ProductInfo product={product} />
        </div>
      </div>
      <Footer /> {/* Pied de page */}
    </div>
  );
}
