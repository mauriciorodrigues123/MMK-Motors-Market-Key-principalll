#!/bin/bash

echo "Iniciando MMK Motors Market Key..."

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não encontrado. Por favor, instale o Node.js."
    exit 1
fi

# Instala as dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências principais..."
    npm install
fi

if [ ! -d "mmk/node_modules" ]; then
    echo "Instalando dependências do frontend..."
    cd mmk
    npm install
    cd ..
fi

if [ ! -d "mmk/server/node_modules" ]; then
    echo "Instalando dependências do servidor..."
    cd mmk/server
    npm install
    cd ../..
fi

# Inicia o projeto
echo "Iniciando o projeto..."
npm start 