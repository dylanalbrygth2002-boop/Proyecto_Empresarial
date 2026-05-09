@echo off
echo ========================================
echo TechSolutions - Compilar APK
echo ========================================
echo.

if not exist "package.json" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto.
    pause
    exit /b 1
)

bun run scripts/build-apk.ts

pause
