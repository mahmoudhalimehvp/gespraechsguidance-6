# Gesprächsguidance - Pflegehilfe CRM

## Änderungen am Layout

1. **Klient/Interessent Felder nach oben verschoben**: Die Felder aus der rechten Sidebar wurden in den Hauptbereich nach oben verschoben und müssen nun dort ausgefüllt werden.

2. **Layout nach rechts verschoben**: Das gesamte Layout wurde nach rechts verschoben, um links neuen Platz zu schaffen (300px Spacer).

## Voraussetzungen

- **Node.js** (Version 18 oder höher) muss installiert sein
- Falls Node.js nicht installiert ist, können Sie es hier herunterladen: https://nodejs.org/
- Nach der Installation starten Sie PowerShell/Terminal neu, damit die PATH-Variablen aktualisiert werden

## Installation

```bash
npm install
```

## Entwicklung

### Option 1: Mit dem Start-Skript (empfohlen)

Führen Sie einfach das PowerShell-Skript aus:

```powershell
.\start-dev.ps1
```

### Option 2: Manuell

Wenn Sie `npm run dev` direkt verwenden möchten, müssen Sie zuerst die Umgebung einrichten:

```powershell
# Führen Sie dieses Skript einmal pro Terminal-Session aus:
.\setup-env.ps1

# Dann können Sie npm-Befehle verwenden:
npm run dev
```

### Option 3: Einmalige Einrichtung pro Session

Alternativ können Sie diese Befehle manuell in PowerShell ausführen:

```powershell
$env:PATH = "C:\Programme\nodejs;" + [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
npm run dev
```

## Verwendung

Die Komponente `AnfrageSitzlift` kann in Ihre React-Anwendung importiert werden:

```tsx
import AnfrageSitzlift from './components/AnfrageSitzlift';

function App() {
  return <AnfrageSitzlift />;
}
```
