"use client";

import { useState } from "react";
import { Product } from "@/types/product"; // Assuming ProductWithFile extends Product
import { featuredProducts } from "@/public/featured-products";

// Define the ProductWithFile type if it extends Product
type ProductWithFile = Product & {
  image: string; // Assuming image is the only additional property, you can extend with others if necessary
};

export default function AdminProductsPage() {
  // Ensure the image is a string when initializing products
  const transformedProducts = featuredProducts.map((product) => ({
    ...product,
    image: typeof product.image === "string" ? product.image : "", // Convert image to string if it's a File
  }));

  const [products, setProducts] =
    useState<ProductWithFile[]>(transformedProducts);
  const [newProduct, setNewProduct] = useState<ProductWithFile>({
    id: Date.now(),
    name: "",
    price: 0,
    category: "",
    description: "",
    sizes: [],
    colors: [],
    material: "",
    image: "",
    brand: "", // Add default value for brand
    inStock: true,
  });
  const [editingProduct, setEditingProduct] = useState<ProductWithFile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue = name === "price" ? parseFloat(value) : value;

    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: parsedValue });
    } else {
      setNewProduct({ ...newProduct, [name]: parsedValue });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, image: imageUrl });
    } else {
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.category ||
      newProduct.price <= 0 ||
      !newProduct.image
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const updatedProducts = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updatedProducts);
    setNewProduct({
      id: Date.now(),
      name: "",
      price: 0,
      category: "",
      description: "",
      sizes: [],
      colors: [],
      material: "",
      image: "",
      brand: "", // Add default value for brand
      inStock: true,
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    if (
      !editingProduct.name ||
      !editingProduct.category ||
      editingProduct.price <= 0 ||
      !editingProduct.image
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id ? editingProduct : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const renderImage = (image: string | File) => {
    const imageUrl =
      typeof image === "string" ? image : URL.createObjectURL(image);
    return (
      <img
        src={imageUrl}
        alt="Product"
        className="h-16 w-16 object-cover rounded"
      />
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin: Products</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Add a New Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddProduct();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="Abayas">Abayas</option>
              <option value="Hijabs">Hijabs</option>
              <option value="Kaftans">Kaftans</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2 text-center">{product.id}</td>
                <td className="border px-4 py-2 text-center">
                  {renderImage(product.image)}
                </td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setProducts(products.filter((p) => p.id !== product.id))
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editingProduct.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
              <select
                name="category"
                value={editingProduct.category}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              >
                <option value="Abayas">Abayas</option>
                <option value="Hijabs">Hijabs</option>
                <option value="Kaftans">Kaftans</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
