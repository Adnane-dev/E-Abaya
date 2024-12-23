"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { featuredProducts } from "@/public/featured-products";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";

type ProductWithFile = Product & {
  image: string;
};

type SortConfig = {
  key: keyof ProductWithFile;
  direction: "asc" | "desc";
};

export default function AdminProductsPage() {
  const transformedProducts = featuredProducts.map((product) => ({
    ...product,
    image: typeof product.image === "string" ? product.image : "",
  }));

  const [products, setProducts] =
    useState<ProductWithFile[]>(transformedProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<ProductWithFile[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
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
    brand: "",
    inStock: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    let result = [...products];

    // Filtrage par recherche
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Tri
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortConfig]);

  const handleSort = (key: keyof ProductWithFile) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file && file.type.includes("image")) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const handleDeleteProduct = (productId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Abayas">Abayas</option>
            <option value="Hijabs">Hijabs</option>
            <option value="Kaftans">Kaftans</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("name")}
                  >
                    <span>Product</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("category")}
                  >
                    <span>Category</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("price")}
                  >
                    <span>Price</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-14 w-14 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mx-2"
                      onClick={() =>
                        alert("Edit functionality not implemented")
                      }
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 mx-2"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour ajouter un nouveau produit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFiles(e.target.files[0])
                  }
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Drag and drop or click to upload product image
                  </span>
                </label>
                {newProduct.image && (
                  <img
                    src={newProduct.image}
                    alt="Preview"
                    className="mt-4 h-32 w-32 object-cover rounded-lg mx-auto"
                  />
                )}
              </div>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <select
                  name="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Abayas">Abayas</option>
                  <option value="Hijabs">Hijabs</option>
                  <option value="Kaftans">Kaftans</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 p-6 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (
                    newProduct.name &&
                    newProduct.price > 0 &&
                    newProduct.category
                  ) {
                    setProducts([
                      ...products,
                      { ...newProduct, id: Date.now() },
                    ]);
                    setIsModalOpen(false);
                  } else {
                    alert("Please fill all required fields");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
