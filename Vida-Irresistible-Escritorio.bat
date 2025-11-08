@echo off
title Vida Irresistible - Servidor de Desarrollo

echo ========================================
echo    VIDA IRRESISTIBLE - Iniciando...
echo ========================================
echo.

REM Obtener la ruta del script actual
set "SCRIPT_DIR=%~dp0"
REM Remover la barra final si existe
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo 📁 Ubicacion del script: %SCRIPT_DIR%
echo.

REM Definir la ruta del proyecto (donde está el package.json)
set "PROJECT_DIR=C:\Users\nahol\Projects\Vida Irresistible"

REM Verificar si el proyecto existe en la ubicación esperada
if not exist "%PROJECT_DIR%\package.json" (
    echo ❌ ERROR: No se encontro el proyecto en la ubicacion esperada
    echo 📁 Buscando en: %PROJECT_DIR%
    echo.
    echo 💡 Verifica que el proyecto "Vida Irresistible" este en:
    echo    C:\Users\nahol\Projects\Vida Irresistible\
    echo.
    pause
    exit /b 1
)

REM Cambiar al directorio del proyecto
cd /d "%PROJECT_DIR%"

echo ✅ Directorio del proyecto encontrado: %CD%
echo.

REM Verificar si Node.js está instalado
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado o no está en el PATH
    echo 📥 Por favor instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: %NODE_VERSION%
echo.

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Las dependencias no están instaladas. Instalando...
    echo.
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: No se pudieron instalar las dependencias
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
    echo.
) else (
    echo ✅ Dependencias ya instaladas
    echo.
)

echo 🚀 Iniciando servidor de desarrollo...
echo.
echo 🌐 La aplicación se abrirá automáticamente en tu navegador
echo 📍 URL: http://localhost:3000
echo.
echo ⏹️  Para detener el servidor, presiona Ctrl+C en esta ventana
echo ========================================
echo.

REM Esperar 2 segundos y abrir el navegador
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

REM Iniciar el servidor de desarrollo con apertura automática del navegador
npm run dev:open

echo.
echo 👋 Servidor detenido. Presiona cualquier tecla para cerrar...
pause >nul