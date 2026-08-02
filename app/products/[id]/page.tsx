import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ShareButtons } from "@/components/products/ShareButtons";
import { createClient } from "@/lib/supabase-server";
import { Product, getDiscountedPrice } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, shops(name, slug)")
    .eq("id", id)
    .maybeSingle();
  return data as Product | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return {};

  const price = `${getDiscountedPrice(product).toLocaleString("fr-FR")} CFA`;
  const description = product.description || `${product.name} — ${price} sur Islamic Style-Girls.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    notFound();
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={images} />
          <div className="space-y-6">
            <ProductInfo product={product} />
            <ShareButtons title={product.name} />
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </div>
      <Footer />
    </div>
  );
}
