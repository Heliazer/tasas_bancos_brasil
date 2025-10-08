#!/bin/bash

# Script de deploy reutilizable para cualquier proyecto
# Uso: ./deploy.sh [opciones]

set -e

# Cargar variables de entorno si existen
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Valores por defecto
VPS_HOST="${VPS_HOST:-heliazer@77.93.152.231}"
VPS_PATH="${VPS_DEPLOY_PATH:-/var/www/tasa-brasil}"
BUILD_DIR="${VPS_BUILD_OUTPUT_DIR:-dist}"
BUILD_COMMAND="${VPS_BUILD_COMMAND:-npm run build}"

# Parsear argumentos
VERBOSE=false
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --host)
            VPS_HOST="$2"
            shift 2
            ;;
        --path)
            VPS_PATH="$2"
            shift 2
            ;;
        --build-dir)
            BUILD_DIR="$2"
            shift 2
            ;;
        --help|-h)
            echo "Uso: $0 [opciones]"
            echo ""
            echo "Opciones:"
            echo "  --host <user@host>    Host del VPS (default: $VPS_HOST)"
            echo "  --path <path>         Path de deploy en VPS (default: $VPS_PATH)"
            echo "  --build-dir <dir>     Directorio de build (default: $BUILD_DIR)"
            echo "  --skip-build          Omitir el build"
            echo "  --verbose, -v         Modo verbose"
            echo "  --help, -h            Mostrar esta ayuda"
            exit 0
            ;;
        *)
            echo "Opción desconocida: $1"
            echo "Usa --help para ver las opciones disponibles"
            exit 1
            ;;
    esac
done

# Función de log
log() {
    if [ "$VERBOSE" = true ]; then
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    else
        echo "$1"
    fi
}

# Build
if [ "$SKIP_BUILD" = false ]; then
    log "📦 Building application..."
    eval "$BUILD_COMMAND"
    log "✅ Build completado"
fi

# Verificar que existe el directorio de build
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Error: Directorio de build '$BUILD_DIR' no existe"
    exit 1
fi

# Deploy
log "🚀 Deploying to $VPS_HOST..."
scp -r "$BUILD_DIR"/* "$VPS_HOST:$VPS_PATH/"
log "✅ Archivos transferidos"

# Mensaje final
IP=$(echo "$VPS_HOST" | cut -d'@' -f2)
echo ""
echo "✨ Deploy completado!"
echo "🌐 Accede a: http://$IP"
