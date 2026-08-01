import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">Livraison</h1>
        <p className="mt-4 text-muted-foreground">
          Vous trouverez ici les informations sur nos délais et modalités de livraison.
        </p>
        <ul className="list-disc pl-6 mt-6 space-y-2 text-muted-foreground">
          <li>Livraison à domicile disponible au Niger.</li>
          <li>Délai de préparation habituel : 1 à 3 jours ouvrés.</li>
          <li>Le suivi de commande est confirmé par téléphone ou WhatsApp après validation.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
