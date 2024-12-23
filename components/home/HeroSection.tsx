import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative"
      role="banner"
      aria-label="Hero section showcasing elegant Islamic fashion"
    >
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/accueil.jpg" // Assurez-vous que l'image 'accueil.jpg' se trouve dans le dossier 'public/images'
          alt="Elegant boutique interior"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Elegant Islamic Fashion
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
          Discover our curated collection of modest fashion from leading Arab
          designers. Elegance meets tradition in every piece.
        </p>
        <div className="mt-10">
          <Link
            href="/category/new-arrivals"
            className="inline-block bg-white py-3 px-8 border border-transparent rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition duration-300"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
