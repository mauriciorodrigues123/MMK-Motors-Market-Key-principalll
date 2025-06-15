@echo off
echo Iniciando MMK Motors Market Key...

REM Verifica se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erro: Node.js nao encontrado. Por favor, instale o Node.js.
    pause
    exit /b 1
)

REM Instala as dependências se necessário
if not exist "node_modules" (
    echo Instalando dependencias principais...
    call npm install
)

if not exist "mmk\node_modules" (
    echo Instalando dependencias do frontend...
    cd mmk
    call npm install
    cd ..
)

if not exist "mmk\server\node_modules" (
    echo Instalando dependencias do servidor...
    cd mmk\server
    call npm install
    cd ..\..
)

REM Inicia o projeto
echo Iniciando o projeto...
npm start

pause 