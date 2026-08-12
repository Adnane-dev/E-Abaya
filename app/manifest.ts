import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Style-Girls",
    description: "Marketplace de mode modeste — abayas, hijabs, kaftans et robes.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7a2e3d",
    icons: [
      {
        src: "/logo-icon.png",
        sizes: "388x388",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
