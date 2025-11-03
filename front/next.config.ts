/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour l'export statique (nécessaire pour Render Static Sites)
  output: 'export',
  
  // Ajouter un slash trailing pour une meilleure compatibilité
  trailingSlash: true,
  
  // Désactiver l'optimisation des images pour l'export statique
  images: {
    unoptimized: true
  },
  
  // Pas de basePath puisque vous êtes à la racine
  basePath: '',
  
  // Pas d'assetPrefix pour les déploiements standard
  assetPrefix: '',
  
  // Activer le App Router (si vous utilisez app/ directory)
  experimental: {
    appDir: true,
  },
  
  // Redirections pour le SPA (Single Page Application)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  }
}

export default nextConfig