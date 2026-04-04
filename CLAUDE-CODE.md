# Claude Code Handoff

Si Claude Code entra a este repo, esto es lo que necesita saber sin perder tiempo.

## Repo principal
- Repo: `ai-agent-business`
- App activa: `mockforge/`
- Objetivo actual: dejar MockForge funcionando y desplegable, no convertirlo en una nave espacial.

## Estado real
- generación real con fal.ai ya conectada
- upload local funcionando
- results funcionando
- checkout sigue siendo placeholder
- persistencia formal todavía no
- deploy serio todavía no

## Cuello de botella actual
El problema más feo detectado fue UX/comportamiento del file picker en navegadores embebidos como Telegram webview. En navegador normal, el backend ya había mostrado señales de funcionar bien.

## Archivos para entender el proyecto rápido
1. `README.md`
2. `status.md`
3. `next-steps.md`
4. `architecture-mockforge-mvp.md`
5. `mockforge/README.md`

## Setup
```bash
cd mockforge
npm install
cp .env.example .env.local
npm run dev
```

## Env mínima
```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Prioridades sensatas
1. deploy estable en VPS
2. proxy + HTTPS
3. validar flujo real desde navegador normal
4. decidir estrategia frente a webviews
5. luego checkout/persistencia

## No pierdas tiempo en esto todavía
- auth compleja
- multi-tenant elegante
- base de datos sobrediseñada
- sistemas de colas si todavía ni validamos uso real
- rehacer todo por gusto estético

## Si vas a cambiar arquitectura
Actualiza también:
- `README.md`
- `status.md`
- `next-steps.md`
- `architecture-mockforge-mvp.md`

## Regla práctica
Si dudas entre una solución linda y una que deja el MVP andando hoy, gana la segunda.
