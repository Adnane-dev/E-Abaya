// app/category/new-arrivals/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { featuredProducts } from "@/public/featured-products"; // Importation des produits

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">New Arrivals</h1>
        <p className="text-lg text-gray-700 mb-8">
          Découvrez nos dernières nouveautés en mode islamique, y compris des
          abayas, hijabs, et plus encore. Chaque article est soigneusement
          sélectionné pour vous offrir qualité et style.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Affichage dynamique des produits */}
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
                loading="lazy" // Lazy load des images
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-gray-900 font-semibold mt-2">
                  ${product.price}
                </p>
                <div className="mt-4">
                  {product.inStock ? (
                    <span className="text-green-600 font-bold">En stock</span>
                  ) : (
                    <span className="text-red-600 font-bold">
                      Rupture de stock
                    </span>
                  )}
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
                >
                  Voir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
