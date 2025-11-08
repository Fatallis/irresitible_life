# Script para crear un acceso directo en el escritorio
# Ejecutar como administrador: powershell -ExecutionPolicy Bypass -File crear-acceso-directo.ps1

param(
    [string]$DesktopPath = [Environment]::GetFolderPath("Desktop")
)

# Configuración
$ProjectName = "Vida Irresistible"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BatFile = Join-Path $ScriptDir "Vida-Irresistible-Escritorio.bat"
$ShortcutPath = Join-Path $DesktopPath "$ProjectName.lnk"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CREANDO ACCESO DIRECTO" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que el archivo .bat existe
if (!(Test-Path $BatFile)) {
    Write-Host "ERROR: No se encontro el archivo Vida-Irresistible-Escritorio.bat" -ForegroundColor Red
    Write-Host "Buscando en: $BatFile" -ForegroundColor Gray
    Read-Host "Presiona Enter para salir"
    exit 1
}

try {
    # Crear el objeto WScript.Shell
    $WshShell = New-Object -ComObject WScript.Shell
    
    # Crear el acceso directo
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $BatFile
    $Shortcut.WorkingDirectory = $ScriptDir
    $Shortcut.Description = "Iniciar servidor de desarrollo de $ProjectName"
    $Shortcut.IconLocation = "shell32.dll,25"  # Icono de aplicación web
    
    # Guardar el acceso directo
    $Shortcut.Save()
    
    Write-Host "Acceso directo creado exitosamente" -ForegroundColor Green
    Write-Host "Ubicacion: $ShortcutPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ahora puedes:" -ForegroundColor Blue
    Write-Host "  - Hacer doble clic en el acceso directo del escritorio" -ForegroundColor White
    Write-Host "  - Anclar el acceso directo a la barra de tareas" -ForegroundColor White
    Write-Host "  - Mover el acceso directo donde prefieras" -ForegroundColor White
    
} catch {
    Write-Host "ERROR: No se pudo crear el acceso directo" -ForegroundColor Red
    Write-Host "Motivo: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Blue
    Write-Host "  - Ejecuta este script como administrador" -ForegroundColor White
    Write-Host "  - Verifica que tienes permisos de escritura en el escritorio" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Presiona Enter para salir"