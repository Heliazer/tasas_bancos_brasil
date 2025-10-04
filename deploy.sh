#!/bin/bash

# Script de deploy automático para Simulador Factoring
# Uso: ./deploy.sh [usuario@IP_VPS]

set -e

VPS_HOST="${1:-heliazer@77.93.152.231}"
VPS_PATH="/var/www/tasa-brasil"

echo "Building application..."
cd simulador-factoring
npm run build

echo "Deploying to $VPS_HOST..."
scp -r dist/* "$VPS_HOST:$VPS_PATH/"

echo "Deploy completado!"
echo "Accede a: http://$(echo $VPS_HOST | cut -d'@' -f2)"
