# MockForge

MockForge genera mockups ecommerce a partir de una sola foto de producto.

## Stack
- Next.js 16
- React 19
- Tailwind CSS 4
- fal.ai

## Qué hace hoy
- recibe una imagen del producto
- la guarda localmente
- construye un prompt según preset/categoría/formato
- llama al provider activo
- muestra previews reales en `/results`

## Provider activo
- `fal`
- modelo actual: `fal-ai/flux-kontext/dev`

## Configuración
Crea `mockforge/.env.local` a partir de `.env.example`.

Variables mínimas para correr el MVP actual:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Opcionalmente puedes fijar modelos específicos:

```bash
FAL_MODEL=fal-ai/flux-kontext/dev
FAL_MODEL_A=fal-ai/flux-kontext/dev
FAL_MODEL_B=fal-ai/flux-pro/kontext
FAL_MODEL_C=fal-ai/gpt-image-1/edit-image
REPLICATE_API_TOKEN=...
REPLICATE_MODEL=black-forest-labs/flux-kontext-dev
```

Si pruebas desde un VPS o un dominio, cambia `NEXT_PUBLIC_APP_URL` por una URL pública real.

## Desarrollo local
```bash
npm install
npm run dev
```

## Endpoints útiles
### Health del provider
```bash
curl http://127.0.0.1:3000/api/provider/health
```

### Debug de upload
- UI: `/debug/upload`
- endpoint: `POST /api/debug/upload`

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:file-storage
```

## Estado actual
La app ya funciona end-to-end cuando recibe una imagen válida. El principal problema detectado no fue backend sino algunos navegadores embebidos que rompen el file picker.

## Deploy
### Opción rápida
```bash
npm run build
npm run start
```

### Recomendado para producción
- correr con PM2 o systemd
- exponer detrás de Nginx o Caddy
- usar dominio + HTTPS
- guardar `FAL_KEY` solo en variables de entorno del servidor

## Pendientes obvios
- checkout real
- persistencia/estado de generaciones
- auth si se vuelve pública
- cola de jobs si el tráfico sube
