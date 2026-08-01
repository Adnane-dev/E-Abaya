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
    <footer className="bg-primary text-primary-foreground/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">Boutique</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/new-arrivals" className="hover:text-accent transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link href="/category/abayas" className="hover:text-accent transition-colors">
                  Abayas
                </Link>
              </li>
              <li>
                <Link href="/category/hijabs" className="hover:text-accent transition-colors">
                  Hijabs
                </Link>
              </li>
              <li>
                <Link href="/category/kaftans" className="hover:text-accent transition-colors">
                  Kaftans
                </Link>
              </li>
              <li>
                <Link href="/category/dresses" className="hover:text-accent transition-colors">
                  Robes
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">Aide</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="hover:text-accent transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent transition-colors">
                  Retours
                </Link>
              </li>
              <li>
                <Link href="/sizing" className="hover:text-accent transition-colors">
                  Guide des tailles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-accent transition-colors">
                  Nos créateurs
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-accent transition-colors">
                  Engagement durable
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-accent transition-colors">
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">Suivez-nous</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Pinterest
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  TikTok
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-primary-foreground/50 text-center text-sm">
            © 2026 Islamic Style-Girls. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* Bouton "Retour en haut" */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg hover:bg-accent/90 transition"
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}
    </footer>
  );
}
