@echo off
title FoundIt Gmail Verification Server
cd /d "%~dp0server"

if not exist node_modules (
    echo [FoundIt] Installing server dependencies...
    call npm install
)

echo [FoundIt] Starting Gmail Verification Server on port 3001...
node server.js
pause
