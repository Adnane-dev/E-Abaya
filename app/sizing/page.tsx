import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SizingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground">Guide des tailles</h1>
        <p className="mt-4 text-muted-foreground">
          Trouvez la taille idéale pour vos abayas, hijabs, kaftans et robes.
        </p>
        <div className="mt-8">
          <h2 className="font-serif text-xl font-medium text-foreground">Comment prendre vos mesures</h2>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
            <li>Mesurez le tour de poitrine à l&apos;endroit le plus large.</li>
            <li>Mesurez le tour de taille à l&apos;endroit le plus fin.</li>
            <li>Mesurez le tour de hanches à l&apos;endroit le plus large.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
