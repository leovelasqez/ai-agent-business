# AI Agent Business

Proyecto base para construir productos operados por IA con foco en velocidad de ejecución, marketing automatizable y monetización.

## Proyecto activo: MockForge

**MockForge** es el primer MVP del portfolio: una app para generar mockups visuales de ecommerce a partir de una foto de producto.

### Qué ya existe
- app en Next.js
- flujo de upload
- generación real conectada a fal.ai
- resultados renderizados en frontend
- capa abstracta de providers para cambiar motor sin romper la app
- documentación base de producto y arquitectura

### Estado actual
El MVP ya cruza casi todo el camino end-to-end. El cuello de botella principal detectado fue el comportamiento del file picker en navegadores embebidos tipo Telegram webview.

## Estructura del repo
- `mockforge/` → app principal
- `mvp-mockups-ecommerce.md` → definición del MVP
- `architecture-mvp-replicate.md` → arquitectura técnica inicial
- `status.md` → estado resumido
- `decisions.md` → decisiones tomadas
- `next-steps.md` → siguientes pasos operativos
- `backlog.md` → pendientes

## Cómo correr MockForge
```bash
cd mockforge
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno importantes
Dentro de `mockforge/.env.local` las mínimas para el MVP son:

```bash
IMAGE_PROVIDER=fal
FAL_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Los modelos y proveedores alternos quedan como configuración opcional en `mockforge/.env.example`.

## Scripts útiles
```bash
cd mockforge
npm run dev
npm run build
npm run start
npm run lint
npm run test:file-storage
```

## Seguridad básica
- no subir `.env*`
- no subir llaves, tokens o credenciales
- no commitear uploads generados localmente

## Siguiente jugada recomendada
1. cerrar UX de upload fuera de webviews rotas
2. conectar checkout real
3. preparar deploy estable
4. empezar validación con usuarios
