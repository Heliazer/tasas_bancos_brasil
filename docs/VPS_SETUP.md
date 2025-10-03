# Configuración VPS - Simulador Factoring

## Paso 1: Preparar el VPS

### Conectar al VPS
```bash
ssh usuario@IP_DEL_VPS
```

### Instalar dependencias
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Crear directorio de la aplicación
```bash
sudo mkdir -p /var/www/tasa-brasil
sudo chown -R $USER:$USER /var/www/tasa-brasil
```

## Paso 2: Configurar Nginx

### Crear archivo de configuración
```bash
sudo nano /etc/nginx/sites-available/tasa-brasil
```

### Contenido del archivo:
```nginx
server {
    listen 80;
    server_name IP_DEL_VPS;  # Cambia por tu IP o dominio

    root /var/www/tasa-brasil;
    index index.html;

    # SPA support - todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/tasa-brasil /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Paso 3: Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Paso 4: Deploy desde tu máquina local

### Primera vez - configurar el script
Edita `deploy.sh` y reemplaza `usuario@IP_VPS` con tus datos reales.

### Ejecutar deploy
```bash
./deploy.sh usuario@IP_DEL_VPS
```

El script automáticamente:
1. Hace build de la app
2. Transfiere los archivos al VPS
3. Te muestra la URL de acceso

## Paso 5: Acceder a la aplicación

```
http://IP_DEL_VPS
```

## HTTPS (Opcional pero recomendado)

### Con dominio propio:

1. Apunta tu dominio a la IP del VPS en el DNS

2. Instala Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

3. Obtén el certificado:
```bash
sudo certbot --nginx -d tu-dominio.com
```

Certbot configurará automáticamente Nginx con HTTPS.

## Desarrollo remoto (opcional)

Si quieres desarrollar directamente en el VPS:

### En el VPS:
```bash
# Instalar Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20.19.0
nvm use 20.19.0

# Clonar repo y configurar
git clone https://github.com/Heliazer/tasas_bancos_brasil.git
cd tasas_bancos_brasil/simulador-factoring
npm install
npm run dev
```

### Desde tu PC:
```bash
ssh -L 5173:127.0.0.1:5173 usuario@IP_VPS
```

Luego abre: `http://localhost:5173`

## Troubleshooting

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

### Verificar status
```bash
sudo systemctl status nginx
```

### Permisos
Si hay problemas de permisos:
```bash
sudo chown -R www-data:www-data /var/www/tasa-brasil
sudo chmod -R 755 /var/www/tasa-brasil
```
