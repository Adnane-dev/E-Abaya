// app/about/page.tsx
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const AboutPage = () => {
  return (
    <div className="bg-white">
      <Navbar /> {/* Add the Navbar component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
        <p className="mt-4 text-gray-600">
          Welcome to Islamic Fashion, a platform that brings you high-quality
          abayas, hijabs, kaftans, and more. We are dedicated to providing
          modest and stylish fashion for women who want to maintain their
          elegance while staying true to their faith.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="mt-4 text-gray-600">
            Our mission is to empower women by offering beautiful, comfortable,
            and high-quality fashion options that align with their values. We
            strive to make modest fashion accessible and fashionable for women
            all over the world.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Our Story</h2>
          <p className="mt-4 text-gray-600">
            Islamic Fashion was founded with the vision of creating a space
            where modest fashion could be stylish, modern, and affordable. Since
            our launch, we have grown to offer a wide variety of clothing for
            women of all shapes and sizes, ensuring everyone can find something
            that fits their needs and personal style.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Why Choose Us?
          </h2>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>High-quality, breathable fabrics for ultimate comfort.</li>
            <li>Elegant and modest designs that cater to every occasion.</li>
            <li>Wide range of sizes to fit all body types.</li>
            <li>
              Global shipping to make sure everyone can enjoy our designs.
            </li>
          </ul>
        </div>
      </div>
      <Footer /> {/* Add the Footer component */}
    </div>
  );
};

export default AboutPage;
