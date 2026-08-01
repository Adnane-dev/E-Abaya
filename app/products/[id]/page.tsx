import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { createClient } from "@/lib/supabase-server";
import { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, shops(name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const product = data as Product;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={images} />
          <ProductInfo product={product} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
