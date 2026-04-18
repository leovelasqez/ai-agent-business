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

### [x] 12. Refactor `mockup-upload-form.tsx`
**Archivo:** `src/components/mockup-upload-form.tsx`
- 13 `useState` → `useReducer` o context
- Lógica de upload duplicada (línea 124 y callback FilePicker)
- Memoizar `VARIANTS` (línea 33), recreado en cada render
- Auto-clear de errores tras N segundos

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

### [x] 15. Observabilidad
- Logging estructurado con correlation IDs por request
- Sentry para errores cliente y servidor
- Métricas de fallback Supabase→local (hoy solo `console.warn` en `storage-provider.ts:169`)
- Health check real en `/api/provider/health` (testar conectividad FAL, no solo `FAL_KEY` exists)

### [x] 16. Job queue
- Generación síncrona bloquea respuesta HTTP
- Si fal.ai tarda >30s en Vercel → timeout
- Opciones: BullMQ + Redis, Inngest, AWS SQS
- Cambia el contrato de `/api/generate` (devolver `jobId`, polling/SSE)

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

### [ ] 19. Onboarding y ejemplos
- Landing con ejemplos "antes / después" reales generados con MockForge (no placeholders)
- Tour guiado en primer uso (upload → preset → resultado)
- Galería pública opt-in de generaciones destacadas

### [ ] 20. Presets extendidos
**Archivo:** `src/lib/presets.ts`, `src/lib/prompt-builder.ts`
- Presets adicionales: `holiday_seasonal`, `flat_lay`, `minimal_white`, `outdoor_natural`
- Parametrización de fondo (color, textura) sin requerir prompt custom
- Controles avanzados opcionales: ángulo de cámara, hora del día, iluminación

### [ ] 21. Edición post-generación
- Inpainting sobre resultado (marcar zona y regenerar)
- Variaciones a partir de un resultado existente ("más como este")
- Upscale con `fal-ai/clarity-upscaler` o equivalente

### [ ] 22. Planes y créditos
**Archivo:** `src/app/api/checkout/route.ts`, nuevo `src/lib/credits.ts`
- Sistema de créditos (1 generación = N créditos según variante)
- Tiers: free trial (3 créditos), pack pagado, suscripción mensual
- Dashboard de saldo y consumo por usuario

### [ ] 23. Analytics de producto
- Eventos clave: upload, generate, rate, download, checkout_start, checkout_complete
- Funnel de conversión upload → pago
- PostHog o Plausible (evitar GA4 por complejidad y privacidad)

---

## 🟣 Fase 6 — Diferenciación técnica

### [ ] 24. Preservación de producto con masking automático
- Extender masked editing (item 7) a variantes A y B cuando detecte texto en empaque
- OCR con `fal-ai/any-llm/vision` para decidir si aplicar mask
- Comparar calidad con/sin máscara por variante (A/B interno)

### [ ] 25. Batch de generación
- Un upload → las 3 variantes en paralelo por default (reduce fricción de elegir)
- Grilla comparativa con elección final y rating
- Precio diferenciado por batch vs individual

### [ ] 26. Video corto (MP4/GIF)
- Pan/zoom del mockup generado con `fal-ai/kling-video` o similar
- Entregable 3-5s para redes sociales
- Nuevo tipo de output en DB (`kind: 'image' | 'video'`)

### [ ] 27. API pública
- Endpoint `/api/v1/generate` con API keys por usuario
- Rate limit por key, facturación por uso
- Docs OpenAPI generadas

---

## ⚫ Fase 7 — Escalamiento

### [ ] 28. CDN para assets
- Migrar `public/uploads/` a CDN (Cloudflare R2 + Workers o Bunny)
- Invalidación por TTL
- Reduce carga del VPS y mejora latencia global

### [ ] 29. Multi-región para generación
- Queue distribuida por región (item 16) con workers cercanos al usuario
- Fallback entre regiones si una saturada
- Medir p95 de latencia por región

### [ ] 30. Cost controls
- Dashboard interno de gasto diario en fal.ai por variante
- Alertas cuando gasto/día > umbral
- Kill switch automático si excede presupuesto mensual

### [ ] 31. DB hardening
- Read replicas Supabase para `/api/result/[id]` y historial
- Backups verificados (restore test mensual)
- Soft delete con retención configurable (GDPR)

### [ ] 32. i18n completa
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
