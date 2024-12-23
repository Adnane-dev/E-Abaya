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
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
        <Image
          src={images[selectedImage]}
          alt="Product image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-center object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
              selectedImage === index ? "ring-2 ring-black" : ""
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="w-full h-full object-center object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}