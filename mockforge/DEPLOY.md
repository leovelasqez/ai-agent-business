# MockForge deploy a VPS

## Stack recomendada
- Node 22
- npm ci
- pm2 o systemd para proceso persistente
- Nginx como reverse proxy
- SSL con Let's Encrypt

## Variables de entorno
### Requeridas
- `IMAGE_PROVIDER=fal`
- `FAL_KEY`

### Opcionales pero recomendadas
- `STORAGE_PROVIDER=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`

## Build
```bash
npm ci
npm run build
```

## Correr con pm2
```bash
pm2 start npm --name mockforge -- start
pm2 save
pm2 startup
```

## Correr con systemd
```ini
[Unit]
Description=MockForge
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/mockforge
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start -- --hostname 0.0.0.0 --port 3000
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

## Nginx reverse proxy
```nginx
server {
  server_name mockforge.example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

## SSL
```bash
sudo certbot --nginx -d mockforge.example.com
```

## Supabase en producción
1. Ejecutar migraciones en Supabase.
2. Crear buckets `mockforge-inputs` y `mockforge-outputs`.
3. Configurar lifecycle policy para limpiar archivos viejos.

## Health check
- Endpoint: `/api/provider/health`
- Incluye estado de provider, storage, sentry y métricas básicas.

## Queue
- Endpoint síncrono actual: `/api/generate`
- Modo async: enviar `{ "async": true }` y luego poll a `/api/jobs/:id`

## Notas
- Si usas Vercel, el job queue en memoria no sirve como cola durable. Para escala real, migra a Redis/Inngest/SQS.
- Antes de abrir tráfico real, valida `npm run lint`, `npm run test`, `npm run test:health`, `npm run test:queue` y `npm run build`.
