"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { scrollReveal, staggerDelay } from "@/lib/motion";
import { createClient } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const SPANS = ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2"];

export function CategoryShowcase() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, name, slug").order("name").limit(4);
      setCategories((data as Category[]) ?? []);
    }
    loadCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">
          {t.home.categoriesShowcase.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              {...scrollReveal}
              transition={{ ...scrollReveal.transition, ...staggerDelay(i) }}
              className={SPANS[i] ?? ""}
            >
              <Link
                href={`/category/${category.slug}`}
                aria-label={t.home.categoriesShowcase.discover(category.name)}
                className="group relative flex h-full min-h-[220px] items-center justify-center overflow-hidden rounded-lg bg-primary shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 30%, hsl(var(--accent) / 0.5), transparent 60%)",
                  }}
                />
                <span className="relative font-serif text-2xl sm:text-3xl font-semibold text-primary-foreground group-hover:text-accent transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
