import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground text-center">
          Retours et échanges
        </h1>
        <div className="mt-8 text-muted-foreground">
          <p>
            Si un article ne vous convient pas, nous facilitons le retour ou l&apos;échange.
            Voici les conditions :
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Retour possible dans les 7 jours suivant la réception de la commande.</li>
            <li>L&apos;article doit être non porté, non lavé, avec ses étiquettes d&apos;origine.</li>
            <li>Contactez-nous via le formulaire de contact pour lancer un retour.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
