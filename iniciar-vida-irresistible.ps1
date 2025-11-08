# Script PowerShell para iniciar Vida Irresistible
# Ejecutar con: powershell -ExecutionPolicy Bypass -File iniciar-vida-irresistible.ps1

param(
    [switch]$NoBrowser,  # No abrir navegador automáticamente
    [switch]$Install     # Forzar instalación de dependencias
)

# Configuración
$ProjectName = "VIDA IRRESISTIBLE"
$ServerURL = "http://localhost:3000"
$Port = 3000

# Función para mostrar mensajes con colores
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Encabezado
Clear-Host
Write-ColorMessage "========================================" "Cyan"
Write-ColorMessage "    $ProjectName - Iniciando..." "Yellow"
Write-ColorMessage "========================================" "Cyan"
Write-Host ""

# Cambiar al directorio del script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
Write-ColorMessage "📁 Directorio: $ScriptDir" "Gray"

# Verificar Node.js
Write-ColorMessage "🔍 Verificando Node.js..." "Blue"
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-ColorMessage "✅ Node.js encontrado: $nodeVersion" "Green"
    } else {
        throw "Node.js no encontrado"
    }
}
catch {
    Write-ColorMessage "❌ ERROR: Node.js no está instalado o no está en el PATH" "Red"
    Write-ColorMessage "📥 Por favor instala Node.js desde https://nodejs.org/" "Yellow"
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar/Instalar dependencias
if ($Install -or !(Test-Path "node_modules")) {
    Write-ColorMessage "📦 Instalando dependencias..." "Blue"
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-ColorMessage "✅ Dependencias instaladas correctamente" "Green"
        } else {
            throw "Error en npm install"
        }
    }
    catch {
        Write-ColorMessage "❌ ERROR: No se pudieron instalar las dependencias" "Red"
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    Write-ColorMessage "✅ Dependencias ya instaladas" "Green"
}

# Verificar si el puerto está en uso
if (Test-Port -Port $Port) {
    Write-ColorMessage "⚠️  ADVERTENCIA: El puerto $Port ya está en uso" "Yellow"
    Write-ColorMessage "🌐 Abriendo navegador en $ServerURL" "Blue"
    if (!$NoBrowser) {
        Start-Process $ServerURL
    }
    Read-Host "Presiona Enter para continuar de todos modos"
}

# Mostrar información
Write-Host ""
Write-ColorMessage "🚀 Iniciando servidor de desarrollo..." "Blue"
Write-ColorMessage "🌐 URL: $ServerURL" "Green"
Write-ColorMessage "⏹️  Para detener: Ctrl+C" "Yellow"
Write-ColorMessage "========================================" "Cyan"
Write-Host ""

# Abrir navegador después de un breve delay
if (!$NoBrowser) {
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 3
        Start-Process "http://localhost:3000"
    } | Out-Null
    Write-ColorMessage "🌐 El navegador se abrirá automáticamente en 3 segundos..." "Green"
}

# Iniciar servidor
try {
    npm run dev
}
catch {
    Write-ColorMessage "❌ ERROR: No se pudo iniciar el servidor" "Red"
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-ColorMessage "👋 ¡Gracias por usar $ProjectName!" "Green"
Read-Host "Presiona Enter para salir"