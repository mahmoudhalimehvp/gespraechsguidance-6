# PowerShell-Skript zum Einrichten der Umgebung
# Führen Sie dieses Skript einmal aus, bevor Sie npm-Befehle verwenden

# Aktualisiere PATH-Variablen
$env:PATH = "C:\Programme\nodejs;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

# Setze Execution Policy für diese Session
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

Write-Host "Umgebung wurde eingerichtet!" -ForegroundColor Green
Write-Host "Sie können jetzt npm-Befehle verwenden." -ForegroundColor Green
