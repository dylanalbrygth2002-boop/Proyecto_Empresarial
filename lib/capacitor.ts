"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar si la aplicacion esta corriendo dentro de Capacitor (app movil).
 * En la app movil, Capacitor inyecta objetos globales y modifica el user agent.
 */
export function useIsCapacitor(): boolean {
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Capacitor inyecta window.Capacitor en la app nativa
    const hasCapacitor = typeof window !== "undefined" && !!(window as any).Capacitor;
    // Tambien el user agent contiene indicadores en algunos casos
    const ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    const isWebView = ua.includes("capacitor") || ua.includes("wv") || (hasCapacitor as boolean);
    setIsCapacitor(isWebView || hasCapacitor);
  }, []);

  return isCapacitor;
}
