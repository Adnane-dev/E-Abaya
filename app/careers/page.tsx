"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function CareersPage() {
  const { t } = useTranslation();
  const careers = t.staticPages.careers;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">{careers.title}</h1>
        <p className="mt-4 text-muted-foreground">{careers.intro}</p>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{careers.ctaTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground">{careers.becomeVendor}</h3>
              <p className="mt-2 text-muted-foreground">{careers.becomeVendorDesc}</p>
              <Link href="/vendeur" className="mt-4 inline-block text-accent hover:text-accent/80 font-medium">
                {careers.becomeVendor} →
              </Link>
            </div>
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground">{careers.becomeCourier}</h3>
              <p className="mt-2 text-muted-foreground">{careers.becomeCourierDesc}</p>
              <Link href="/devenir-livreur" className="mt-4 inline-block text-accent hover:text-accent/80 font-medium">
                {careers.becomeCourier} →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-muted-foreground">
          {careers.contactCta}{" "}
          <Link href="/contact" className="text-accent hover:text-accent/80 font-medium">
            {careers.contactLinkLabel}
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
