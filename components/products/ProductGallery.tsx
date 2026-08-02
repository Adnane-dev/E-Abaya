"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (images.length === 0) {
    return <div className="w-full aspect-[3/4] rounded-lg bg-muted" />;
  }

  return (
    <div className="space-y-4">
      {/* Image principale — object-contain pour toujours voir la tenue en entier,
          quelle que soit la taille/le cadrage de la photo fournie par le vendeur. */}
      <button
        onClick={() => setIsZoomOpen(true)}
        className="group relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-muted cursor-zoom-in"
        aria-label="Agrandir la photo"
      >
        <Image
          src={images[selectedImage]}
          alt="Photo du produit"
          fill
          priority
          className="object-contain"
        />
        <span className="absolute bottom-3 right-3 p-2 rounded-full bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>

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

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">Photo du produit agrandie</DialogTitle>
          <div className="relative w-full aspect-[3/4] max-h-[80vh]">
            <Image src={images[selectedImage]} alt="Photo du produit agrandie" fill className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
