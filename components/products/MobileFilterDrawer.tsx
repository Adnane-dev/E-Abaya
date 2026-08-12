"use client";

import { X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}

export function MobileFilterDrawer({ isOpen, onClose, resultCount, children }: MobileFilterDrawerProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-background z-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold">{t.products.filters.title}</h2>
        <button onClick={onClose} aria-label={t.products.filters.closeAria}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">{children}</div>

      <button onClick={onClose} className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded-lg">
        {t.products.filters.viewResults(resultCount)}
      </button>
    </div>
  );
}
