"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { useProduct } from "@/hooks/useProduct"; // Importation du hook
import React, { useState } from "react";
// Définition de l'interface PageProps avec params en tant que Promise
interface PageProps {
  params: Promise<{
    id: string; // Paramètre 'id' venant de l'URL, qui sera un Promise
  }>;
  searchParams?: any; // Ajout optionnel de searchParams
}

// Composant ProductPage avec les props PageProps
export default function ProductPage({ params }: PageProps): JSX.Element {
  // État pour stocker la valeur résolue de params
  const [resolvedParams, setResolvedParams] = React.useState<{
    id: string;
  } | null>(null);

  // Résolution de params au sein de useEffect, appelée une seule fois
  React.useEffect(() => {
    params.then((resolved) => setResolvedParams(resolved));
  }, [params]);

  // Appel de useProduct avec un id valide ou un fallback
  const { product, isLoading } = useProduct(
    resolvedParams ? parseInt(resolvedParams.id) : -1
  );

  // Retourner un message de chargement si le produit est en cours de récupération
  if (isLoading) {
    return <div>Loading product...</div>;
  }

  // Vérification si le produit est null ou non trouvé
  if (!resolvedParams || !product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vérification de la présence d'images avant d'afficher */}
          <ProductGallery images={product.images || []} />
          <ProductInfo product={product} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
