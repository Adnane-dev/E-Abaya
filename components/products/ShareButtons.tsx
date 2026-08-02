"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}` },
  ];

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <Share2 className="h-4 w-4" /> Partager :
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors font-medium"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
