# VPS Configuration Module

Módulo reutilizable para configuración y deploy de aplicaciones web en VPS con Nginx.

## 📦 Contenido

- `vps.config.ts` - Módulo de configuración TypeScript
- `deploy.ts` - Script de deploy en TypeScript
- `deploy.sh` - Script de deploy en Bash
- `setup-vps.sh` - Script de configuración inicial del VPS
- `.env.example` - Ejemplo de variables de entorno

## 🚀 Uso Rápido

### 1. Copiar este módulo a otro proyecto

```bash
cp -r vps-config /path/to/otro-proyecto/
```

### 2. Configurar variables de entorno

```bash
cd /path/to/otro-proyecto/vps-config
cp .env.example .env
# Editar .env con tus valores
```

### 3. Configurar el VPS (solo primera vez)

```bash
chmod +x setup-vps.sh
./setup-vps.sh user@IP_VPS /var/www/tu-app nombre-sitio-nginx
```

### 4. Deploy

Opción A - Usando el script Bash:
```bash
chmod +x deploy.sh
./deploy.sh
```

Opción B - Usando el script TypeScript:
```bash
npm install -D tsx
npx tsx deploy.ts --verbose
```

## 🔧 Configuración

### Variables de Entorno

```env
# VPS
VPS_HOST=IP_o_DOMINIO
VPS_USER=usuario
VPS_PORT=22
VPS_DEPLOY_PATH=/var/www/tu-app
VPS_NGINX_SITE_NAME=tu-app

# Build
VPS_BUILD_COMMAND=npm run build
VPS_BUILD_OUTPUT_DIR=dist

# Nginx
NGINX_SERVER_NAME=IP_o_DOMINIO
NGINX_ROOT=/var/www/tu-app
NGINX_PORT=80
NGINX_ENABLE_GZIP=true
NGINX_ENABLE_CACHE=true
NGINX_ENABLE_SPA=true

# HTTPS (opcional)
NGINX_ENABLE_HTTPS=false
```

## 📚 Uso Programático

### Generar configuración de Nginx

```typescript
import { generateNginxConfig, defaultNginxConfig } from './vps-config/vps.config';

const nginxConfig = generateNginxConfig({
  ...defaultNginxConfig,
  serverName: 'mi-dominio.com',
  root: '/var/www/mi-app',
  enableHTTPS: true,
  sslCertPath: '/etc/letsencrypt/live/mi-dominio.com/fullchain.pem',
  sslKeyPath: '/etc/letsencrypt/live/mi-dominio.com/privkey.pem',
});

console.log(nginxConfig);
```

### Deploy programático

```typescript
import { deploy } from './vps-config/deploy';

await deploy({
  configFile: './custom-config.json',
  buildDir: './mi-proyecto',
  verbose: true,
});
```

## 🛠️ Scripts de Deploy

### deploy.sh

Script Bash simple y rápido.

```bash
# Deploy básico
./deploy.sh

# Con opciones
./deploy.sh --verbose --host user@IP --path /var/www/app

# Omitir build
./deploy.sh --skip-build

# Ver ayuda
./deploy.sh --help
```

### deploy.ts

Script TypeScript con más funcionalidades.

```bash
# Deploy básico
npx tsx deploy.ts

# Con configuración personalizada
npx tsx deploy.ts --config custom-config.json

# Verbose
npx tsx deploy.ts --verbose

# Especificar directorio de build
npx tsx deploy.ts --build-dir ./packages/frontend
```

## 🌐 Configuración de Nginx

### SPA (Single Page Application)

Por defecto habilitado. Redirige todas las rutas a `index.html`.

```typescript
const config = {
  ...defaultNginxConfig,
  enableSPA: true, // ya está habilitado por defecto
};
```

### Cache de Assets Estáticos

```typescript
const config = {
  ...defaultNginxConfig,
  enableCache: true, // cachea JS, CSS, imágenes por 1 año
};
```

### Compresión Gzip

```typescript
const config = {
  ...defaultNginxConfig,
  enableGzip: true, // comprime text, JSON, JS, CSS
};
```

### HTTPS con Let's Encrypt

```typescript
const config = {
  ...defaultNginxConfig,
  enableHTTPS: true,
  sslCertPath: '/etc/letsencrypt/live/tu-dominio.com/fullchain.pem',
  sslKeyPath: '/etc/letsencrypt/live/tu-dominio.com/privkey.pem',
};
```

## 📋 Ejemplo de Configuración para Otro Proyecto

### Proyecto: E-commerce React

```typescript
// vps-config/custom-config.json
{
  "host": "192.168.1.100",
  "user": "deploy",
  "port": 22,
  "deployPath": "/var/www/ecommerce",
  "nginxSiteName": "ecommerce-frontend",
  "buildCommand": "npm run build:production",
  "buildOutputDir": "build"
}
```

```bash
# Deploy
npx tsx deploy.ts --config vps-config/custom-config.json --verbose
```

### Proyecto: Dashboard Next.js

```env
# .env
VPS_HOST=dashboard.miempresa.com
VPS_USER=deploy
VPS_DEPLOY_PATH=/var/www/dashboard
VPS_BUILD_COMMAND=npm run build
VPS_BUILD_OUTPUT_DIR=out

NGINX_SERVER_NAME=dashboard.miempresa.com
NGINX_ENABLE_HTTPS=true
NGINX_SSL_CERT_PATH=/etc/letsencrypt/live/dashboard.miempresa.com/fullchain.pem
NGINX_SSL_KEY_PATH=/etc/letsencrypt/live/dashboard.miempresa.com/privkey.pem
```

```bash
# Deploy
./deploy.sh --verbose
```

## 🔒 Configurar HTTPS (Let's Encrypt)

1. Instalar Certbot en el VPS:
```bash
ssh user@VPS_HOST
sudo apt install certbot python3-certbot-nginx -y
```

2. Obtener certificado:
```bash
sudo certbot --nginx -d tu-dominio.com
```

3. Actualizar configuración:
```env
NGINX_ENABLE_HTTPS=true
NGINX_SSL_CERT_PATH=/etc/letsencrypt/live/tu-dominio.com/fullchain.pem
NGINX_SSL_KEY_PATH=/etc/letsencrypt/live/tu-dominio.com/privkey.pem
```

4. Regenerar y aplicar configuración de Nginx

## 🐛 Troubleshooting

### Error: Permission denied

```bash
ssh user@VPS_HOST "sudo chown -R \$USER:\$USER /var/www/tu-app"
```

### Error: Nginx test failed

```bash
ssh user@VPS_HOST "sudo nginx -t"
# Ver errores y corregir configuración
```

### Ver logs de Nginx

```bash
ssh user@VPS_HOST "sudo tail -f /var/log/nginx/error.log"
```

## 📝 Notas

- Este módulo está optimizado para aplicaciones React/Vue/Angular (SPAs)
- Soporta tanto HTTP como HTTPS
- Incluye configuraciones de performance (gzip, cache)
- Compatible con cualquier proyecto que genere archivos estáticos

## 🔗 Referencias

- Configuración original: `docs/VPS_SETUP.md`
- Script original: `deploy.sh`
- VPS actual: heliazer@77.93.152.231
