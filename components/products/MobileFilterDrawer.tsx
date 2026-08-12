"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { EASE_PREMIUM } from "@/lib/motion";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}

export function MobileFilterDrawer({ isOpen, onClose, resultCount, children }: MobileFilterDrawerProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: EASE_PREMIUM }}
          className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-50 p-6 overflow-y-auto"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
