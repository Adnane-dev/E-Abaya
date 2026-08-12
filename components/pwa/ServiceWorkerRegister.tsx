"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline mode simply isn't available for this session — the rest
        // of the site works normally without it.
      });
    }
  }, []);

  return null;
}
