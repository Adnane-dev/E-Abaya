/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant la construction
  },
  images: {
    unoptimized: true, // Désactive l'optimisation des images (si nécessaire pour un projet spécifique)
  },
};

module.exports = nextConfig;
