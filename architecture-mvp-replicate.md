# Arquitectura Técnica — MockForge MVP

## Estado de esta arquitectura
Documento actualizado para reflejar el estado real del proyecto.

**Resumen corto:**
- provider activo: **fal.ai**
- Replicate quedó como opción secundaria para comparación o fallback futuro
- almacenamiento actual: **local**
- persistencia de generaciones: **todavía no**
- checkout: **placeholder**

---

## Objetivo técnico
Construir una app web simple que permita:
1. subir una imagen de producto,
2. seleccionar un preset visual,
3. generar mockups reales,
4. mostrar previews,
5. dejar la base lista para cobrar más adelante.

---

## Frontend
### Stack
- Next.js 16
- React 19
- Tailwind CSS 4

### Pantallas actuales
1. Landing
2. Upload
3. Results
4. Success
5. Debug upload

---

## Backend
### Stack
- Next.js route handlers

### Endpoints actuales
#### `POST /api/upload`
- recibe imagen del producto
- la guarda en almacenamiento local
- devuelve ruta pública

#### `POST /api/generate`
- recibe imagen + preset + metadata
- arma prompt
- llama al provider activo
- devuelve previews reales

#### `GET /api/provider/health`
- confirma provider activo
- indica si la key mínima está configurada

#### `POST /api/debug/upload`
- endpoint de diagnóstico para aislar fallos de upload

#### `GET /api/result/:id`
- endpoint base para flujo de resultados

#### `POST /api/checkout`
- placeholder por ahora

---

## Storage
### Estado actual
- `public/uploads` para uploads y outputs locales

### Qué significa eso
Sirve para validar el MVP, pero no es la solución final si el producto despega.

### Evolución probable
- storage externo
- URLs persistentes
- separación entre uploads originales y generaciones

---

## Pipeline AI actual
1. usuario sube imagen
2. guardamos asset localmente
3. selecciona preset/categoría/formato
4. backend construye prompt
5. enviamos al provider activo
6. guardamos previews localmente
7. mostramos resultados en frontend

---

## Providers
### Activo
- fal.ai
- modelo base actual: `fal-ai/flux-kontext/dev`

### Variantes contempladas
- `FAL_MODEL_A`
- `FAL_MODEL_B`
- `FAL_MODEL_C`

### Secundario / opcional
- Replicate

Replicate ya no define la arquitectura principal. Si se usa, será para comparar calidad, costo o estabilidad.

---

## Presets iniciales
### `clean_studio`
- fondo limpio
- look premium
- composición ecommerce

### `lifestyle_scene`
- contexto de uso
- producto como sujeto principal
- look realista

### `ad_creative`
- composición más agresiva visualmente
- estética publicitaria
- producto reconocible

---

## Prompt builder
Se usan prompts estructurados por preset en vez de prompts libres del usuario.

Objetivos:
- preservar forma y color del producto
- reducir deformaciones
- mantener utilidad comercial
- facilitar consistencia entre generaciones

---

## Lo que falta para salir del modo MVP de garaje
- checkout real
- persistencia en base de datos
- storage externo
- auth si se vuelve pública
- cola de jobs si la generación empieza a tardar más
- observabilidad decente
- deploy estable con proxy + HTTPS

---

## Milestones actualizados
### Milestone 1 — base funcional
- landing
- upload
- flujo de results
- provider integrado

### Milestone 2 — generación real
- fal.ai activo
- previews reales end-to-end
- uploader endurecido

### Milestone 3 — producto vendible
- checkout real
- persistencia
- deploy serio
- UX más pulida

### Milestone 4 — validación comercial
- tráfico real
- testing de hooks/ofertas
- primera señal de conversión
