# 🚀 Accesos Directos para Vida Irresistible

Este proyecto incluye varios métodos para iniciar fácilmente el servidor de desarrollo y abrir automáticamente la aplicación en tu navegador.

## 📋 Opciones Disponibles

### 1. 🎯 **Método Más Fácil - Script .BAT para Escritorio**
**Archivo:** `Vida-Irresistible-Escritorio.bat`

**Cómo usar:**
- Haz **doble clic** en el archivo `Vida-Irresistible-Escritorio.bat` (funciona desde cualquier ubicación)
- El script automáticamente:
  - 🔍 Detecta automáticamente el directorio del proyecto
  - ✅ Verifica que Node.js esté instalado
  - 📦 Instala dependencias si es necesario
  - 🚀 Inicia el servidor de desarrollo
  - 🌐 Abre tu navegador en `http://localhost:3000`
  - 💻 Funciona desde escritorio, carpeta o cualquier ubicación

### 1.1. 📁 **Script .BAT Simple (Para uso desde la carpeta del proyecto)**
**Archivo:** `iniciar-vida-irresistible.bat`

**Cómo usar:**
- Haz **doble clic** en el archivo `iniciar-vida-irresistible.bat` desde la carpeta del proyecto
- El script automáticamente:
  - ✅ Verifica que Node.js esté instalado
  - 📦 Instala dependencias si es necesario
  - 🚀 Inicia el servidor de desarrollo
  - 🌐 Abre tu navegador en `http://localhost:3000`

### 2. ⚡ **Método Avanzado - PowerShell**
**Archivo:** `iniciar-vida-irresistible.ps1`

**Cómo usar:**
```powershell
# Método 1: Desde PowerShell
powershell -ExecutionPolicy Bypass -File iniciar-vida-irresistible.ps1

# Método 2: Con opciones
powershell -ExecutionPolicy Bypass -File iniciar-vida-irresistible.ps1 -NoBrowser  # No abrir navegador
powershell -ExecutionPolicy Bypass -File iniciar-vida-irresistible.ps1 -Install    # Forzar instalación
```

**Características adicionales:**
- 🎨 Interfaz colorida y amigable
- 🔍 Verificación avanzada de dependencias
- ⚠️ Detección de puertos en uso
- 📊 Mejor manejo de errores

### 3. 📦 **Comandos NPM Mejorados**
Ahora tienes nuevos comandos disponibles:

```bash
npm start           # Inicia servidor Y abre navegador automáticamente
npm run dev:open    # Igual que npm start
npm run dev         # Inicia servidor (sin abrir navegador)
npm run preview:open # Vista previa de producción con navegador
```

### 4. 🖥️ **Acceso Directo en el Escritorio**

**Para crear un acceso directo:**
1. Haz clic derecho en `crear-acceso-directo.ps1`
2. Selecciona "Ejecutar con PowerShell"
3. Se creará automáticamente un acceso directo en tu escritorio llamado "Vida Irresistible"
4. Ahora puedes hacer doble clic en el acceso directo del escritorio para iniciar la aplicación

**Qué hace:**
- Crea un acceso directo en el escritorio que apunta al archivo `Vida-Irresistible-Escritorio.bat`
- El acceso directo tendrá un icono de aplicación web
- Funciona desde cualquier ubicación del escritorio

**O desde PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File crear-acceso-directo.ps1
```

## 🛠️ Solución de Problemas

### ❌ "Node.js no está instalado"
- Descarga e instala Node.js desde: https://nodejs.org/
- Reinicia tu terminal/PowerShell después de la instalación

### ❌ "No se pueden ejecutar scripts de PowerShell"
Ejecuta este comando en PowerShell como administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "Puerto 3000 ya está en uso"
- Cierra otras aplicaciones que usen el puerto 3000
- O usa el script PowerShell que detecta automáticamente este problema

### ❌ "Error de permisos"
- Ejecuta el script como administrador
- Verifica que tienes permisos de escritura en la carpeta del proyecto

## 🎯 Recomendación

**Para uso diario:** Usa el archivo `iniciar-vida-irresistible.bat` - es la forma más simple y confiable.

**Para desarrollo avanzado:** Usa el script PowerShell para mayor control y diagnósticos.

## 📁 Archivos Creados

- `iniciar-vida-irresistible.bat` - Script principal (Windows)
- `iniciar-vida-irresistible.ps1` - Script avanzado (PowerShell)
- `crear-acceso-directo.ps1` - Generador de acceso directo
- `INSTRUCCIONES-ACCESO-DIRECTO.md` - Este archivo de instrucciones

¡Disfruta desarrollando con Vida Irresistible! 🌟