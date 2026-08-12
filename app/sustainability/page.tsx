"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function SustainabilityPage() {
  const { t } = useTranslation();
  const sustainability = t.staticPages.sustainability;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">{sustainability.title}</h1>
        <p className="mt-4 text-muted-foreground">{sustainability.intro}</p>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{sustainability.pointsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {sustainability.points.map((point) => (
              <div key={point.title} className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground">{point.title}</h3>
                <p className="mt-2 text-muted-foreground">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
