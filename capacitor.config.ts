import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuracion de Capacitor para la app movil TechSolutions.
 *
 * ESTRATEGIA: Remote URL (recomendada)
 * La app movil carga la aplicacion directamente desde Vercel via server.url.
 * Esto evita tener que exportar estaticamente Next.js (imposible con API routes)
 * y garantiza que siempre se use la ultima version sin actualizar la app stores.
 *
 * Requiere conexion a internet. El directorio 'out/' es solo un placeholder
 * para que 'cap sync' funcione correctamente.
 */
const config: CapacitorConfig = {
  appId: 'com.techsolutions.sistema',
  appName: 'TechSolutions',
  // Directorio web de fallback. Con server.url configurado, este contenido
  // solo se muestra brevemente mientras carga la URL remota.
  webDir: 'out',
  server: {
    // URL de tu app desplegada en Vercel.
    // Reemplaza con tu dominio real despues del despliegue.
    // Ejemplo: url: 'https://techsolutions-app.vercel.app',
    url: process.env.NEXT_PUBLIC_APP_URL || undefined,
    // Permite HTTP (no solo HTTPS). Util para pruebas locales.
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    },
  },
};

export default config;
