import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  console.log("\n============================================================");
  console.log("  TechSolutions - Compilador de APK Android");
  console.log("============================================================\n");

  const androidDir = path.join(process.cwd(), "android");
  if (!fs.existsSync(androidDir)) {
    console.log("[ERROR] No se encontro android/. Ejecuta primero:");
    console.log("        bunx cap add android");
    process.exit(1);
  }

  console.log("[1/3] Sincronizando Capacitor...");
  run("bun run cap:sync");

  console.log("\n[2/3] Compilando APK con Gradle...");
  console.log("      (Esto puede tardar varios minutos la primera vez)\n");

  const gradlew = path.join(androidDir, "gradlew.bat");
  run(`cd android && .\\gradlew assembleDebug --console=plain`);

  console.log("\n[3/3] Verificando APK...");
  const apkPath = path.join(androidDir, "app", "build", "outputs", "apk", "debug", "app-debug.apk");
  if (fs.existsSync(apkPath)) {
    const stats = fs.statSync(apkPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`[OK] APK generado: ${sizeMB} MB`);
    console.log(`     ${apkPath}`);
    console.log("\nPara instalar en un dispositivo conectado:");
    console.log("     adb install " + apkPath);
    console.log("\nO copia el APK a tu telefono e instalalo manualmente.");
  } else {
    console.log("[ERROR] No se encontro el APK.");
    console.log("        Intenta abrir Android Studio manualmente:");
    console.log("        bun run cap:open:android");
  }

  console.log("\n============================================================\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
