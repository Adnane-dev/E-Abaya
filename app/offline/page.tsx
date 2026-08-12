"use client";

import { WifiOff } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="font-serif text-2xl font-bold text-foreground">{t.offline.offlinePage.title}</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">{t.offline.offlinePage.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        {t.offline.offlinePage.retry}
      </button>
    </div>
  );
}
