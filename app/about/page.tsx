"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();
  const about = t.staticPages.about;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">{about.title}</h1>
        <p className="mt-4 text-muted-foreground">{about.intro}</p>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{about.missionTitle}</h2>
          <p className="mt-4 text-muted-foreground">{about.missionBody}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{about.storyTitle}</h2>
          <p className="mt-4 text-muted-foreground">{about.storyBody}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">{about.whyTitle}</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
            {about.whyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
