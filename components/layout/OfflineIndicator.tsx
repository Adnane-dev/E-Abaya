"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { getQueue, onQueueUpdate } from "@/lib/offlineQueue";
import { registerOnlineSync } from "@/lib/offlineSync";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function OfflineIndicator() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const refreshCount = () => setPendingCount(getQueue().length);
    refreshCount();
    return onQueueUpdate(refreshCount);
  }, []);

  useEffect(() => registerOnlineSync(t), [t]);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className="relative p-2 text-muted-foreground hover:text-accent transition-colors"
      title={t.offline.indicator(pendingCount)}
    >
      <WifiOff className="h-5 w-5" />
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-accent-foreground bg-accent rounded-full">
          {pendingCount}
        </span>
      )}
    </div>
  );
}
