@echo off
setlocal ENABLEDELAYEDEXPANSION

cd /d "%~dp0"

echo ============================================
echo         EVOLI ODYSSEY - LANCEUR AUTO
echo ============================================

call :ensure_node
if errorlevel 1 (
  echo.
  echo [ERREUR] Impossible d'installer Node.js automatiquement.
  echo Merci d'installer Node.js LTS puis de relancer ce fichier:
  echo https://nodejs.org
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

echo [3/3] Ouverture du navigateur dans 5 secondes...
timeout /t 5 /nobreak >nul
start "" "http://localhost:5173"

echo Le jeu est lance. Tu peux fermer cette fenetre.
exit /b 0

:ensure_node
where node >nul 2>nul
if not errorlevel 1 goto :node_ok

echo [INFO] Node.js non detecte. Tentative d'installation automatique...

REM Tentative 1: winget
where winget >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via winget (Node.js LTS)...
  winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :node_ok
)

REM Tentative 2: chocolatey
where choco >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via chocolatey (Node.js LTS)...
  choco install nodejs-lts -y
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :node_ok
)

REM Tentative 3: scoop
where scoop >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via scoop (Node.js LTS)...
  scoop install nodejs-lts
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :node_ok
)

exit /b 1

:node_ok
where npm >nul 2>nul
if not errorlevel 1 exit /b 0

call :refresh_path
where npm >nul 2>nul
if not errorlevel 1 exit /b 0

exit /b 1

:refresh_path
for %%I in ("%ProgramFiles%\nodejs" "%ProgramFiles(x86)%\nodejs" "%USERPROFILE%\AppData\Local\Programs\nodejs") do (
  if exist "%%~I\node.exe" (
    set "PATH=%%~I;%PATH%"
  )
)
exit /b 0
