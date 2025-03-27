/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimizar para entornos serverless
  experimental: {
    serverActions: true,
  },
  // Aumentar el tiempo de espera para operaciones de DB
  serverRuntimeConfig: {
    // Aumentar timeout a 60 segundos en funciones serverless
    maxDuration: 60,
  },
};

export default nextConfig;
