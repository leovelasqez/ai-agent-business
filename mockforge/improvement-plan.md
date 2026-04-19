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

### [x] 9. Auth real — Supabase magic link
- Hecho: cookie `mf_session` asocia generaciones a sesión anónima
- Hecho: auth real con Supabase Auth (magic link por email). `POST /api/auth/signin` envía enlace; `GET /api/auth/callback` canjea el code; `POST /api/auth/signout` cierra sesión. Middleware refresca el token en cada request. `generate/route.ts` usa el user ID verificado de Supabase si disponible, cookie anónima como fallback.

---

## 🟡 Fase 3 — Calidad de código

### [x] 10. Eliminar duplicación
- Variant labels duplicados en 3 lugares:
  - `src/lib/providers/fal.ts:192-199`
  - `src/components/results-view.tsx:41-46`
  - `src/components/mockup-upload-form.tsx`
  - **Acción:** centralizar en `src/lib/model-config.ts`
- 3 funciones `mapFormatTo*` en `src/lib/model-config.ts` con 90% lógica idéntica → consolidar en una con tabla de conversión

### [x] 11. Refactor `results-view.tsx` (662 líneas)
**Archivo:** `src/components/results-view.tsx`
- 3 `useEffect` paralelos para compare mode → un solo handler con `Promise.allSettled`
- Falta `AbortController`: cambiar params durante fetch deja peticiones huérfanas
- Type casting inseguro: `json.data as unknown` sin narrowing (línea 367)

### [~] 12. Refactor `mockup-upload-form.tsx` — PARCIAL
**Archivo:** `src/components/mockup-upload-form.tsx`
- Hecho: deduplicación de variants/format helpers, memoización de `VARIANTS`, auto-clear de errores
- **Pendiente:** el componente sigue con **18 `useState`** (571 líneas). Migrar a `useReducer` o context para reducir re-renders y facilitar testing.

### [x] 13. Error handling consistente
- `friendlyError()` duplicado entre cliente (`results-view.tsx`) y `src/app/api/generate/route.ts:80`
- `/api/generate:99` filtra `details` que pueden exponer internals
- Centralizar mapeo de errores FAL → mensajes de usuario

---

## 🟢 Fase 4 — Operación y escala

### [x] 14. CI/CD
- No hay workflows de GitHub Actions
- Mínimo: `lint` + `build` + `playwright` en cada PR
- Idealmente: deploy automático a staging en merge a `main`

### [~] 15. Observabilidad — PARCIAL
- Hecho: logging estructurado con request IDs, Sentry cliente+server, health check real, métricas de fallback de storage
- **Pendiente:** distributed tracing (OpenTelemetry / Sentry Performance) para correlacionar upload → generate → provider → DB en una sola traza.

### [x] 16. Job queue — Supabase persistente
- Hecho: contrato `/api/generate` devuelve `jobId` y hay endpoint `/api/jobs/[id]` para polling
- Hecho: `src/lib/job-queue.ts` persiste estado en Supabase (`generation_jobs` table). Memory Map como caché de jobs activos; DB como fallback para otras instancias y reinicios. Jobs `processing` > 10 min se recuperan automáticamente.

### [x] 17. Tests
- Hoy: 3 unit tests (file-storage, model-config, storage-provider) + 1 Playwright smoke
- Faltan:
  - Tests de API routes (upload, generate, rate)
  - Tests de componentes críticos (form, results-view)
  - Smoke test E2E completo (upload → generate → display)

### [x] 18. Deploy a VPS
**Archivo:** `DEPLOY.md`
- Documentar: pm2 o systemd, Nginx reverse proxy, SSL Let's Encrypt
- Migraciones Supabase en prod
- Creación inicial de buckets Supabase Storage
- Variables de entorno requeridas vs opcionales

---

## 🔵 Fase 5 — Producto y retención

### [x] 19. Onboarding y ejemplos
- Landing con ejemplos "antes / después" reales generados con MockForge (no placeholders)
- Tour guiado en primer uso (upload → preset → resultado)
- Galería pública opt-in de generaciones destacadas

### [x] 20. Presets extendidos
**Archivo:** `src/lib/presets.ts`, `src/lib/prompt-builder.ts`
- Presets adicionales: `holiday_seasonal`, `flat_lay`, `minimal_white`, `outdoor_natural`
- Parametrización de fondo (color, textura) sin requerir prompt custom
- Controles avanzados opcionales: ángulo de cámara, hora del día, iluminación

### [x] 21. Edición post-generación
- Inpainting sobre resultado (marcar zona y regenerar)
- Variaciones a partir de un resultado existente ("más como este")
- Upscale con `fal-ai/clarity-upscaler` o equivalente

