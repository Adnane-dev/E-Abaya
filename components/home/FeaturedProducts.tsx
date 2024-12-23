import { useState } from "react";
import Image from "next/image";
import { Eye, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  // Fonction pour afficher le modal avec les détails du produit
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Fonction pour ajouter un produit au panier
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Featured Collections
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-md border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div
              className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition-opacity duration-300">
                <button
                  aria-label={`View details for ${product.name}`}
                  className="p-2 sm:p-3 rounded-full bg-white text-gray-900 shadow-md hover:bg-blue-600 hover:text-white transition duration-300"
                >
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            <div className="p-2 sm:p-4">
              <h3 className="text-xs sm:text-sm text-gray-500">
                {product.category}
              </h3>
              <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {product.name}
              </p>
              <p className="mt-1 text-sm sm:text-lg text-gray-900">
                {product.price} CFA
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-blue-600 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails du produit */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 opacity-100"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          aria-hidden="false"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xs sm:max-w-lg mx-4 transform scale-95 transition-all duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={closeModal}
              aria-label="Close product details"
            >
              <span className="text-2xl sm:text-3xl font-bold">&times;</span>
            </button>
            <h2
              id="modal-title"
              className="text-lg sm:text-2xl font-semibold text-center text-blue-600"
            >
              {selectedProduct.name}
            </h2>
            <div className="mt-4 sm:mt-6 flex flex-col items-center">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={300}
                height={400}
                className="object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
              <p
                id="modal-description"
                className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-900 text-center px-2"
              >
                {selectedProduct.description}
              </p>
              <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-green-600">
                {selectedProduct.price} CFA
              </p>
              <div className="mt-4 sm:mt-6 text-center space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  Available colors:{" "}
                  <span className="text-orange-500">
                    {selectedProduct.colors.join(", ")}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Material:{" "}
                  <span className="text-purple-500">
                    {selectedProduct.material}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Brand:{" "}
                  <span className="text-teal-500">{selectedProduct.brand}</span>
                </p>
              </div>
              <button
                onClick={() => addToCart(selectedProduct)}
                className="mt-5 sm:mt-6 bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out text-sm sm:text-base"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
