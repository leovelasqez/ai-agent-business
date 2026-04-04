# Contributing

Guía corta para humanos y agentes que vayan a colaborar en este repo.

## Regla 1
La app principal vive en `mockforge/`.
No entres a tocar docs al azar si el problema real está ahí.

## Antes de cambiar cosas
1. Lee `README.md`
2. Lee `status.md`
3. Lee `next-steps.md`
4. Si vas a tocar la app, lee `mockforge/README.md`
5. Si vas a tocar Next.js, mira `mockforge/AGENTS.md`

## Setup rápido
```bash
cd mockforge
npm install
cp .env.example .env.local
npm run dev
```

Variables mínimas:
```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Qué sí hacer
- mantener cambios pequeños y enfocados
- actualizar docs si cambias comportamiento real
- preferir soluciones simples antes de meter infraestructura prematura
- confirmar si un bug es backend, frontend o webview antes de adivinar

## Qué no hacer
- no subir `.env.local`
- no subir secretos, keys o credenciales
- no romper la capa abstracta de providers porque sí
- no meter Supabase, Stripe o auth como si ya fueran prioridad máxima si el cuello de botella sigue siendo otro
- no dejar documentación mintiendo sobre el estado real del proyecto

## Criterio actual del proyecto
Estamos en fase de validar producto, no de impresionar arquitectos.
Si una mejora no ayuda a:
- generar mockups reales mejor,
- desplegar la app,
- o aprender de usuarios,
probablemente no es prioridad.

## Si eres otro agente
Empieza por una de estas líneas de trabajo:
1. deploy estable
2. UX del upload fuera de webviews rotas
3. checkout real
4. persistencia mínima

## Definition of done
Un cambio está realmente hecho cuando:
- corre
- no rompe el flujo principal
- está explicado si cambió algo importante
- se puede empujar sin vergüenza
