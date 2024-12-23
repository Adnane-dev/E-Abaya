"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
//import { ProductPage } from "./products/[id]/page";
import { Newsletter } from "@/components/home/Newsletter";
import { featuredProducts } from "@/public/featured-products";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />

      <CategoryShowcase />
      <Newsletter />
      <Footer />
    </div>
  );
}
