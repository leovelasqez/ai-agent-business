# Arquitectura Técnica — MVP Mockups Ecommerce con Replicate

## Decisión
Proveedor inicial de generación: Replicate.

## Razón
Se prioriza flexibilidad para explorar distintos pipelines de generación antes de casarnos con un proveedor final.

---

## Objetivo técnico
Construir un MVP web simple que permita:
1. subir una imagen de producto,
2. seleccionar un preset visual,
3. generar mockups,
4. mostrar previews,
5. cobrar para desbloquear descarga HD.

---

## Frontend
### Stack
- Next.js
- Tailwind CSS

### Pantallas mínimas
1. Landing
2. Upload
3. Results
4. Checkout success

---

## Backend
### Stack
- Next.js route handlers

### Endpoints mínimos
#### `POST /api/upload`
- recibe imagen del producto
- la guarda en storage
- devuelve URL/id

#### `POST /api/generate`
- recibe image URL, preset y metadata opcional
- arma prompt
- llama Replicate
- guarda resultado
- devuelve previews

#### `POST /api/checkout`
- crea checkout en Stripe
- asocia generación con compra

#### `GET /api/result/:id`
- devuelve resultados y estado

---

## Storage
### Recomendación
- Supabase Storage

Uso:
- uploads
- previews
- resultados finales

---

## Base de datos
### Recomendación
- Supabase Postgres

### Tabla `generations`
- id
- created_at
- source_image_url
- preset
- prompt
- status
- preview_urls
- final_urls
- payment_status
- session_id

### Tabla `checkouts`
- id
- generation_id
- stripe_session_id
- amount
- status

---

## Pipeline AI
1. usuario sube imagen
2. guardamos asset
3. elige preset
4. backend construye prompt
5. enviamos a Replicate
6. guardamos output
7. mostramos previews
8. desbloqueamos HD tras pago

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
- composición más impactante
- estética publicitaria
- producto reconocible

---

## Prompt builder
Se usarán prompts estructurados por preset en vez de prompts libres del usuario.

Objetivos:
- preservar forma y color del producto
- reducir deformaciones
- mantener utilidad comercial

---

## UX mínima
### Landing
CTA: "Generate your first mockup free"

### Upload
- imagen
- categoría
- preset
- formato

### Generating
- estado de carga

### Results
- grid de previews
- botón para desbloquear HD

### Checkout
- Stripe checkout

### Download
- acceso a archivos HD

---

## Analytics mínimos
- landing_view
- upload_started
- upload_completed
- preset_selected
- generation_started
- generation_completed
- results_viewed
- checkout_started
- purchase_completed
- download_completed

---

## Decisiones del MVP
### Auth
No obligatorio al inicio.

### Ejecución
Generación asíncrona corta con polling simple.

### Input esperado
Se pedirá foto simple del producto, idealmente con fondo limpio.

---

## Milestones
### Milestone 1
- landing
- upload
- storage
- generate endpoint mockeado
- estructura UI

### Milestone 2
- integración real con Replicate
- un preset funcional

### Milestone 3
- tres presets
- previews persistidas

### Milestone 4
- Stripe
- unlock HD
