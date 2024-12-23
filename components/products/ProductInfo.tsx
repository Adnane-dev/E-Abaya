import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-xl text-gray-900 mt-2">{product.price} MAD</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">Description</h3>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">Size</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 text-sm border rounded-md transition duration-200 ${
                selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-gray-900 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900">Color</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 text-sm border rounded-md transition duration-200 ${
                selectedColor === color
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 flex items-center">
          <span className="mr-2">{product.brand}</span>
        </p>
        <p className="text-sm text-gray-600">Material: {product.material}</p>
        <p className="text-sm text-gray-600 flex items-center">
          {product.inStock ? (
            <CheckCircle className="text-green-500 mr-2" />
          ) : (
            <XCircle className="text-red-500 mr-2" />
          )}
          Availability: {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      <Button
        className="w-full"
        disabled={!product.inStock} // Disable button if product is out of stock
      >
        Add to Cart
      </Button>
    </div>
  );
}
