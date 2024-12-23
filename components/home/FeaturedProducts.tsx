import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fonction pour afficher le modal avec les détails du produit
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Featured Collections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div
              className="relative w-full h-64 rounded-t-lg overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
                className="group-hover:scale-105 transition-transform duration-300"
                loading="lazy" // Ajout du chargement paresseux pour améliorer les performances
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity duration-300">
                <button
                  aria-label={`View details for ${product.name}`}
                  className="p-3 rounded-full bg-white text-gray-900 shadow-md hover:bg-primary hover:text-white transition duration-300"
                >
                  <Eye className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm text-gray-500">{product.category}</h3>
              <p
                className="mt-1 text-lg font-medium text-gray-900 group-hover:text-primary transition-colors"
                aria-label={`View details for ${product.name}`}
              >
                {product.name}
              </p>
              <p className="mt-1 text-lg text-gray-900">{product.price} cfa</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails du produit */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-white p-6 rounded-lg w-96 transform scale-100 transition-all duration-300">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={closeModal}
              aria-label="Close product details"
            >
              <span className="text-2xl font-bold">X</span>
            </button>
            <h2 id="modal-title" className="text-2xl font-semibold">
              {selectedProduct.name}
            </h2>
            <div className="mt-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={350}
                height={500}
                className="object-cover"
                loading="lazy"
              />
              <p id="modal-description" className="mt-4 text-lg text-gray-900">
                {selectedProduct.description}
              </p>
              <p className="mt-2 text-lg font-semibold text-primary">
                {selectedProduct.price} Cfa
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
