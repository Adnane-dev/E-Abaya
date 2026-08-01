"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return <div className="w-full max-w-sm mx-auto aspect-square rounded-lg bg-muted" />;
  }

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="relative w-full max-w-sm mx-auto aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[selectedImage]}
          alt="Photo du produit"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Vignettes d'images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              aria-selected={selectedImage === index}
              className={`relative aspect-square rounded-lg overflow-hidden transition-transform duration-300 bg-muted ${
                selectedImage === index ? "ring-2 ring-accent scale-105" : "hover:scale-105"
              }`}
            >
              <Image
                src={image}
                alt={`Photo du produit ${index + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
