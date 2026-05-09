@echo off
echo ========================================
echo TechSolutions - Setup Local
echo ========================================
echo.

:: Verificar que estamos en la raiz del proyecto
if not exist "package.json" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto.
    pause
    exit /b 1
)

:: Ejecutar script TypeScript con Bun
bun run scripts/setup.ts

pause
