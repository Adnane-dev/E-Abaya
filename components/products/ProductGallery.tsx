"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg">
        <Image
          src={images[selectedImage]}
          alt="Product image"
          width={800} // Spécifier une largeur pour contrôler la taille
          height={800} // Spécifier une hauteur pour contrôler la taille
          objectFit="cover"
          priority
          className="w-full h-full object-center object-cover"
        />
      </div>

      {/* Vignettes d'images */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            aria-selected={selectedImage === index}
            className={`relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden transition-transform duration-300 ${
              selectedImage === index
                ? "ring-2 ring-black scale-105"
                : "hover:scale-105"
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              objectFit="cover"
              className="w-full h-full object-center object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
