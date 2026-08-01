import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase-server";
import { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("is_approved", true)
    .maybeSingle();

  if (!shop) {
    notFound();
  }

  const { data: products } = await supabase.from("products").select("*").eq("shop_id", shop.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center gap-4 mb-10">
          {shop.logo_url && (
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image src={shop.logo_url} alt={shop.name} fill className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{shop.name}</h1>
            {shop.description && <p className="text-muted-foreground mt-1">{shop.description}</p>}
          </div>
        </div>

        {(!products || products.length === 0) ? (
          <p className="text-center text-muted-foreground py-12">
            Cette boutique n&apos;a pas encore publié de produit.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products as Product[]).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-56 bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </p>
                  <p className="text-accent mt-1">{product.price.toLocaleString("fr-FR")} CFA</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
