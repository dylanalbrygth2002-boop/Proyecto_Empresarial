import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function box(title: string, lines: string[]) {
  const width = 56;
  const pad = (s: string) => s.padEnd(width).substring(0, width);
  console.log("\n" + "=".repeat(width + 4));
  console.log(`|  ${pad(title)}|");
  console.log("=".repeat(width + 4));
  for (const line of lines) console.log(`|  ${pad(line)}|`);
  console.log("=".repeat(width + 4));
}

async function main() {
  box("TechSolutions - Setup Local", [
    "Este script configura la base de datos local",
    "con migraciones y datos demo.",
  ]);

  // 1. Verificar PostgreSQL
  console.log("\n[1/5] Verificando conexion a PostgreSQL...");
  try {
    await prisma.$connect();
    console.log("[OK] PostgreSQL conectado");
  } catch (e: any) {
    console.error("[ERROR] No se pudo conectar a PostgreSQL.");
    console.error("Verifica que la extension VS Code de PostgreSQL este activa.");
    process.exit(1);
  }

  // 2. Generar cliente
  console.log("\n[2/5] Generando cliente Prisma...");
  run("bunx prisma generate");

  // 3. Migraciones
  console.log("\n[3/5] Aplicando migraciones...");
  run("bunx prisma migrate dev --name init");

  // 4. Limpiar datos?
  const users = await prisma.user.count();
  if (users > 0) {
    const resp = await ask(`\n[4/5] Existen ${users} usuarios. ¿Limpiar todo y recrear seed? (s/n): `);
    if (resp.toLowerCase() === "s") {
      console.log("\n[INFO] Eliminando datos existentes...");
      await prisma.task.deleteMany();
      await prisma.project.deleteMany();
      await prisma.client.deleteMany();
      await prisma.user.deleteMany();
      console.log("[OK] Datos eliminados");
    } else {
      console.log("[INFO] Manteniendo datos existentes. Saltando seed.");
      rl.close();
      await prisma.$disconnect();
      return;
    }
  }

  // 5. Seed
  console.log("\n[5/5] Ejecutando seed de datos demo...");
  run("bunx prisma db seed");

  // Verificacion final
  const u = await prisma.user.count();
  const c = await prisma.client.count();
  const p = await prisma.project.count();
  const t = await prisma.task.count();

  box("Setup Completado", [
    `Usuarios:  ${u}`,
    `Clientes:  ${c}`,
    `Proyectos: ${p}`,
    `Tareas:    ${t}`,
    "",
    "Inicia el servidor:",
    "  bun run dev",
    "",
    "Admin: admin@techsolutions.com / admin123",
  ]);

  rl.close();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  rl.close();
  await prisma.$disconnect();
  process.exit(1);
});
