# MockForge - Guia para Codex

## Que es este repo

`ai-agent-business` es el paraguas del proyecto. La unica app activa hoy es `mockforge/`.

`mockforge/` es una app Next.js enfocada en generar mockups ecommerce a partir de una foto de producto, con generacion de imagen via fal.ai, persistencia opcional/real con Supabase, checkout con Stripe y una UI publica para upload, resultados, historial y galeria.

La prioridad sigue siendo producto funcional y desplegable, no sobreingenieria.

---

## Setup rapido

```bash
cd mockforge
npm install
cp .env.example .env.local
npm run dev
```

URL local:

```bash
http://localhost:3000
```

Variables minimas:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=<tu clave>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Variables comunes segun feature:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STORAGE_PROVIDER=supabase

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_SINGLE_PACK=price_...
STRIPE_PRICE_BUNDLE=price_...

# Storage CDN opcional
BUNNY_STORAGE_API_KEY=...
BUNNY_STORAGE_ZONE=...
BUNNY_CDN_URL=...

# Observabilidad
NEXT_PUBLIC_POSTHOG_KEY=...
SENTRY_DSN=...
```

---

## Estado actual del producto

### Funciona hoy

- Upload de imagen con validaciones y hardening
- Generacion real con fal.ai
- Variantes A/B/C y variante D configurable por env
- Historial de generaciones en `/history` y detalle en `/history/[id]`
- Galeria publica en `/gallery`
- Checkout real con Stripe y sistema de creditos
- Post-generacion: upscale, variacion, batch y video
- i18n en 5 idiomas: EN, ES, FR, PT, DE
- Selector de idioma compacto en header mobile y desktop
- Tema claro/oscuro
- Health checks y endpoints admin basicos
- Persistencia de metadata en Supabase cuando esta configurado
- Storage local, Supabase Storage o Bunny CDN con fallback

### Pendiente o con caveats

- La cola de jobs (`src/lib/job-queue.ts`) sigue teniendo cache en memoria; no hay BullMQ/Inngest
- El soporte multi-region no distribuye jobs de verdad
- Algunas partes de UI siguen grandes y centralizadas, especialmente `mockup-upload-form.tsx`
- La observabilidad existe, pero no es tracing distribuido completo
- El proyecto ya no esta en modo "solo local": cualquier cambio debe considerar storage remoto, DB y checkout

---

## Arquitectura resumida

```text
Usuario sube imagen
  -> POST /api/upload
  -> save via storage-provider (local / supabase / cdn)
  -> cliente navega o consulta resultados
  -> POST /api/generate o endpoints derivados
  -> lib/image-provider.ts
  -> lib/providers/fal.ts
  -> persistencia opcional/real en DB
  -> UI muestra previews, historial, galeria o acciones post-generacion
```

Piezas importantes:

| Archivo | Rol |
|---|---|
| `mockforge/src/lib/image-provider.ts` | Capa de orquestacion del provider de imagen |
| `mockforge/src/lib/providers/fal.ts` | Integracion principal con fal.ai |
| `mockforge/src/lib/model-config.ts` | Modelos curados, variantes y mapeo de formatos |
| `mockforge/src/lib/storage-provider.ts` | Abstraccion de storage con fallback |
| `mockforge/src/lib/prompt-builder.ts` | Construccion de prompts |
| `mockforge/src/lib/presets.ts` | Presets, categorias y metadata de generacion |
| `mockforge/src/lib/db/*` | Persistencia de generaciones y jobs |
| `mockforge/src/components/mockup-upload-form.tsx` | Formulario principal del flujo |
| `mockforge/src/components/results-view.tsx` | Polling y render de resultados |
| `mockforge/src/components/site-header.tsx` | Header global, idioma y tema |
| `mockforge/src/app/api/generate/*` | Generacion base, batch, upscale, variation, video |
| `mockforge/src/app/api/checkout/route.ts` | Creacion de Checkout Session |
| `mockforge/src/app/api/stripe/webhook/route.ts` | Webhook de Stripe y creditos |

---

## Variantes de modelo

Las variantes actuales no son las del AGENTS viejo. Hoy el repo usa:

- `A` - Nano Banana 2
- `B` - GPT Image
- `C` - FLUX.2 Pro
- `D` - Modelo personalizado por env var

Revisar `mockforge/src/lib/model-config.ts` antes de cambiar naming, defaults o marketing copy.

---

## Rutas y features que existen

Paginas:

- `/`
- `/upload`
- `/results`
- `/history`
- `/history/[id]`
- `/gallery`
- `/success`
- `/auth/sign-in`

API destacada:

- `/api/upload`
- `/api/generate`
- `/api/generate/batch`
- `/api/generate/upscale`
- `/api/generate/variation`
- `/api/generate/video`
- `/api/result/[id]`
- `/api/gallery`
- `/api/credits`
- `/api/checkout`
- `/api/stripe/webhook`
- `/api/provider/health`
- `/api/admin/costs`
- `/api/admin/cleanup`

---

## Convenciones

- TypeScript estricto; evitar `any` salvo borde de SDK externo
- Componentes en `mockforge/src/components/`
- Logica de negocio en `mockforge/src/lib/`
- App Router en `mockforge/src/app/`
- Providers y storage siempre pasan por sus capas de abstraccion; no conectar servicios externos directo desde componentes
- Los errores deben propagarse con mensajes legibles
- Si tocas copy o UI principal, revisa tambien el impacto en i18n y mobile

---

## Documentacion real disponible

No asumir que existen `status.md`, `next-steps.md` o `backlog.md`: hoy no estan en este repo.

Referencias reales:

| Archivo | Contenido |
|---|---|
| `README.md` | Resumen actualizado del producto y stack |
| `mockforge/README.md` | Estado funcional, setup y endpoints |
| `mockforge/DEPLOY.md` | Guia de deploy |
| `mockforge/improvement-plan.md` | Notas y plan de mejora del proyecto |
| `CLAUDE.md` | Guia complementaria del repo |

---

## Reglas de trabajo

### Hacer

- Preferir cambios pequenos, funcionales y testeables
- Mantener `README.md` y este `AGENTS.md` alineados cuando cambie el estado real del proyecto
- Probar UI en desktop y mobile si tocas layout, header, formularios o CTAs
- Considerar fallback local cuando toques storage, auth, Stripe o Supabase

### No hacer

- No agregar auth compleja o re-arquitecturas grandes sin necesidad clara
- No asumir que el proyecto sigue siendo "solo MVP local"
- No borrar soporte existente de Stripe, Supabase, gallery o history por simplificar una tarea
- No documentar features inexistentes ni dejar instrucciones rotas en docs
- No commitear `.env.local` ni credenciales reales

---

## Notas para revisiones y cambios

- Si cambias presets, variantes o labels, revisar tambien `landing-copy.ts`, `presets.ts`, `i18n.ts` y formularios
- Si cambias header o nav, revisar version mobile y desktop
- Si cambias generacion o persistencia, revisar rutas API, DB y resultados
- Si cambias pagos, revisar tanto `checkout` como `stripe/webhook`

## gstack

Use `/browse` from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/open-gstack-browser`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`.
