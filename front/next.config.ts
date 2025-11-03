/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Désactiver la génération des pages API pour l'export statique
  skipTrailingSlashRedirect: true,
  // Désactiver les redirections et headers qui ne fonctionnent pas avec l'export statique
}

export default nextConfig