# Deploy de MockForge

Guía base para dejar MockForge corriendo de forma decente en un VPS.

## Requisitos
- Node.js 20+
- npm
- variables de entorno configuradas
- reverse proxy con HTTPS

## 1. Instalar dependencias
```bash
cd mockforge
npm install
```

## 2. Variables de entorno
Crear `mockforge/.env.local`:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=tu_fal_key
FAL_MODEL=fal-ai/flux-kontext/dev
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## 3. Build
```bash
npm run build
```

## 4. Arranque simple
```bash
npm run start
```

Por defecto Next levantará en el puerto 3000 salvo que definas `PORT`.

## 5. Recomendación de producción
No lo dejes colgando con una terminal abierta como un salvaje.
Usa una de estas:

### Opción A: PM2
```bash
npm install -g pm2
cd mockforge
pm2 start npm --name mockforge -- start
pm2 save
```

### Opción B: systemd
Crear un servicio que ejecute:
```bash
/usr/bin/npm run start
```

con `WorkingDirectory` apuntando a:
```bash
/root/.openclaw/workspace/projects/ai-agent-business/mockforge
```

## 6. Reverse proxy
Exponer el puerto interno con Nginx o Caddy.

Ejemplo conceptual con Nginx:
```nginx
server {
    server_name tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luego le metes HTTPS con Let's Encrypt o usas Caddy y te ahorras parte del circo.

## 7. Checklist antes de abrirlo al mundo
- `.env.local` fuera del repo
- `FAL_KEY` cargada
- `NEXT_PUBLIC_APP_URL` apuntando a URL pública real
- build exitosa
- endpoint `/api/provider/health` respondiendo
- reverse proxy funcionando
- HTTPS activo

## 8. Siguiente nivel
Cuando MockForge deje de ser MVP de garaje:
- mover uploads a almacenamiento externo
- persistir generaciones en DB
- meter auth
- rate limiting
- cola de trabajos
- observabilidad y logs decentes
