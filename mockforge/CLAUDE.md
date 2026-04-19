# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project-Specific Guidelines — MockForge

### Stack

- **Next.js 16.2.2** (App Router) + **React 19.2.4**
- **TypeScript 5** en modo `strict` (ver `tsconfig.json`)
- **Tailwind CSS 4** vía `@tailwindcss/postcss`
- **ESLint 9** con `eslint-config-next`
- Integraciones: `@fal-ai/client`, `@supabase/supabase-js`, `stripe`, `posthog-js`, `replicate`
- Tests: **Playwright** para e2e; tests unitarios corren con `node --import tsx` (no hay Jest/Vitest)

### Comandos

```bash
npm install           # instalar dependencias
npm run dev           # servidor local en http://localhost:3000
npm run build         # build de producción
npm start             # servir build
npm run lint          # ESLint
npm test              # unit tests (file-storage + model-config + storage-provider)
npm run test:e2e      # Playwright (tests/smoke.spec.ts)
npm run test:health   # test del endpoint /api/provider/health
npm run test:queue    # test del job-queue
```

Variables de entorno: copiar `.env.example` a `.env.local`. Mínimas: `IMAGE_PROVIDER=fal`, `FAL_KEY`, `NEXT_PUBLIC_APP_URL`. Ver `README.md` para Supabase, Stripe y opcionales.

### Estructura

```
mockforge/
├── src/
│   ├── app/          # App Router: api/, results/, history/, gallery/, upload/, success/, debug/
│   ├── components/   # UI React (kebab-case.tsx)
│   ├── lib/          # Lógica de negocio
│   │   ├── providers/  # Adaptadores de proveedores de imagen (fal, replicate, ...)
│   │   └── db/         # Acceso a Supabase
│   └── proxy.ts
├── tests/            # Playwright e2e (smoke.spec.ts)
├── supabase/         # Migraciones SQL
├── public/
│   └── uploads/      # Imágenes subidas y generadas (runtime)
└── test-results/     # Output de Playwright (runtime)
```

### Convenciones observadas

- **Alias de imports**: `@/*` → `./src/*` (usar siempre `@/lib/...`, `@/components/...`)
- **Naming**: kebab-case para archivos (`mockup-upload-form.tsx`, `image-provider.ts`)
- **Tests co-ubicados**: `*.test.ts` junto al archivo bajo test (ej. `src/lib/file-storage.test.ts`, `src/app/api/provider/health/route.test.ts`)
- **App Router**: handlers HTTP en `route.ts` dentro de `src/app/api/**`
- **Abstracción de providers**: toda lógica de proveedor externo vive detrás de `src/lib/image-provider.ts` o `src/lib/storage-provider.ts`. Al agregar un proveedor nuevo, crear `src/lib/providers/<nombre>.ts` y enchufarlo ahí — no tocar el resto.
- **TS strict, sin `any`** salvo donde el SDK externo lo imponga
- **Errores**: propagar con mensajes legibles (ver `src/lib/errors.ts`), no silenciar

### No tocar

- `node_modules/`, `.next/`, `test-results/` — generados
- `tsconfig.tsbuildinfo`, `next-env.d.ts` — generados por Next/TS
- `public/uploads/` — contenido de runtime, no versionar
- `bun.lock`, `package-lock.json` — lockfiles (ver nota abajo)
- `.env.local` y cualquier archivo con claves reales
- Migraciones en `supabase/` ya aplicadas — crear nuevas en lugar de editar las existentes

### Notas (no arreglar sin pedir)

- **Doble lockfile**: conviven `bun.lock` y `package-lock.json`. Ambigüedad de package manager; conviene alinear en uno.
- **Tests unitarios ad-hoc** con `node --import tsx` y scripts encadenados en `package.json`. Escala mal; un runner (Vitest) simplificaría.
- **`mockup-upload-form.tsx`** usa ~13 `useState` — el propio README lo marca como pendiente de refactor a `useReducer`.
- **`job-queue`** es un `Map` en memoria (documentado en README): los jobs se pierden al reiniciar el server.
