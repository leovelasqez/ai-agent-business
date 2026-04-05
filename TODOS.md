# TODOS

## Deploy

- **Título:** Deploy estable en VPS
  **Prioridad:** P0
  **Descripción:** Configurar y verificar deploy funcional en servidor de producción.

## MockForge / Generation

- **Título:** Masked editing para variante C (GPT Image 1)
  **Prioridad:** P1
  **Descripción:** Implementar generación de máscara automática via `fal-ai/imageutils/rembg` para aislar el producto y solo editar el fondo. Actualmente GPT Image 1 puede distorsionar el texto del empaque.

- **Título:** Verificar que `resolution_mode: "9:16"` sea aceptado por FLUX Kontext
  **Prioridad:** P1
  **Descripción:** El adversarial review detectó que "9:16" puede no ser un valor válido para `resolution_mode` en fal-ai/flux-kontext/dev y fal-ai/flux-pro/kontext. Verificar con docs de fal.ai y ajustar si es necesario.

- **Título:** Timeout en fal.subscribe
  **Prioridad:** P2
  **Descripción:** Agregar AbortController con timeout explícito para evitar que requests colgados agoten workers del servidor en producción.

## Checkout / Payments

- **Título:** Checkout real con pagos
  **Prioridad:** P2
  **Descripción:** El checkout actual es un placeholder. Integrar Stripe o equivalente para procesar pagos reales.

## Infrastructure

- **Título:** Persistencia de generaciones
  **Prioridad:** P3
  **Descripción:** Sin DB actualmente. Agregar persistencia para que los usuarios puedan ver sus generaciones anteriores.

## Completed

