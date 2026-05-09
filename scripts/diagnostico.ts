import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function pad(s: string, n: number) {
  return s.toString().padStart(n);
}

async function main() {
  console.log("\n============================================================");
  console.log("  TechSolutions - Diagnostico de Sistema");
  console.log("============================================================\n");

  // 1. Directorio
  console.log("[DIR] Directorio:", process.cwd());

  // 2. Bun
  console.log("\n[BUN] Version:");
  try {
    execSync("bun --version", { stdio: "inherit" });
  } catch {
    console.log("    NO INSTALADO");
  }

  // 3. Node
  console.log("\n[NODE] Version:");
  try {
    execSync("node --version", { stdio: "inherit" });
  } catch {
    console.log("    NO INSTALADO");
  }

  // 4. Git
  console.log("\n[GIT] Cambios pendientes:");
  try {
    const status = execSync("git status --short", { encoding: "utf-8" });
    const count = status.trim().split("\n").filter((l) => l.trim()).length;
    console.log(`    ${count} archivos modificados/sin seguimiento`);
  } catch {
    console.log("    No disponible");
  }

  // 5. PostgreSQL
  console.log("\n[DB] PostgreSQL:");
  try {
    await prisma.$connect();
    console.log("    CONECTADO (puerto 5432)");
  } catch (e: any) {
    console.log("    NO CONECTADO:", e.message?.split("\n")[0] || e);
  }

  // 6. Dependencias
  console.log("\n[DEPS] node_modules/");
  const nm = path.join(process.cwd(), "node_modules");
  if (fs.existsSync(nm)) {
    const pkgs = fs.readdirSync(nm).filter((d) => !d.startsWith("."));
    console.log(`    ${pkgs.length} paquetes instalados`);
  } else {
    console.log("    NO INSTALADOS (ejecuta: bun install)");
  }

  // 7. Prisma client
  console.log("\n[PRISMA] Cliente generado:");
  if (fs.existsSync(path.join(nm, ".prisma", "client"))) {
    console.log("    SI");
  } else {
    console.log("    NO (ejecuta: bunx prisma generate)");
  }

  // 8. Datos
  console.log("\n[DB] Datos:");
  try {
    const u = await prisma.user.count();
    const c = await prisma.client.count();
    const p = await prisma.project.count();
    const t = await prisma.task.count();
    console.log(`    Usuarios: ${pad(String(u), 3)} | Clientes: ${pad(String(c), 3)} | Proyectos: ${pad(String(p), 3)} | Tareas: ${pad(String(t), 3)}`);
  } catch (e: any) {
    console.log("    ERROR:", e.message?.split("\n")[0] || e);
  }

  // 9. Capacitor
  console.log("\n[CAP] Capacitor:");
  const androidDir = path.join(process.cwd(), "android");
  if (fs.existsSync(androidDir)) {
    console.log("    Android: CONFIGURADO");
  } else {
    console.log("    Android: NO CONFIGURADO");
  }
  const capConfig = path.join(process.cwd(), "capacitor.config.ts");
  if (fs.existsSync(capConfig)) {
    const content = fs.readFileSync(capConfig, "utf-8");
    if (content.includes("url:")) {
      const match = content.match(/url:\s*['"`]([^'"`]+)['"`]/);
      if (match && match[1] && !match[1].includes("process.env")) {
        console.log(`    URL: ${match[1]}`);
      } else {
        console.log("    URL: NO CONFIGURADA (usara archivos locales)");
      }
    }
  }

  // 10. Build
  console.log("\n[BUILD] .next/");
  if (fs.existsSync(path.join(process.cwd(), ".next"))) {
    console.log("    EXISTE");
  } else {
    console.log("    NO COMPILADO (ejecuta: bun run build)");
  }

  console.log("\n============================================================");
  console.log("  COMANDOS UTILES:");
  console.log("  bun run dev                    - Desarrollo");
  console.log("  bun run build                  - Produccion");
  console.log("  bun run scripts/setup.ts       - Setup completo");
  console.log("  bun run scripts/diagnostico.ts - Este diagnostico");
  console.log("  bun run scripts/build-apk.ts   - Compilar APK");
  console.log("============================================================\n");

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
