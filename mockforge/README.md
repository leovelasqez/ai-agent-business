# MockForge

MVP para generar mockups ecommerce a partir de una foto de producto.

## Stack
- Next.js
- Tailwind CSS
- fal.ai

## Provider activo
El provider activo actual es `fal` usando:
- modelo: `fal-ai/flux-kontext/dev`

La app ya quedó preparada con una capa abstracta de provider para que luego podamos comparar fal vs Replicate sin romper el frontend.

## Variables de entorno
Copia `.env.example` a `.env.local` y completa al menos:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
FAL_MODEL=fal-ai/flux-kontext/dev
NEXT_PUBLIC_APP_URL=http://72.60.142.118:3000
```

## Desarrollo
```bash
npm install
npm run dev
```

## Health check del provider
```bash
curl http://127.0.0.1:3000/api/provider/health
```

Respuesta esperada cuando falta key:

```json
{"ok":true,"provider":"fal","configured":false}
```

Respuesta esperada cuando ya pusiste la key y reiniciaste el servidor:

```json
{"ok":true,"provider":"fal","configured":true}
```

## Endpoint principal
### `POST /api/generate`
Body esperado:

```json
{
  "preset": "clean_studio",
  "category": "skincare",
  "format": "1:1 square",
  "productName": "Vitamin C Serum",
  "sourceImageUrl": "http://72.60.142.118:3000/uploads/example.jpg"
}
```

## Flujo real actual
- upload real local a `public/uploads`
- transporte de `sourceImageUrl` en el flujo
- results conectado a `/api/generate`
- provider abstracto activo con fal.ai
- render de previews reales si el modelo devuelve imágenes

## Inputs confirmados para fal flux-kontext/dev
Según la documentación oficial consultada:
- auth: `FAL_KEY`
- modelo: `fal-ai/flux-kontext/dev`
- input de imagen: `image_url`
- input de prompt: `prompt`
- output principal: `images[].url`

## Checklist para primera prueba real end-to-end
1. Abrir `mockforge/.env.local`
2. Pegar `FAL_KEY`
3. Confirmar que `NEXT_PUBLIC_APP_URL` apunte a una URL pública accesible por fal
4. Reiniciar `npm run dev`
5. Abrir `/upload`
6. Subir una imagen de producto
7. Esperar la llamada automática en `/results`
8. Si falla, revisar el bloque de error mostrado en la UI

## Nota importante
La integración actual usa `fal-ai/flux-kontext/dev` como primer modelo activo porque acepta `image_url` y encaja mejor con el flujo foto de producto → edición guiada por prompt.
