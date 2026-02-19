@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "LOG_FILE=%SCRIPT_DIR%launch-game.log"

call :main
set "EXIT_CODE=%ERRORLEVEL%"

echo.>>"%LOG_FILE%"
echo [END] code=!EXIT_CODE! - %date% %time%>>"%LOG_FILE%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Le lanceur s'est termine avec une erreur (code %EXIT_CODE%).
  echo Consulte le fichier de log: "%LOG_FILE%"
  pause
)

exit /b %EXIT_CODE%

:main
echo [START] %date% %time%>"%LOG_FILE%"
echo ============================================
echo         EVOLI ODYSSEY - LANCEUR AUTO
echo ============================================
echo [INFO] Logs: "%LOG_FILE%"

echo [INFO] Positionnement dans le dossier du jeu...>>"%LOG_FILE%"
pushd "%SCRIPT_DIR%" >>"%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [ERREUR] Impossible d'acceder au dossier: "%SCRIPT_DIR%"
  exit /b 10
)

call :ensure_node
if errorlevel 1 (
  echo [ERREUR] Node.js/npm indisponibles apres tentative d'installation.
  echo Installe Node.js LTS: https://nodejs.org
  popd
  exit /b 20
)

echo [1/4] Verification des dependances...
if not exist "node_modules" (
  echo [INFO] node_modules absent: installation en cours...>>"%LOG_FILE%"
  call npm install >>"%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [ERREUR] Echec de "npm install".
    popd
    exit /b 30
  )
) else (
  echo [INFO] node_modules deja present, installation sautee.>>"%LOG_FILE%"
)

echo [2/4] Lancement du serveur Vite dans une nouvelle fenetre...
start "Evoli Odyssey - Dev Server" cmd /k "cd /d "%SCRIPT_DIR%" && npm run dev"

if errorlevel 1 (
  echo [ERREUR] Impossible d'ouvrir la fenetre du serveur.
  popd
  exit /b 40
)

echo [3/4] Attente du serveur sur http://127.0.0.1:5173 ...
call :wait_for_server
if errorlevel 1 (
  echo [WARN] Serveur non detecte dans le delai. Ouverture du navigateur quand meme.
)

echo [4/4] Ouverture du navigateur...
start "" "http://127.0.0.1:5173"

if errorlevel 1 (
  echo [ERREUR] Impossible d'ouvrir le navigateur automatiquement.
  echo Ouvre manuellement: http://127.0.0.1:5173
  popd
  exit /b 50
)

echo [OK] Jeu lance. Si la page est vide, attends quelques secondes puis actualise.
popd
exit /b 0

:ensure_node
where node >nul 2>nul
if not errorlevel 1 goto :ensure_npm

echo [INFO] Node.js non detecte. Tentative d'installation automatique...>>"%LOG_FILE%"

where winget >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via winget...>>"%LOG_FILE%"
  winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements --silent >>"%LOG_FILE%" 2>&1
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :ensure_npm
)

where choco >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via choco...>>"%LOG_FILE%"
  choco install nodejs-lts -y >>"%LOG_FILE%" 2>&1
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :ensure_npm
)

where scoop >nul 2>nul
if not errorlevel 1 (
  echo [INFO] Installation via scoop...>>"%LOG_FILE%"
  scoop install nodejs-lts >>"%LOG_FILE%" 2>&1
  call :refresh_path
  where node >nul 2>nul
  if not errorlevel 1 goto :ensure_npm
)

exit /b 1

:ensure_npm
where npm >nul 2>nul
if not errorlevel 1 exit /b 0

call :refresh_path
where npm >nul 2>nul
if not errorlevel 1 exit /b 0

exit /b 1

:refresh_path
for %%I in ("%ProgramFiles%\nodejs" "%ProgramFiles(x86)%\nodejs" "%USERPROFILE%\AppData\Local\Programs\nodejs") do (
  if exist "%%~I\node.exe" set "PATH=%%~I;%PATH%"
)
exit /b 0

:wait_for_server
where powershell >nul 2>nul
if errorlevel 1 (
  timeout /t 8 /nobreak >nul
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false; for($i=0;$i -lt 30;$i++){ try { Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173' -TimeoutSec 2 | Out-Null; $ok=$true; break } catch { Start-Sleep -Milliseconds 700 } }; if($ok){ exit 0 } else { exit 1 }" >>"%LOG_FILE%" 2>&1
exit /b %ERRORLEVEL%
