import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nota: 'standalone' se usa para Docker. En Vercel se omite para usar
  // el formato nativo de serverless functions que optimiza el despliegue.
  // Para builds de Capacitor (estatico), usa: bun run build:capacitor
  allowedDevOrigins: ["127.0.0.1", "192.168.56.1"],
};

export default nextConfig;