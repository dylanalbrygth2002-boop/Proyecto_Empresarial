import type { NextConfig } from "next";

/**
 * Configuracion de Next.js para builds de Capacitor.
 * Genera archivos estaticos en la carpeta 'out/' para empaquetar en la app movil.
 *
 * Uso: bun run build:capacitor
 */
const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["127.0.0.1", "192.168.56.1"],
};

export default nextConfig;
