#!/bin/bash

# Script de configuración inicial del VPS
# Uso: ./setup-vps.sh [user@host]

set -e

VPS_HOST="${1:-heliazer@77.93.152.231}"
DEPLOY_PATH="${2:-/var/www/tasa-brasil}"
NGINX_SITE_NAME="${3:-tasa-brasil}"

echo "🔧 Configurando VPS: $VPS_HOST"
echo "📁 Path de deploy: $DEPLOY_PATH"
echo "🌐 Nombre del sitio Nginx: $NGINX_SITE_NAME"
echo ""

# Función para ejecutar comandos en el VPS
run_remote() {
    ssh "$VPS_HOST" "$1"
}

echo "📦 Instalando dependencias..."
run_remote "sudo apt update && sudo apt install nginx -y"

echo "🚀 Iniciando y habilitando Nginx..."
run_remote "sudo systemctl start nginx && sudo systemctl enable nginx"

echo "📁 Creando directorio de la aplicación..."
run_remote "sudo mkdir -p $DEPLOY_PATH && sudo chown -R \$USER:\$USER $DEPLOY_PATH"

echo "🔥 Configurando firewall..."
run_remote "sudo ufw allow 'Nginx Full' && sudo ufw --force enable"

echo ""
echo "✅ VPS configurado exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Crea la configuración de Nginx con el módulo vps.config.ts"
echo "2. Copia la configuración al VPS: scp nginx.conf $VPS_HOST:/etc/nginx/sites-available/$NGINX_SITE_NAME"
echo "3. Activa el sitio en el VPS:"
echo "   ssh $VPS_HOST 'sudo ln -s /etc/nginx/sites-available/$NGINX_SITE_NAME /etc/nginx/sites-enabled/'"
echo "   ssh $VPS_HOST 'sudo nginx -t && sudo systemctl reload nginx'"
echo "4. Ejecuta el deploy: ./deploy.sh"
