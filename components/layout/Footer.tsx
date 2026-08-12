"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function Footer() {
  const { t } = useTranslation();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">{t.footer.shopHeading}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/new-arrivals" className="hover:text-accent transition-colors">
                  {t.footer.newArrivals}
                </Link>
              </li>
              <li>
                <Link href="/category/abayas" className="hover:text-accent transition-colors">
                  {t.footer.abayas}
                </Link>
              </li>
              <li>
                <Link href="/category/hijabs" className="hover:text-accent transition-colors">
                  {t.footer.hijabs}
                </Link>
              </li>
              <li>
                <Link href="/category/kaftans" className="hover:text-accent transition-colors">
                  {t.footer.kaftans}
                </Link>
              </li>
              <li>
                <Link href="/category/dresses" className="hover:text-accent transition-colors">
                  {t.footer.dresses}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">{t.footer.helpHeading}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="hover:text-accent transition-colors">
                  {t.footer.shipping}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent transition-colors">
                  {t.footer.returns}
                </Link>
              </li>
              <li>
                <Link href="/sizing" className="hover:text-accent transition-colors">
                  {t.footer.sizing}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">{t.footer.aboutHeading}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  {t.footer.ourStory}
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-accent transition-colors">
                  {t.footer.designers}
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-accent transition-colors">
                  {t.footer.sustainability}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-accent transition-colors">
                  {t.footer.careers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Join us */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">{t.footer.joinHeading}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vendeur" className="hover:text-accent transition-colors font-medium">
                  {t.footer.becomeVendor}
                </Link>
              </li>
              <li>
                <Link href="/devenir-livreur" className="hover:text-accent transition-colors font-medium">
                  {t.footer.becomeCourier}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Links */}
          <div>
            <h3 className="font-serif text-primary-foreground text-lg font-semibold mb-4">{t.footer.followHeading}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://facebook.com/people/Niger40/61588825723446" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com/niger4.0" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@niger40officiel" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://x.com/Niger038017" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  X
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/niger-4-0/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@Niger-4.0Officiel" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-primary-foreground/50 text-center text-sm">
            {t.footer.copyright(new Date().getFullYear())}
          </p>
        </div>
      </div>

      {/* Bouton "Retour en haut" */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg hover:bg-accent/90 transition"
          aria-label={t.footer.backToTopAria}
        >
          ↑
        </button>
      )}
    </footer>
  );
}
