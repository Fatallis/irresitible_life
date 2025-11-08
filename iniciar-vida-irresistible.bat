@echo off
echo ========================================
echo    VIDA IRRESISTIBLE - Iniciando...
echo ========================================
echo.

REM Cambiar al directorio donde está ubicado este script
cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo Iniciando servidor de desarrollo...
echo.
echo La aplicación se abrirá automáticamente en tu navegador
echo URL: http://localhost:3000
echo.
echo Para detener el servidor, presiona Ctrl+C
echo ========================================

REM Esperar un momento y abrir el navegador
start "" "http://localhost:3000"

REM Iniciar el servidor de desarrollo
npm run dev

pause