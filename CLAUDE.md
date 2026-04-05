# MockForge — Guía para Claude Code

## Qué es este repo

`ai-agent-business` es el paraguas del proyecto. La única app activa es `mockforge/` — una app Next.js que genera mockups de producto con calidad comercial usando modelos de imagen de fal.ai.

El objetivo es MVP funcional y desplegable, no ingeniería sobrediseñada.

---

## Setup rápido

```bash
cd mockforge
npm install
cp .env.example .env.local   # completar FAL_KEY
npm run dev                  # http://localhost:3000
```

Variables mínimas necesarias:

```
IMAGE_PROVIDER=fal
FAL_KEY=<tu clave de fal.ai>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Variables opcionales para controlar modelos:

```
FAL_MODEL_A=fal-ai/flux-kontext/dev       # variante A (default)
FAL_MODEL_B=fal-ai/flux-pro/kontext       # variante B (default)
FAL_MODEL_C=fal-ai/gpt-image-1/edit-image # variante C (default)
```

---

## Arquitectura en una página

```
Usuario sube imagen
    → POST /api/upload          → guarda en public/uploads/, devuelve /uploads/<uuid>.ext
    → cliente navega a /results
    → POST /api/generate        → llama a lib/image-provider.ts → lib/providers/fal.ts
    → fal.ai devuelve URL       → se descarga y guarda en public/uploads/
    → cliente muestra resultado
```

Archivos clave:

| Archivo | Rol |
|---|---|
| `src/lib/image-provider.ts` | Abstracción de provider; decide qué provider usar según `IMAGE_PROVIDER` |
| `src/lib/providers/fal.ts` | Toda la lógica de fal.ai: resolución de URLs, variantes A/B/C, guardado local |
| `src/lib/model-config.ts` | Config de modelos por preset y variante; mapeo de formatos a parámetros de fal |
| `src/lib/prompt-builder.ts` | Construye el prompt a partir de preset + metadatos |
| `src/lib/presets.ts` | Lista canónica de presets: `clean_studio`, `lifestyle_scene`, `ad_creative` |
| `src/lib/file-storage.ts` | Utilidades para guardar imágenes localmente (desde URL o base64) |
| `src/components/mockup-upload-form.tsx` | Formulario principal: subida, selector de preset, variante y envío |
| `src/components/results-view.tsx` | Vista de resultados: polling de generación, display de previews |
| `src/app/api/upload/route.ts` | Endpoint de upload |
| `src/app/api/generate/route.ts` | Endpoint de generación |

---

## Variantes de modelo

El formulario expone tres variantes que el usuario puede elegir:

- **A · FLUX Kontext Dev** — rápido y barato, más propenso a deformar el producto
- **B · FLUX Kontext Pro** — más costoso, mejor preservación del producto
- **C · GPT Image 1 via fal** — orientado a edición con alta fidelidad al input

### Problema conocido con variante C

GPT Image 1 tiende a distorsionar el texto del empaque del producto a pesar de las instrucciones en el prompt. La solución correcta es implementar **masked editing**: generar una máscara automática (usando `fal-ai/imageutils/rembg` para aislar el producto) y pasarla al endpoint de edición para que solo el fondo sea modificable. Esto está pendiente.

---

## Estado actual

**Funciona:**
- Upload local de imagen
- Generación real con fal.ai (variantes A, B, C)
- Display de resultados con descarga
- Health check en `/api/provider/health`

**Pendiente / incompleto:**
- Checkout es placeholder (no procesa pagos reales)
- No hay persistencia de generaciones (sin DB)
- Masked editing para variante C
- Deploy estable en VPS (siguiente prioridad)
- Soporte para webviews de Telegram es frágil; hay un aviso en el formulario

---

## Convenciones

- TypeScript estricto, sin `any` salvo donde el SDK externo lo imponga
- Componentes en `src/components/`, lógica de negocio en `src/lib/`
- Imágenes generadas se guardan en `public/uploads/` y se sirven estáticamente
- Los providers se abstraen detrás de `image-provider.ts`; al agregar un nuevo provider, solo se toca ese archivo y se crea `src/lib/providers/<nombre>.ts`
- Manejo de errores: propagar con mensajes legibles, no silenciar

---

## Docs de referencia

| Archivo | Contenido |
|---|---|
| `status.md` | Estado actual del proyecto |
| `next-steps.md` | Prioridades y preguntas abiertas |
| `decisions.md` | Decisiones de arquitectura y por qué se tomaron |
| `DEPLOY.md` | Guía para deploy en VPS |
| `architecture-mockforge-mvp.md` | Diagrama y descripción de la arquitectura |
| `backlog.md` | Ideas y features pendientes sin prioridad asignada |

---

## Reglas de trabajo

**Hacer:**
- Mantener `status.md` y `next-steps.md` actualizados si cambias el estado del proyecto
- Preferir soluciones simples que dejen el MVP corriendo hoy sobre arquitecturas elegantes
- Probar en navegador normal antes de preocuparse por webviews

**No hacer:**
- No agregar auth compleja, multi-tenancy ni DB hasta que haya usuarios reales
- No reescribir componentes por estética si funcionan
- No saltear la actualización de docs al cambiar arquitectura
- No commitear `.env.local` ni claves reales

## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /open-gstack-browser, /qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso, /autoplan, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.