# PowerShell-Skript zum Starten des Entwicklungsservers
# Dieses Skript setzt die notwendigen PATH-Variablen und Execution Policy

# Aktualisiere PATH-Variablen
$env:PATH = "C:\Programme\nodejs;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

# Setze Execution Policy für diese Session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Wechsle ins Projektverzeichnis
Set-Location $PSScriptRoot

# Starte den Entwicklungsserver
Write-Host "Starte Entwicklungsserver..." -ForegroundColor Green
npm run dev
