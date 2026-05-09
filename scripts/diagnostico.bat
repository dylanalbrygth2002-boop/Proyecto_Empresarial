@echo off
echo ========================================
echo TechSolutions - Diagnostico
echo ========================================
echo.

if not exist "package.json" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto.
    pause
    exit /b 1
)

bun run scripts/diagnostico.ts

pause
