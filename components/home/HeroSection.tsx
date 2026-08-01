"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition, staggerDelay } from "@/lib/motion";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-primary text-primary-foreground"
      role="banner"
      aria-label="Présentation de la boutique Islamic Style-Girls"
    >
      {/* Decorative gradient wash — swap for a real photo later via a bg-image prop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(var(--accent) / 0.35), transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--accent) / 0.2), transparent 50%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto py-28 px-4 sm:py-36 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={fadeUpTransition}
          className="uppercase tracking-[0.2em] text-sm text-accent font-medium mb-4"
        >
          Mode modeste, Afrique &amp; monde arabe
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...fadeUpTransition, ...staggerDelay(1) }}
          className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          L&apos;élégance voilée, réinventée
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...fadeUpTransition, ...staggerDelay(2) }}
          className="mt-6 text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto"
        >
          Abayas, hijabs, kaftans et robes soigneusement sélectionnés, entre
          héritage africain et raffinement arabe.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ ...fadeUpTransition, ...staggerDelay(3) }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/category/new-arrivals"
            className="inline-block bg-accent py-3 px-8 rounded-md text-base font-medium text-accent-foreground hover:bg-accent/90 transition duration-300 shadow-lg"
          >
            Voir les nouveautés
          </Link>
          <Link
            href="/about"
            className="inline-block py-3 px-8 rounded-md text-base font-medium text-primary-foreground border border-primary-foreground/30 hover:border-accent hover:text-accent transition duration-300"
          >
            Notre histoire
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
