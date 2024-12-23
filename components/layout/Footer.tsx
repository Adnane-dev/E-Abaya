"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Vérifier si l'utilisateur est en bas de la page
  const checkScrollPosition = () => {
    if (window.scrollY > 300) {
      setIsVisible(true); // Afficher le bouton si on descend de 300px
    } else {
      setIsVisible(false); // Cacher le bouton si on est en haut de la page
    }
  };

  // Écouter l'événement de défilement
  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  // Fonction pour faire défiler la page vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Ajoute une animation fluide
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/new-arrivals"
                  className="hover:text-white"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category/abayas" className="hover:text-white">
                  Abayas
                </Link>
              </li>
              <li>
                <Link href="/category/hijabs" className="hover:text-white">
                  Hijabs
                </Link>
              </li>
              <li>
                <Link href="/category/kaftans" className="hover:text-white">
                  Kaftans
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/sizing" className="hover:text-white">
                  Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-white">
                  Our Designers
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-white">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Pinterest
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-center">
            © 2024 Islamic Fashion. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bouton "Retour en haut" */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}
    </footer>
  );
}
