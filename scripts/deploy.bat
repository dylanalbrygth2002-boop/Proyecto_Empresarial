@echo off
echo ========================================
echo TechSolutions - Despliegue a Produccion
echo ========================================
echo.
echo Este script te guia paso a paso para desplegar
echo en Vercel + Railway y configurar la app movil.
echo.
echo PASOS:
echo 1. Crear base de datos en Railway (railway.app)
echo 2. Desplegar frontend en Vercel (vercel.com)
echo 3. Configurar Capacitor con la URL de Vercel
echo 4. Compilar APK de Android
echo.
pause

if not exist "package.json" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto.
    pause
    exit /b 1
)

bun run scripts/deploy.ts

pause
