/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["bdxxvwjghayycdueeoot.supabase.co"],
  },
  // Optimizar para entornos serverless
  serverRuntimeConfig: {
    // Aumentar timeout a 60 segundos en funciones serverless
    maxDuration: 60,
  },
};

export default nextConfig;
