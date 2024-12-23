"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductDialog({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [bgColor, setBgColor] = useState("#fff");

  if (!isOpen || !product) return null;

  const handleChangeColor = (color) => setBgColor(color);

  return (
    <dialog
      open
      className="dialog fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl w-full">
        <div className="relative p-6 flex flex-col md:flex-row">
          <div
            className="flex-shrink-0 w-full md:w-1/2 bg-cover bg-center"
            style={{ backgroundColor: bgColor }}
          >
            <Image
              src={product.image}
              alt={product.name}
              layout="responsive"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div className="p-4 w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-700 my-4">{product.description}</p>
            <p className="text-lg font-semibold text-gray-800">
              {product.price} MAD
            </p>

            {/* Couleurs */}
            <div className="flex items-center gap-2 my-4">
              <button
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: "#ff6b58" }}
                onClick={() => handleChangeColor("#ff6b58")}
              />
              <button
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: "#333" }}
                onClick={() => handleChangeColor("#333")}
              />
              <button
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: "#5f69d5" }}
                onClick={() => handleChangeColor("#5f69d5")}
              />
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md"
              >
                +
              </button>
            </div>

            {/* Boutons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Ajouter au panier
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
