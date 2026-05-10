import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function box(lines: string[]) {
  const w = Math.max(...lines.map((l) => l.length)) + 2;
  console.log("\n+" + "-".repeat(w) + "+");
  for (const line of lines) {
    console.log("| " + line.padEnd(w - 1) + "|");
  }
  console.log("+" + "-".repeat(w) + "+");
}

async function main() {
  console.log("\n============================================================");
  console.log("  TechSolutions - Guia de Despliegue a Produccion");
  console.log("============================================================\n");

  // === PASO 1: RAILWAY ===
  box([
    "PASO 1: BASE DE DATOS EN RAILWAY",
    "",
    "1. Ve a https://railway.app",
    "2. Crea un proyecto > New > Database > Add PostgreSQL",
    "3. Ve a la pestana 'Connect'",
    "4. Copia la DATABASE_URL completa",
  ]);

  const railwayUrl = await ask("\nPega la DATABASE_URL de Railway: ");
  if (!railwayUrl.trim()) {
    console.log("ERROR: URL vacia. Abortando.");
    rl.close();
    return;
  }

  console.log("\n[INFO] Verificando conexion...");
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({ datasources: { db: { url: railwayUrl } } });
    await prisma.$connect();
    console.log("[OK] Conexion a Railway exitosa");
    await prisma.$disconnect();
  } catch (e: any) {
    console.log("[ERROR] No se pudo conectar:", e.message);
    rl.close();
    return;
  }

  console.log("\n[INFO] Ejecutando migraciones en Railway...");
  process.env.DATABASE_URL = railwayUrl;
  run("bunx prisma migrate deploy");

  console.log("\n[INFO] Ejecutando seed en Railway...");
  run("bunx prisma db seed");

  // === PASO 2: VERCEL ===
  box([
    "PASO 2: FRONTEND EN VERCEL",
    "",
    "1. Ve a https://vercel.com",
    "2. Importa tu repositorio de GitHub",
    "3. Framework Preset: Next.js",
    "4. Agrega Environment Variables:",
    "   DATABASE_URL = (la URL de Railway)",
    "   JWT_SECRET   = tu-secreto-jwt",
    "   NODE_ENV     = production",
    "5. El build esta configurado para ejecutar",
    "   migraciones automaticamente (vercel.json)",
    "6. Haz clic en Deploy",
    "7. Copia la URL generada",
  ]);

  const vercelUrl = await ask("\nPega la URL de Vercel: ");
  if (!vercelUrl.trim()) {
    console.log("ERROR: URL vacia. Abortando.");
    rl.close();
    return;
  }

  // === PASO 3: CONFIGURAR CAPACITOR ===
  box(["PASO 3: CONFIGURAR CAPACITOR"]);

  const configPath = "capacitor.config.ts";
  let config = fs.readFileSync(configPath, "utf-8");

  // Reemplazar la URL
  config = config.replace(
    /url:\s*[^,]+,/,
    `url: '${vercelUrl}',`
  );
  fs.writeFileSync(configPath, config);
  console.log("[OK] capacitor.config.ts actualizado");

  console.log("\n[INFO] Sincronizando Capacitor...");
  run("bun run cap:sync");

  // === PASO 4: COMPILAR APK ===
  box([
    "PASO 4: COMPILAR APK",
    "",
    "Para compilar el APK de debug:",
    "  scripts\\build-apk.bat",
    "",
    "O abre Android Studio manualmente:",
    "  bun run cap:open:android",
    "  Build > Build Bundle(s) / APK(s) > Build APK(s)",
  ]);

  const compilar = await ask("\nDeseas compilar el APK ahora? (s/n): ");
  if (compilar.toLowerCase() === "s") {
    run("bun run scripts/build-apk.ts");
  }

  // === RESUMEN ===
  box([
    "DESPLIEGUE CONFIGURADO",
    "",
    `Base de datos: Railway`,
    `Frontend:      ${vercelUrl}`,
    `App movil:     Cargando desde Vercel`,
    "",
    "La app movil se actualiza automaticamente",
    "al reiniciarla. Solo recompila el APK si",
    "cambias plugins nativos de Capacitor.",
  ]);

  rl.close();
}

main().catch((e) => {
  console.error(e);
  rl.close();
});
