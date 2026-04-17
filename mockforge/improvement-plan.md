# MockForge — Plan de mejoras

Plan priorizado para ejecutar a lo largo de varias sesiones. Cada item incluye archivos relevantes y notas de implementación. Marca `[x]` cuando completes.

---

## 🔴 Fase 1 — Crítico (seguridad + estabilidad)

### [x] 1. Hardening del upload
**Archivo:** `src/app/api/upload/route.ts`
- Añadir constante `MAX_FILE_SIZE` (sugerido 10 MB) — actualmente sin límite superior, vector DoS / abuso de disco
- Validar magic bytes del archivo, no solo el `file.type` (clientside falsificable)
- Rate limiting por IP (middleware Next.js + Upstash Redis o solución similar)

### [x] 2. Limpieza de `public/uploads/`
**Archivo:** `src/lib/file-storage.ts`, `src/lib/storage-provider.ts`
- Sin TTL ni purga → llena disco. Implementar:
  - Cron job (Vercel Cron o systemd timer) que borre archivos > 7 días
  - Mismo problema en bucket Supabase Storage (configurar lifecycle policy)

### [x] 3. Rate limiting en `/api/generate`
**Archivo:** `src/app/api/generate/route.ts`
- Cada generación cuesta dinero a fal.ai → vector de abuso real
- Token bucket por IP + límite global diario (kill switch)
- Considerar también `/api/rate` (manipulable hoy)

### [x] 4. Índices en Supabase
**Archivo:** `src/lib/db/generations.ts`, `supabase/migrations/`
- Crear migración con índices mínimos:
  - `created_at DESC`
  - `(preset, variant)`
  - `user_id` cuando exista auth

### [x] 5. Validar `sourceImageUrl`
**Archivo:** `src/lib/image-provider.ts:29`, `src/lib/providers/fal.ts:47-54`
- Hoy cualquier URL llega a `fal.ts` antes de validarse
- Whitelist de orígenes (mismo host, dominios fal/supabase storage conocidos)
- Reforzar path traversal check existente

---

## 🟠 Fase 2 — Funcionalidad faltante

### [x] 6. Checkout real
**Archivo:** `src/app/api/checkout/route.ts`
- Hoy retorna hardcoded `/success`
- Integrar Stripe Checkout + webhook (`/api/stripe/webhook`) para confirmar pago antes de habilitar generación
- Env vars `STRIPE_SECRET_KEY` ya esperadas

### [x] 7. Masked editing variante B (GPT Image 1)
**Pendiente documentado en CLAUDE.md**
- Pipeline: `fal-ai/imageutils/rembg` → máscara automática del producto → endpoint `edit` con `mask_url`
- Resuelve bug conocido de deformación de texto del empaque
- Tocar `src/lib/providers/fal.ts` (variante C en `buildFalInput`)

### [x] 8. Historial en UI
**Archivos:** `src/app/history/`, `src/components/history-list.tsx`
- Schema DB y endpoint `/api/result/[id]` existen
- Faltan páginas/listado completos en UI
- Considerar paginación (hoy hardcoded `limit=30` en `getRecentGenerations`)

### [x] 9. Sesiones anónimas (auth mínima)
- Sin auth: ratings (`/api/rate`), resultados (`/api/result/[id]`) y generación son públicos/manipulables
- Opciones: NextAuth con magic link, Clerk si se monetiza
- Asociar generaciones a `user_id` en DB

---

## 🟡 Fase 3 — Calidad de código

### [ ] 10. Eliminar duplicación
- Variant labels duplicados en 3 lugares:
  - `src/lib/providers/fal.ts:192-199`
  - `src/components/results-view.tsx:41-46`
  - `src/components/mockup-upload-form.tsx`
  - **Acción:** centralizar en `src/lib/model-config.ts`
- 3 funciones `mapFormatTo*` en `src/lib/model-config.ts` con 90% lógica idéntica → consolidar en una con tabla de conversión

### [ ] 11. Refactor `results-view.tsx` (662 líneas)
**Archivo:** `src/components/results-view.tsx`
- 3 `useEffect` paralelos para compare mode → un solo handler con `Promise.allSettled`
- Falta `AbortController`: cambiar params durante fetch deja peticiones huérfanas
- Type casting inseguro: `json.data as unknown` sin narrowing (línea 367)

### [ ] 12. Refactor `mockup-upload-form.tsx`
**Archivo:** `src/components/mockup-upload-form.tsx`
- 13 `useState` → `useReducer` o context
- Lógica de upload duplicada (línea 124 y callback FilePicker)
- Memoizar `VARIANTS` (línea 33), recreado en cada render
- Auto-clear de errores tras N segundos

### [ ] 13. Error handling consistente
- `friendlyError()` duplicado entre cliente (`results-view.tsx`) y `src/app/api/generate/route.ts:80`
- `/api/generate:99` filtra `details` que pueden exponer internals
- Centralizar mapeo de errores FAL → mensajes de usuario

---

## 🟢 Fase 4 — Operación y escala

### [ ] 14. CI/CD
- No hay workflows de GitHub Actions
- Mínimo: `lint` + `build` + `playwright` en cada PR
- Idealmente: deploy automático a staging en merge a `main`

### [ ] 15. Observabilidad
- Logging estructurado con correlation IDs por request
- Sentry para errores cliente y servidor
- Métricas de fallback Supabase→local (hoy solo `console.warn` en `storage-provider.ts:169`)
- Health check real en `/api/provider/health` (testar conectividad FAL, no solo `FAL_KEY` exists)

### [ ] 16. Job queue
- Generación síncrona bloquea respuesta HTTP
- Si fal.ai tarda >30s en Vercel → timeout
- Opciones: BullMQ + Redis, Inngest, AWS SQS
- Cambia el contrato de `/api/generate` (devolver `jobId`, polling/SSE)

### [ ] 17. Tests
- Hoy: 3 unit tests (file-storage, model-config, storage-provider) + 1 Playwright smoke
- Faltan:
  - Tests de API routes (upload, generate, rate)
  - Tests de componentes críticos (form, results-view)
  - Smoke test E2E completo (upload → generate → display)

### [ ] 18. Deploy a VPS
**Archivo:** `DEPLOY.md`
- Documentar: pm2 o systemd, Nginx reverse proxy, SSL Let's Encrypt
- Migraciones Supabase en prod
- Creación inicial de buckets Supabase Storage
- Variables de entorno requeridas vs opcionales

---

## Recomendación de orden

1. **#1, #2, #3** — vector de abuso real con costo monetario
2. **#6** — sin checkout no hay negocio
3. **#7** — resuelve bug conocido que afecta calidad percibida
4. Refactor (Fase 3) puede esperar

---

## Notas

- Mantener `status.md` y `next-steps.md` actualizados al completar items
- No commitear `.env.local` ni claves reales
- Probar en navegador normal antes de webviews (Telegram/Instagram)
