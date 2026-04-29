# Launch Plan

Estado actual al 2026-04-26:
- Código funcional de launch desplegado en Vercel (`44cc681`) y revalidado localmente con lint/tests/build/e2e el 2026-04-26.
- Producción sana para provider/storage: `fal` reachable y Supabase Storage ready. Health check 2026-04-26 OK.
- Launch público general todavía NO: faltan Stripe real, Sentry/PostHog, backups/PITR Supabase y smoke final.
- API pública `/api/v1/generate` queda fuera del launch: beta interna deshabilitada por defecto.
- Repo local tiene cambios sin commit relacionados con operación/Sentry/créditos/queue; no abrir tráfico hasta revisar/commitear o descartar esos cambios.

Checklist operativo para llevar MockForge a lanzamiento público general.

Estado sugerido:
- `[ ]` pendiente
- `[~]` en progreso
- `[x]` completado
- `[!]` bloqueado

## 1. Go/No-Go

No abrir tráfico público general hasta completar todos los checks de la sección 2 y 3.

## 2. Bloqueadores Previos Al Launch

### 2.1 Flujo base de uploads ✅

- [x] Corregir el serving de assets locales/fallback que hoy apuntan a `/api/uploads/:file` sin route handler real.
- [x] Validar que una imagen subida se pueda:
  - [x] previsualizar en `/upload`
  - [x] consumir en `/results`
  - [x] reutilizar en variaciones, upscale y video
- [x] Confirmar que el fallback local funciona aunque falle Supabase Storage o Bunny.
- [x] Añadir test que cubra el path real devuelto por `saveInputUpload`.

Definition of done:
- La app muestra correctamente la imagen origen tanto en storage remoto como en fallback local.
- No quedan paths internos rotos en UI ni en endpoints de generación.

### 2.2 Créditos y cobros ✅

- [x] Mover la deducción de créditos para que no ocurra antes de validar configuración mínima del provider.
- [x] Asegurar que no se pierdan créditos cuando la generación falla.
- [x] Definir comportamiento explícito para batch parcial:
  - [x] cobro upfront + refund de variantes fallidas
- [x] Aplicar la misma regla a:
  - [x] `/api/generate`
  - [x] `/api/generate/batch`
  - [x] `/api/generate/variation`
  - [x] `/api/generate/upscale`
  - [x] `/api/generate/video`
- [x] Añadir tests de no-cobro / refund en fallo de provider.
- [x] Verificar con Stripe webhook que una compra no duplica créditos.

Definition of done:
- Ningún usuario pierde créditos por errores internos, mala configuración o fallos del provider.

### 2.3 Release readiness local ✅ / CI GitHub pendiente

- [x] Dejar `npm run lint` en verde.
- [x] Corregir el error actual de React Hooks en `onboarding-tour.tsx`.
- [x] Resolver o aceptar explícitamente los warnings de hooks restantes.
- [x] Hacer que `npm run build` sea reproducible localmente y en Vercel.
- [x] Decidir estrategia de fuentes para launch:
  - [ ] self-host
  - [x] fallback local
  - [ ] dependencia externa aceptada conscientemente
  → Estado actual: fallback local aceptado para launch. Self-host queda como mejora futura si hace falta.
- [x] Arreglar E2E para que levanten la app localmente con `webServer`.
- [x] Configurar `playwright.config.ts` con `webServer` o equivalente.
- [x] Vercel como gate de producción: build automático en cada push a `main`. Si falla, no deploya.
- GitHub Actions CI movido a sección 7 (post-launch). No es necesario con Vercel validando build + deploy automáticamente.

Definition of done:
- `npm run lint` ✅
- `npm test` ✅
- `npm run build` ✅
- `npm run test:e2e` ✅
- Vercel deploy automático en push a `main` ✅

### 2.4 Endpoints internos expuestos ✅

- [x] Cambiar `/api/admin/costs` a modo fail-closed si falta `ADMIN_SECRET`.
- [x] Verificar que `/api/admin/cleanup` requiere secreto en todos los entornos públicos.
- [x] Revisar si `/api/debug/upload` y `/debug/upload` deben quedar accesibles en producción.
- [x] Si no deben existir públicamente:
  - [x] deshabilitarlos en producción (404 sin DEBUG_UPLOAD_SECRET)
  - [x] o protegerlos por secreto fuerte
- [x] Revisar exposición de `/api/provider/health` y decidir cuánta información debe devolver públicamente.

