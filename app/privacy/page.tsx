import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Politique de confidentialité
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            Nous collectons uniquement les informations nécessaires pour traiter vos
            commandes et vous contacter (nom, adresse e-mail, adresse de livraison).
          </p>
          <p>
            Vos informations ne sont jamais vendues à des tiers. Elles sont utilisées
            uniquement pour le fonctionnement de la boutique.
          </p>
          <p>
            Pour toute question sur vos données ou pour demander leur suppression,
            contactez-nous via la page{" "}
            <a href="/contact" className="text-accent underline">
              Contact
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
