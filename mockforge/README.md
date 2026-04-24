# MockForge

MockForge genera mockups ecommerce de calidad comercial a partir de una sola foto de producto.

## Stack
- Next.js 16 + React 19
- Tailwind CSS 4
- fal.ai (generación de imagen y video)
- Supabase (DB + Storage)
- Stripe (pagos)
- PostHog (analytics)
- Sentry (error tracking)
- Bunny CDN (opcional, assets)

## Qué hace hoy
- Recibe imagen del producto (con hardening: magic bytes + MAX 10MB + rate limit)
- Guarda en storage local, Supabase Storage o Bunny CDN
- Construye prompt según preset/categoría/formato
- Llama al provider activo y genera el mockup
- Persiste metadata en Supabase (con soft delete GDPR)
- Muestra previews reales en `/results` y galería pública
- Checkout real con Stripe + sistema de créditos
- Post-generación: upscale, variación, batch de 3 variantes, video 5s

## Variantes de modelo
- **A** · Nano Banana 2 — rápido y económico
- **B** · GPT Image 1 — edición con alta fidelidad (+ masked editing automático con rembg + OCR)
- **C** · FLUX.2 Pro — máxima calidad
- **D** · Personalizado — via env var

## Configuración

Crea `mockforge/.env.local` a partir de `.env.example`.

### Variables mínimas

```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase (persistencia real)

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STORAGE_PROVIDER=supabase
```

### Stripe (checkout)

```bash
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_SINGLE_PACK=price_...
STRIPE_PRICE_BUNDLE=price_...
```

### Opcionales

```bash
# Modelos
FAL_MODEL_A=fal-ai/nano-banana/edit
FAL_MODEL_B=fal-ai/gpt-image-1/edit-image
FAL_MODEL_C=fal-ai/flux-pro/kontext

# Analytics y observabilidad
NEXT_PUBLIC_POSTHOG_KEY=...
SENTRY_DSN=...

# API pública beta
MOCKFORGE_PUBLIC_API_ENABLED=false

# CDN (Bunny)
BUNNY_STORAGE_API_KEY=...
BUNNY_STORAGE_ZONE=...
BUNNY_CDN_URL=...

# Cost controls
COST_LIMIT_DAILY_USD=...
COST_LIMIT_MONTHLY_USD=...
```

Notas:
- `SUPABASE_SERVICE_ROLE_KEY` es solo server-side
- Si `STORAGE_PROVIDER` no es `supabase`, fallback a storage local
- Si faltan vars de Bunny, fallback a Supabase/local

## Supabase

```bash
supabase db push
```

Migraciones incluidas: `generations`, buckets + policies, índices de performance, créditos, galería pública, soft delete GDPR, hardening.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint
npm test             # unit tests
npm run test:e2e     # Playwright
```

## i18n
Soporta 5 idiomas: EN, ES, FR, PT, DE (detección automática por `Accept-Language` + override en UI).

## Endpoints clave

| Endpoint | Descripción |
|---|---|
| `POST /api/upload` | Upload con magic bytes + rate limit |
| `POST /api/generate` | Generación (rate limit + kill switch) |
| `POST /api/generate/batch` | 3 variantes en paralelo |
| `POST /api/generate/upscale` | Upscale con clarity-upscaler |
| `POST /api/generate/variation` | "Más como este" |
| `POST /api/generate/video` | Video 5s con kling-video |
| `POST /api/v1/generate` | API pública beta (Bearer token; disabled unless `MOCKFORGE_PUBLIC_API_ENABLED=true`) |
| `GET /api/result/:id` | Resultado por id |
| `GET /api/gallery` | Galería pública opt-in |
| `GET /api/credits` | Saldo de créditos |
| `POST /api/checkout` | Stripe Checkout real |
| `GET /api/provider/health` | Health del provider |
| `GET /api/admin/costs` | Dashboard interno de gasto |
| `POST /api/admin/cleanup` | Purga uploads >7 días |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:e2e
```

## Estado actual

### ✅ Funciona en producción
- Upload hardening (magic bytes, MAX 10MB, rate limit por sesión)
- Generación real (variantes A/B/C/D) con masked editing + OCR
- Stripe Checkout con webhook y sistema de créditos (free trial 3 + packs)
- Post-generación: upscale, variación, batch, video
- Historial en UI (`/history`, `/history/[id]`) y galería pública (`/gallery`)
- Analytics con PostHog + error tracking con Sentry
- Cost controls con kill switch automático
- CI/CD en GitHub Actions (lint + build + tests + e2e)
- i18n en 5 idiomas

### ⚠️ Pendientes conocidos
- **Job queue**: DB-backed con `generation_jobs`, pero cada instancia procesa sus propios jobs y mantiene cache `Map` en memoria. Suficiente para launch controlado; reemplazar por worker/queue durable antes de escala seria.
- **API pública**: `/api/v1/generate` está detrás de `MOCKFORGE_PUBLIC_API_ENABLED=true`. Mantenerla apagada para launch salvo que provisioning, límites y docs estén cerrados.
- **Operación prod**: confirmar Sentry/PostHog, alertas, backups Supabase y smoke Stripe end-to-end en el entorno final.
- **Dominio custom**: pendiente de decisión/configuración externa.

## Deploy

Ver [DEPLOY.md](../DEPLOY.md) para la guía completa (pm2/systemd, Nginx, SSL Let's Encrypt, migraciones Supabase).

Producción recomendada:
- Vercel o VPS con Node 22
- HTTPS + dominio
- `NEXT_PUBLIC_APP_URL` con URL pública real
- `STORAGE_PROVIDER=supabase` (o `bunny`) para no depender del filesystem
- Variables sensibles solo server-side
