# Launch Plan

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

### 2.3 CI y release readiness ✅

- [x] Dejar `npm run lint` en verde.
- [x] Corregir el error actual de React Hooks en `onboarding-tour.tsx`.
- [x] Resolver o aceptar explícitamente los warnings de hooks restantes.
- [x] Hacer que `npm run build` sea reproducible en CI/producción.
- [~] Decidir estrategia de fuentes:
  - [ ] self-host
  - [x] fallback local
  - [ ] o dependencia externa aceptada conscientemente
  → No bloqueante. Fallback local funciona. Decisión pendiente de Leo.
- [x] Arreglar E2E para que realmente levanten la app en CI.
- [x] Configurar `playwright.config.ts` con `webServer` o equivalente.
- [x] Confirmar que `.github/workflows/ci.yml` falla cuando debe y pasa cuando debe.

Definition of done:
- `npm run lint` ✅
- `npm test` ✅
- `npm run test:health` ✅
- `npm run test:queue` ✅
- `npm run build` ✅
- `npm run test:e2e` ✅

Todos verdes en local y CI.

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

**Sección 2 completa.** Todos los bloqueadores cerrados.

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
- Deploy automático en push a `main`. Último deploy: Ready, 36s.
- Health check en producción confirma: fal reachable, supabase ready, storage supabase.

### 3.2 Supabase ✅

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
- [ ] Confirmar backups y acceso operativo al proyecto.

### 3.3 Stripe

- [ ] Configurar `STRIPE_SECRET_KEY`.
- [ ] Configurar `STRIPE_WEBHOOK_SECRET`.
- [ ] Configurar `STRIPE_PRICE_SINGLE_PACK`.
- [ ] Configurar `STRIPE_PRICE_BUNDLE`.
- [ ] Probar compra end-to-end en modo real o staging equivalente.
- [ ] Verificar:
  - [ ] redirect a checkout
  - [ ] retorno a `/success`
  - [ ] recepción del webhook
  - [ ] grant de créditos
  - [ ] no duplicación ante reintentos
- [ ] Tener procedimiento para soporte manual de pagos fallidos.

### 3.4 Observabilidad y operación

- [ ] Configurar Sentry en producción.
- [ ] Configurar PostHog si se va a usar desde el día 1.
- [ ] Confirmar logs estructurados accesibles para incidentes.
- [ ] Definir owner operativo para:
  - [ ] fallos de generación
  - [ ] fallos de Stripe
  - [ ] storage
  - [ ] Supabase
- [ ] Definir alertas mínimas:
  - [ ] spike de errores 5xx
  - [ ] webhook failures
  - [ ] budget exceeded
  - [ ] storage fallback frecuente

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
- [~] Exponer un flujo real para borrado si se va a prometer GDPR/erasure.
  → Los usuarios pueden borrar generaciones desde `/history`. Falta endpoint automático de account deletion.
  → Contacto: support@mockforge.ai para solicitudes GDPR.

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
  - [x] sin créditos → CreditsBadge muestra estado “low” en amber (falta CTA de compra hasta que Stripe esté configurado)
  - [x] fallo de provider → tarjeta roja con mensaje de error en results-view
  - [x] timeout → error genérico con auto-clear a 6s en form
  - [x] pago no configurado → no crashea, checkout muestra error limpio
- [x] Confirmar copy consistente en EN/ES como mínimo.
  → Todos los textos visibles traducidos en EN, ES, FR, PT, DE.
  → Gallery, credits badge, header nav, results loading — todo localizado (commit `21e6880`).
- [~] Revisar si el tour onboarding debe salir a usuarios nuevos en launch.
  → Tour existe (cookie `mockforge-tour-done`) pero es placeholder. No bloquea launch.

**Mejoras aplicadas (commit `21e6880`):**
- Gallery: copiado 100% localizado (antes era hardcoded en inglés)
- Header: link Gallery en desktop + mobile nav
- Form: labels vinculados a inputs con `htmlFor`/`id` (accesibilidad)
- Results: "Generating..." localizado
- Credits badge: traducido a 5 idiomas
- File picker: error visible al dropear archivo inválido

**Pendientes menores (no bloquean launch):**
- Credits badge “low” no tiene CTA de compra (espera Stripe)
- Onboarding tour es placeholder

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
- [ ] Migraciones aplicadas
- [x] Build de producción validado
  → `npm run build` OK local el 2026-04-24.
- [~] Webhook de Stripe validado
  → Tests locales OK. Falta webhook real contra Stripe/Vercel.
- [ ] Sentry recibiendo eventos
- [ ] No hay endpoints internos expuestos
- [ ] No hay placeholders legales visibles
- [ ] No hay errores críticos abiertos de launch

## 7. Pendientes Aceptables Post-Launch Cercano

Estas no deberían bloquear una primera apertura pública controlada si todo lo anterior está resuelto.

- [ ] Reemplazar la queue en memoria por una durable.
- [ ] Mejorar multi-región real.
- [ ] Refactor adicional de `mockup-upload-form.tsx`.
- [ ] Mejorar tracing distribuido.
- [ ] Endurecer y ampliar suite E2E.
- [ ] Dashboard interno más completo para costes y operaciones.

## 8. Criterio De Salida

Se puede considerar "listo para público general" cuando:

- [x] Todos los bloqueadores de la sección 2 están completos
- [ ] Todos los requisitos mínimos de la sección 3 están completos
- [ ] La sección 4 tiene implementación mínima real
- [ ] La validación final de la sección 6 está completa
- [ ] Existe owner operativo para incidentes de launch

## 9. Orden Recomendado De Ejecución

1. ~~Corregir uploads/fallback.~~ ✅
2. ~~Corregir créditos/cobros.~~ ✅
3. ~~Dejar CI y build verdes.~~ ✅
4. ~~Cerrar exposición de endpoints internos.~~ ✅
5. Configurar producción real: Supabase, storage, Stripe, secrets.
6. Cerrar legal mínimo y footer.
7. Ejecutar smoke final en staging.
8. Abrir tráfico público.

## Changelog

- **2026-04-22** — Sección 2 completada:
  - 2.1: Exportado `resolveFalImageUrl`, corregido upscale y video para resolver URLs locales antes de enviar a fal.ai.
  - 2.2: Creados tests de créditos (8 tests) y Stripe webhook (4 tests). Batch usa upfront+refund. Todos los endpoints tienen deduct+refund en fallo.
  - 2.3: Corregido selector E2E (Espanol vs Portugues), fix tsc NODE_ENV, build limpio.
  - 2.4: Verificado que debug endpoints están protegidos en producción.
  - Commits: `463d20c`, `f372b1f`, `9301a3b`
