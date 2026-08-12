/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant la construction
  },
  images: {
    unoptimized: true, // Désactive l'optimisation des images (si nécessaire pour un projet spécifique)
  },
  env: {
    // Fresh per build (Netlify's commit SHA when available, otherwise a
    // timestamp) so the service worker's cache version always changes on
    // deploy — see app/sw.js/route.ts.
    NEXT_PUBLIC_BUILD_ID: process.env.COMMIT_REF || String(Date.now()),
  },
};

module.exports = nextConfig;