Definition of done:
- Ningún endpoint interno o de diagnóstico expone información sensible o capacidad operativa a usuarios no autorizados.

---

**Sección 2 completa.** Todos los bloqueadores funcionales cerrados. Vercel actúa como gate de producción con build + deploy automático.

## 3. Requisitos Mínimos De Launch Público

### 3.1 Infra y configuración

- [x] Definir entorno de producción final:
  - [x] Vercel (conectado a `leovelasqez/ai-agent-business`, branch `main`)
- [x] Configurar `NEXT_PUBLIC_APP_URL` con dominio final real.
  → `https://mockforge-gray.vercel.app` (actualizar cuando haya dominio custom)
- [x] Configurar `IMAGE_PROVIDER=fal`.
- [x] Configurar `FAL_KEY`.
- [x] Configurar `SESSION_SECRET` explícito.
- [x] Configurar `STORAGE_PROVIDER` para producción:
  - [x] `supabase`
- [x] Evitar depender del filesystem local como backend principal en producción.
- [x] Confirmar buckets y permisos de storage.
- [x] Confirmar lifecycle/cleanup de assets viejos.
  → `/api/admin/cleanup` purga uploads locales y objetos Supabase Storage fechados con más de 7 días.

Nota:
- Deploy automático en push a `main`. Último deploy verificado: `44cc681`, Ready.
- Health check en producción confirma: fal reachable, supabase ready, storage supabase.
- Health check también confirma: Stripe no configurado, Sentry no configurado, PostHog no configurado, queue `db-backed-with-in-process-worker`.

### 3.2 Supabase [~]

- [x] Ejecutar migraciones en el proyecto de producción.
  → 16 migraciones verificadas, todas aplicadas al proyecto `lbcrvwbsxzcyrxvnjwtf`.
- [x] Verificar tablas críticas:
  - [x] `generations`
  - [x] `generation_jobs`
  - [x] `credit_accounts`
  - [x] `credit_transactions`
  - [x] `api_keys`
- [x] Verificar índices y RPCs:
  - [x] `deduct_credits_atomic`
  - [x] `grant_credits_once`
  - [x] `increment_api_key_usage`
- [x] Validar lectura/escritura real desde la app desplegada.
  → `/api/admin/costs` responde correctamente contra Supabase prod.
- [x] Buckets de storage verificados: `mockforge-inputs` y `mockforge-outputs` (públicos).
- [~] Confirmar backups y acceso operativo al proyecto.
  → Acceso operativo por CLI confirmado (`supabase projects list`, proyecto `lbcrvwbsxzcyrxvnjwtf`).
  → Backups verificados por CLI el 2026-04-25: `pitr_enabled=false`, `walg_enabled=true`, `backups=[]`. Falta activar/confirmar backups/PITR desde Supabase Dashboard o plan correspondiente.

### 3.3 Stripe

- [ ] Configurar `STRIPE_SECRET_KEY`.
- [ ] Configurar `STRIPE_WEBHOOK_SECRET`.
- [ ] Configurar `STRIPE_PRICE_SINGLE_PACK`.
- [ ] Configurar `STRIPE_PRICE_BUNDLE`.
  → Producción re-verificada 2026-04-26: faltan las 4 vars; checkout/health reportan payments disabled.
- [ ] Probar compra end-to-end en modo real o staging equivalente.
- [ ] Verificar:
  - [ ] redirect a checkout
  - [ ] retorno a `/success`
  - [ ] recepción del webhook
  - [ ] grant de créditos
  - [ ] no duplicación ante reintentos
- [x] Tener procedimiento para soporte manual de pagos fallidos.
  → Documentado en `OPERATIONS.md`.

### 3.4 Observabilidad y operación

- [ ] Configurar Sentry en producción.
  → Producción re-verificada 2026-04-26: `sentryConfigured=false`.
- [ ] Configurar PostHog si se va a usar desde el día 1.
- [x] Confirmar logs estructurados accesibles para incidentes.
  → `src/lib/logger.ts` emite JSON con `requestId`; `vercel logs mockforge-gray.vercel.app` accesible por CLI.
- [x] Definir owner operativo para:
  - [x] fallos de generación
  - [x] fallos de Stripe
  - [x] storage
  - [x] Supabase
  → Owner operativo de launch: Leo. Documentado en `OPERATIONS.md`.
- [x] Definir alertas mínimas:
  - [x] spike de errores 5xx
  - [x] webhook failures
  - [x] budget exceeded
  - [x] storage fallback frecuente
  → Definidas en `OPERATIONS.md`. Configuración real pendiente de Sentry/Stripe/Vercel/Supabase.

