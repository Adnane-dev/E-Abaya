"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function DesignersPage() {
  const { t } = useTranslation();
  const designers = t.staticPages.designers;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">{designers.title}</h1>
        <p className="mt-4 text-muted-foreground">{designers.intro}</p>

        <div className="mt-8 border border-border rounded-lg p-8 bg-card">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{designers.ctaTitle}</h2>
          <p className="mt-4 text-muted-foreground">{designers.ctaBody}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-block px-6 py-2 border border-border rounded-md text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {designers.browseShops}
            </Link>
            <Link
              href="/vendeur"
              className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            >
              {designers.becomeVendor}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