### [x] 22. Planes y créditos
**Archivo:** `src/app/api/checkout/route.ts`, nuevo `src/lib/credits.ts`
- Sistema de créditos (1 generación = N créditos según variante)
- Tiers: free trial (3 créditos), pack pagado, suscripción mensual
- Dashboard de saldo y consumo por usuario

### [x] 23. Analytics de producto
- Eventos clave: upload, generate, rate, download, checkout_start, checkout_complete
- Funnel de conversión upload → pago
- PostHog o Plausible (evitar GA4 por complejidad y privacidad)

---

## 🟣 Fase 6 — Diferenciación técnica

### [x] 24. Preservación de producto con masking automático
- Extender masked editing (item 7) a variantes A y B cuando detecte texto en empaque
- OCR con `fal-ai/any-llm/vision` para decidir si aplicar mask
- Comparar calidad con/sin máscara por variante (A/B interno)

### [x] 25. Batch de generación
- Un upload → las 3 variantes en paralelo por default (reduce fricción de elegir)
- Grilla comparativa con elección final y rating
- Precio diferenciado por batch vs individual

### [x] 26. Video corto (MP4/GIF)
- Pan/zoom del mockup generado con `fal-ai/kling-video` o similar
- Entregable 3-5s para redes sociales
- Nuevo tipo de output en DB (`kind: 'image' | 'video'`)

### [x] 27. API pública
- Endpoint `/api/v1/generate` con API keys por usuario
- Rate limit por key, facturación por uso
- Docs OpenAPI generadas

---

## ⚫ Fase 7 — Escalamiento

### [x] 28. CDN para assets
- Migrar `public/uploads/` a CDN (Cloudflare R2 + Workers o Bunny)
- Invalidación por TTL
- Reduce carga del VPS y mejora latencia global

### [~] 29. Multi-región para generación — PARCIAL
- Hecho: detección de región del usuario (`src/lib/region.ts`) y medición de latencia por región
- **Pendiente:** distribuir jobs a workers por región (bloqueado por #16) y fallback entre regiones saturadas. Hoy toda la generación se ejecuta en la instancia que recibe el request.

### [x] 30. Cost controls
- Dashboard interno de gasto diario en fal.ai por variante
- Alertas cuando gasto/día > umbral
- Kill switch automático si excede presupuesto mensual

### [x] 31. DB hardening
- Read replicas Supabase para `/api/result/[id]` y historial
- Backups verificados (restore test mensual)
- Soft delete con retención configurable (GDPR)

### [x] 32. i18n completa
- Extender EN/ES actual a FR, PT, DE
- Detección por `Accept-Language` + override manual
- Prompts localizados si afectan calidad del output

---

## Recomendación de orden

### Fases 1-4 (completadas)
1. **#1, #2, #3** — vector de abuso real con costo monetario
2. **#6** — sin checkout no hay negocio
3. **#7** — resuelve bug conocido que afecta calidad percibida
4. Refactor (Fase 3) puede esperar

### Fases 5-7 (siguientes)
1. **#23** primero — sin analytics no se sabe qué optimizar
2. **#22** — convertir uso en revenue antes de invertir en features
3. **#19, #20** — reducir fricción y expandir casos de uso
4. **#24, #25** — diferenciación de calidad vs competidores genéricos
5. Fase 7 solo cuando haya señal clara de escala (tráfico sostenido, múltiples regiones)

---

## Notas

- Mantener `status.md` y `next-steps.md` actualizados al completar items
- No commitear `.env.local` ni claves reales
- Probar en navegador normal antes de webviews (Telegram/Instagram)

---

## 🔄 Pendientes reales (verificado 2026-04-19)

Items marcados `[x]` durante las fases previas pero que en código siguen siendo stubs o quedaron parciales. Leyenda: `[ ]` pendiente · `[~]` parcial · `[x]` completo verificado.

### Críticos
- [x] **#16 Job queue persistente** — Supabase-backed (`generation_jobs` table) con memory cache. Jobs persisten entre reinicios. Multi-instancia: cada instancia procesa sus propios jobs, DB es fuente de verdad para polling.

### Alta prioridad
- [x] **#9 Auth real** — Supabase Auth magic link implementado. Middleware refresca sesión; `generate` usa user ID verificado. Fallback a cookie anónima si Supabase no está configurado.
- [~] **#15 Distributed tracing** — añadir OpenTelemetry o Sentry Performance para traza upload→generate→provider→DB.

### Media prioridad
- [~] **#29 Distribución multi-región** — depende de #16.
- [~] **#12 Refactor form** — migrar `mockup-upload-form.tsx` (18 `useState`, 571 líneas) a `useReducer`.

A medida que cada item quede cerrado, cambiar `[~]` → `[x]` tanto en la sección original como aquí, y añadir una línea en el commit: `closes improvement-plan #<n>`.
