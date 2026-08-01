"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { scrollReveal, staggerDelay } from "@/lib/motion";

const categories = [
  { name: "Abayas", href: "/category/abayas", span: "lg:col-span-2 lg:row-span-2" },
  { name: "Hijabs", href: "/category/hijabs", span: "" },
  { name: "Kaftans", href: "/category/kaftans", span: "" },
  { name: "Robes", href: "/category/dresses", span: "lg:col-span-2" },
];

export function CategoryShowcase() {
  return (
    <div className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">
          Nos univers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6">
          {categories.map((category, i) => (
            <motion.div key={category.name} {...scrollReveal} transition={{ ...scrollReveal.transition, ...staggerDelay(i) }} className={category.span}>
              <Link
                href={category.href}
                aria-label={`Découvrir ${category.name}`}
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