## 4. Producto y confianza pública

### 4.1 Legal y cumplimiento mínimo

- [x] Crear páginas reales para:
  - [x] Privacy Policy (`/privacy`)
  - [x] Terms of Service (`/terms`)
  - [x] Cookie Policy (`/cookies`)
- [x] Reemplazar links placeholder del footer que hoy apuntan a `/`.
  → Ahora apuntan a `/privacy`, `/terms`, `/cookies` en todos los idiomas.
- [x] Definir contacto de soporte visible.
  → `support@mockforge.ai`
- [x] Definir política de reembolsos.
  → 14 días, <50% de créditos usados. En Terms of Service.
- [x] Definir política de retención/borrado de imágenes y generaciones.
  → Borrado dentro de 30 días. En Privacy Policy.
- [x] Exponer un flujo mínimo real para borrado/erasure.
  → Los usuarios pueden borrar generaciones desde `/history`.
  → Privacy Policy permite solicitar borrado de cuenta/datos vía `support@mockforge.ai`.
  → No hay endpoint automático de account deletion; aceptado como operación manual para launch.

Definition of done:
- No hay claims legales o de privacidad sin implementación mínima real.

### 4.2 UX crítica antes de abrir tráfico

- [x] Revisar móvil y desktop en:
  - [x] `/` — layout responsive, footer links funcionando
  - [x] `/upload` — form usable en mobile, drag & drop con feedback
  - [x] `/results` — estados de generación (processing/failed/completed)
  - [x] `/history` — server-rendered, paginación correcta
  - [x] `/gallery` — localizada, grid responsive, load more
  - [x] `/success` — traducida, layout responsive
- [x] Verificar estados de error legibles para:
  - [x] upload inválido → error visual en form + drag & drop muestra error si archivo no es PNG/JPG/WEBP
  - [x] sin créditos → CreditsBadge muestra estado “low” y CTA hacia `/billing`; checkout falla limpio si Stripe no está configurado
  - [x] fallo de provider → tarjeta roja con mensaje de error en results-view
  - [x] timeout → error genérico con auto-clear a 6s en form
  - [x] pago no configurado → no crashea, checkout muestra error limpio
- [x] Confirmar copy consistente en EN/ES como mínimo.
  → Todos los textos visibles traducidos en EN, ES, FR, PT, DE.
  → Gallery, credits badge, header nav, results loading — todo localizado (commit `21e6880`).
- [x] Revisar si el tour onboarding debe salir a usuarios nuevos en launch.
  → Tour existe (cookie `mockforge-tour-done`) pero es placeholder/no crítico. Aceptado para launch controlado; mejorar post-launch.

**Mejoras aplicadas (commit `21e6880`):**
- Gallery: copiado 100% localizado (antes era hardcoded en inglés)
- Header: link Gallery en desktop + mobile nav
- Form: labels vinculados a inputs con `htmlFor`/`id` (accesibilidad)
- Results: "Generating..." localizado
- Credits badge: traducido a 5 idiomas
- File picker: error visible al dropear archivo inválido

**Pendientes menores (no bloquean launch):**
- Onboarding tour es básico/placeholder; mejorar post-launch si métricas lo justifican.

## 5. API Pública

Si `/api/v1/generate` sale en el launch:

- [ ] Añadir reset diario real para `used_today`.
- [ ] Definir provisioning y revocación de API keys.
- [ ] Documentar límites, errores y auth.
- [ ] Probar abuso básico:
  - [ ] invalid key
  - [ ] rate limit por minuto
  - [ ] daily limit
- [ ] Verificar que el endpoint no consume créditos/coste de forma inconsistente.

Si `/api/v1/generate` no sale en el launch:

- [x] Marcarlo como beta interna o deshabilitarlo.
  → Deshabilitado por defecto salvo `MOCKFORGE_PUBLIC_API_ENABLED=true`.
- [x] Sacarlo del marketing y del checklist público de release.
  → README lo marca como beta gated, no como feature pública de launch.

## 6. Validación Final De Release

### 6.1 Smoke manual en staging/producción

- [ ] Usuario nuevo entra a `/`
- [ ] Navega a `/upload`
- [ ] Sube imagen válida
- [ ] Genera mockup simple
- [ ] Ve resultados
- [ ] Hace una variación
- [ ] Hace un upscale
- [ ] Compra créditos
- [ ] Recibe créditos
- [ ] Genera de nuevo usando créditos comprados
- [ ] Entra a `/history`
- [ ] Abre detalle de generación
- [ ] Activa o desactiva visibilidad pública
- [ ] Verifica aparición correcta en `/gallery` si aplica

