/**
 * VPS Configuration Module
 * Módulo reutilizable para configuración de VPS en otros proyectos
 */

export interface VPSConfig {
  host: string;
  user: string;
  port: number;
  deployPath: string;
  nginxSiteName: string;
  buildCommand: string;
  buildOutputDir: string;
}

export interface NginxConfig {
  serverName: string;
  root: string;
  port: number;
  enableGzip: boolean;
  enableCache: boolean;
  enableSPA: boolean;
  enableHTTPS: boolean;
  sslCertPath?: string;
  sslKeyPath?: string;
}

/**
 * Configuración por defecto del VPS (Tasa Brasil)
 */
export const defaultVPSConfig: VPSConfig = {
  host: '77.93.152.231',
  user: 'heliazer',
  port: 22,
  deployPath: '/var/www/tasa-brasil',
  nginxSiteName: 'tasa-brasil',
  buildCommand: 'npm run build',
  buildOutputDir: 'dist',
};

/**
 * Configuración por defecto de Nginx
 */
export const defaultNginxConfig: NginxConfig = {
  serverName: '77.93.152.231',
  root: '/var/www/tasa-brasil',
  port: 80,
  enableGzip: true,
  enableCache: true,
  enableSPA: true,
  enableHTTPS: false,
};

/**
 * Genera la configuración de Nginx basada en los parámetros
 */
export function generateNginxConfig(config: NginxConfig): string {
  const {
    serverName,
    root,
    port,
    enableGzip,
    enableCache,
    enableSPA,
    enableHTTPS,
    sslCertPath,
    sslKeyPath
  } = config;

  let nginxConfig = '';

  // Configuración HTTP
  nginxConfig += `server {
    listen ${port};
    server_name ${serverName};

    root ${root};
    index index.html;
`;

  // Soporte SPA
  if (enableSPA) {
    nginxConfig += `
    # SPA support - todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
`;
  }

  // Cache para assets estáticos
  if (enableCache) {
    nginxConfig += `
    # Cache para assets estáticos
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
`;
  }

  // Compresión Gzip
  if (enableGzip) {
    nginxConfig += `
    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
`;
  }

  nginxConfig += `}\n`;

  // Configuración HTTPS (si está habilitado)
  if (enableHTTPS && sslCertPath && sslKeyPath) {
    nginxConfig += `
server {
    listen 443 ssl http2;
    server_name ${serverName};

    ssl_certificate ${sslCertPath};
    ssl_certificate_key ${sslKeyPath};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root ${root};
    index index.html;
`;

    if (enableSPA) {
      nginxConfig += `
    location / {
        try_files $uri $uri/ /index.html;
    }
`;
    }

    if (enableCache) {
      nginxConfig += `
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
`;
    }

    if (enableGzip) {
      nginxConfig += `
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
`;
    }

    nginxConfig += `}\n`;

    // Redirección HTTP a HTTPS
    nginxConfig += `
server {
    listen 80;
    server_name ${serverName};
    return 301 https://$server_name$request_uri;
}
`;
  }

  return nginxConfig;
}

/**
 * Carga la configuración desde variables de entorno
 */
export function loadVPSConfigFromEnv(): VPSConfig {
  return {
    host: process.env.VPS_HOST || defaultVPSConfig.host,
    user: process.env.VPS_USER || defaultVPSConfig.user,
    port: parseInt(process.env.VPS_PORT || String(defaultVPSConfig.port)),
    deployPath: process.env.VPS_DEPLOY_PATH || defaultVPSConfig.deployPath,
    nginxSiteName: process.env.VPS_NGINX_SITE_NAME || defaultVPSConfig.nginxSiteName,
    buildCommand: process.env.VPS_BUILD_COMMAND || defaultVPSConfig.buildCommand,
    buildOutputDir: process.env.VPS_BUILD_OUTPUT_DIR || defaultVPSConfig.buildOutputDir,
  };
}

/**
 * Carga la configuración de Nginx desde variables de entorno
 */
export function loadNginxConfigFromEnv(): NginxConfig {
  return {
    serverName: process.env.NGINX_SERVER_NAME || defaultNginxConfig.serverName,
    root: process.env.NGINX_ROOT || defaultNginxConfig.root,
    port: parseInt(process.env.NGINX_PORT || String(defaultNginxConfig.port)),
    enableGzip: process.env.NGINX_ENABLE_GZIP !== 'false',
    enableCache: process.env.NGINX_ENABLE_CACHE !== 'false',
    enableSPA: process.env.NGINX_ENABLE_SPA !== 'false',
    enableHTTPS: process.env.NGINX_ENABLE_HTTPS === 'true',
    sslCertPath: process.env.NGINX_SSL_CERT_PATH,
    sslKeyPath: process.env.NGINX_SSL_KEY_PATH,
  };
}

export default {
  defaultVPSConfig,
  defaultNginxConfig,
  generateNginxConfig,
  loadVPSConfigFromEnv,
  loadNginxConfigFromEnv,
};
