import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase-server";

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Toutes nos collections</h1>

        {!categories || categories.length === 0 ? (
          <p className="text-muted-foreground">Aucune collection pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center justify-center text-center p-6 rounded-lg border border-border bg-card hover:border-accent hover:text-accent transition-colors font-medium text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
