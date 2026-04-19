# AI Agent Business

Proyecto base para construir productos operados por IA con foco en velocidad de ejecución, marketing automatizable y monetización.

## Proyecto activo: MockForge

**MockForge** es el primer MVP del portfolio: una app para generar mockups visuales de ecommerce a partir de una foto de producto.

### Qué ya existe
- app Next.js 16 + React 19 end-to-end
- upload hardening (magic bytes, MAX 10MB, rate limiting)
- generación con fal.ai (4 variantes: Nano Banana 2, GPT Image, FLUX.2 Pro, custom)
- masked editing automático con rembg + OCR (preserva texto de empaques)
- post-generación: upscale, variación, batch paralelo, video 5s
- Stripe Checkout + sistema de créditos (free trial + packs)
- galería pública, historial, API pública con Bearer tokens
- analytics PostHog + error tracking Sentry + cost controls con kill switch
- i18n 5 idiomas (EN/ES/FR/PT/DE)
- CI/CD en GitHub Actions

### Estado actual
MVP en producción. 28/32 items del `improvement-plan.md` implementados realmente. Pendientes conocidos: job queue distribuida (hoy `Map` en memoria), auth de usuario real, distributed tracing.

## Estructura del repo
- `mockforge/` → app principal
- `mvp-mockups-ecommerce.md` → definición del MVP
- `architecture-mockforge-mvp.md` → arquitectura técnica
- `status.md` → estado resumido
- `decisions.md` → decisiones tomadas
- `next-steps.md` → siguientes pasos operativos
- `backlog.md` → pendientes
- `DEPLOY.md` → guía base de deploy
- `CONTRIBUTING.md` → reglas mínimas para colaborar
- `CLAUDE-CODE.md` → handoff rápido para otro agente

## Cómo correr MockForge
```bash
cd mockforge
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno importantes
Dentro de `mockforge/.env.local` las mínimas para el MVP son:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Los modelos y proveedores alternos quedan como configuración opcional en `mockforge/.env.example`.

## Scripts útiles
```bash
cd mockforge
npm run dev
npm run build
npm run start
npm run lint
npm run test:file-storage
```

## Seguridad básica
- no subir `.env*`
- no subir llaves, tokens o credenciales
- no commitear uploads generados localmente

## Si llega otro agente
El punto de entrada recomendado es:
1. `CONTRIBUTING.md`
2. `CLAUDE-CODE.md`
3. `status.md`
4. `next-steps.md`

## Siguiente jugada recomendada
1. migrar job queue de `Map` en memoria a BullMQ/Inngest (jobs se pierden al reiniciar)
2. auth real con NextAuth/Clerk si la app se vuelve pública
3. validación con usuarios y métricas de conversión en PostHog
4. distributed tracing para debug en producción