### 6.2 Checklist técnico final

- [~] Variables de entorno revisadas
  → `.env.example` incluye Stripe, Sentry/PostHog y gate de API pública. Falta cargar/validar secretos reales en Vercel.
- [ ] Secrets cargados correctamente
- [x] Migraciones aplicadas
  → 16 migraciones verificadas en Supabase prod (`lbcrvwbsxzcyrxvnjwtf`).
- [x] Build de producción validado
  → `npm run build` OK local el 2026-04-26 y Vercel deploy `44cc681` Ready.
- [~] Webhook de Stripe validado
  → Tests locales OK. Falta webhook real contra Stripe/Vercel.
- [ ] Sentry recibiendo eventos
- [x] No hay endpoints internos expuestos
  → `/api/admin/costs` requiere auth, `/api/debug/upload` 404 en producción y `/debug/upload` ahora devuelve 404 si no está explícitamente habilitado.
- [x] No hay placeholders legales visibles
  → `/privacy`, `/terms`, `/cookies` responden 200 en producción; grep no encontró lorem/example/TODO en páginas legales.
- [~] No hay errores críticos abiertos de launch
  → No hay errores críticos de código conocidos tras lint/tests/build/e2e del 2026-04-26. Siguen abiertos bloqueadores operativos: Stripe, Sentry/PostHog, backups/PITR Supabase, secrets finales y smoke final.

## 7. Pendientes Aceptables Post-Launch Cercano

Estas no deberían bloquear una primera apertura pública controlada si todo lo anterior está resuelto.

- [ ] Activar GitHub Actions CI como PR check (workflow existe en `mockforge/.github/workflows/ci.yml`, mover a raíz del repo).
- [ ] Extraer la queue DB-backed a worker/proceso durable externo.
- [ ] Mejorar multi-región real.
- [ ] Refactor adicional de `mockup-upload-form.tsx`.
- [ ] Mejorar tracing distribuido.
- [ ] Endurecer y ampliar suite E2E.
- [ ] Dashboard interno más completo para costes y operaciones.

## 8. Criterio De Salida

Se puede considerar "listo para público general" cuando:

- [x] Todos los bloqueadores de la sección 2 están completos
  → Vercel actúa como gate de producción. GitHub Actions movido a post-launch.
- [ ] Todos los requisitos mínimos de la sección 3 están completos
- [x] La sección 4 tiene implementación mínima real
- [ ] La validación final de la sección 6 está completa
- [x] Existe owner operativo para incidentes de launch
  → Leo, documentado en `OPERATIONS.md`.

## 9. Orden Recomendado De Ejecución

1. ~~Corregir uploads/fallback.~~ ✅
2. ~~Corregir créditos/cobros.~~ ✅
3. ~~Dejar lint/tests/build/e2e locales verdes.~~ ✅
4. ~~Cerrar exposición de endpoints internos.~~ ✅
5. Configurar producción real pendiente: Stripe, Sentry/PostHog, backups/PITR Supabase, secrets finales.
6. Ejecutar smoke final en producción/staging equivalente.
7. Abrir tráfico público controlado.

## Changelog

- **2026-04-26** — Revisión de estado de launch:
  - `npm run lint` ✅
  - `npm test` ✅
  - `npm run build` ✅
  - `npm run test:e2e` ✅
  - Health producción `/api/provider/health` ✅: fal reachable, Supabase Storage ready, queue DB-backed.
  - Bloqueadores siguen siendo operativos: Stripe no configurado, Sentry/PostHog no configurados, backups/PITR Supabase sin confirmar, smoke manual final pendiente.
  - Nota de riesgo: repo local sigue con cambios sin commit; revisar antes de deploy/launch.

- **2026-04-22** — Sección 2 completada:
  - 2.1: Exportado `resolveFalImageUrl`, corregido upscale y video para resolver URLs locales antes de enviar a fal.ai.
  - 2.2: Creados tests de créditos (8 tests) y Stripe webhook (4 tests). Batch usa upfront+refund. Todos los endpoints tienen deduct+refund en fallo.
  - 2.3: Corregido selector E2E (Espanol vs Portugues), fix tsc NODE_ENV, build limpio.
  - 2.4: Verificado que debug endpoints están protegidos en producción.
  - Commits: `463d20c`, `f372b1f`, `9301a3b`
