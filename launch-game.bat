@echo off
setlocal ENABLEDELAYEDEXPANSION

cd /d "%~dp0"

echo ============================================
echo         EVOLI ODYSSEY - LANCEUR AUTO
echo ============================================

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe Node.js depuis https://nodejs.org puis relance ce fichier.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] npm n'est pas disponible.
  echo Reinstalle Node.js (version LTS) puis relance ce fichier.
  pause
  exit /b 1
)

echo [1/3] Installation des dependances...
call npm install
if errorlevel 1 (
  echo [ERREUR] Echec de l'installation des dependances.
  pause
  exit /b 1
)

echo [2/3] Lancement du serveur du jeu...
start "Evoli Odyssey - Dev Server" cmd /k "cd /d "%~dp0" && npm run dev"

echo [3/3] Ouverture du navigateur dans 4 secondes...
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo Le jeu est lance. Tu peux fermer cette fenetre.
exit /b 0
