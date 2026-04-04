# MVP Exacto — Mockups Visuales para Ecommerce

## Idea
Una web app que permite a sellers de ecommerce subir una foto simple de su producto y generar mockups visuales listos para usar en tienda, anuncios y redes.

## Working name
MockForge

---

## Problema
Las marcas pequeñas y sellers de ecommerce necesitan creativos de producto rápidos, baratos y suficientemente buenos para publicar o testear anuncios.

Hoy suelen tener estas fricciones:
- fotos de producto pobres o inconsistentes
- dependencia de diseñador o fotógrafo
- lentitud para crear nuevas variantes
- dificultad para producir suficientes creativos para testing

---

## Promesa principal
"Convierte una foto simple de tu producto en mockups de marketing listos para usar en minutos."

---

## Usuario objetivo inicial
### ICP v1
- dueños de tiendas Shopify pequeñas
- sellers de Etsy
- marcas pequeñas de DTC
- personas que venden productos visuales simples

### Productos ideales para arrancar
- skincare
- velas
- suplementos
- botellas
- tazas
- empaques simples
- cosméticos

### Productos a evitar al inicio
- ropa compleja sobre modelo humano
- joyería muy detallada
- muebles grandes
- productos transparentes difíciles
- electrónica con reflejos complejos

---

## MVP exacto
### Flujo principal
1. Usuario entra a landing
2. Sube 1 foto de producto
3. Elige tipo de mockup
4. Genera 3-6 variantes
5. Ve resultados con watermark o baja resolución
6. Para descargar HD o generar más, paga

---

## Inputs del usuario
### Requeridos
- 1 imagen del producto

### Opcionales
- nombre del producto
- categoría del producto
- estilo visual
- background preference
- formato destino (square / portrait)

---

## Tipos de mockup del MVP
Lanzar solo con 3 presets:

### 1. Clean studio
- fondo limpio
- look premium
- ideal para PDP / tienda

### 2. Lifestyle scene
- producto en contexto de uso
- ideal para ads y social

### 3. Ad creative style
- visual más llamativo
- con composición pensada para performance creative

No meter overlays de texto en el MVP. Primero validar calidad de imagen.

---

## Outputs del MVP
Por cada generación:
- 3 a 6 imágenes
- preview en baja o con watermark
- opción de descargar al pagar

Formatos iniciales:
- 1:1 cuadrado
- 4:5 vertical

---

## Paywall del MVP
### Opción recomendada
No suscripción al inicio. Cobro simple para validar.

#### Plan inicial
- 1 generación gratis con watermark
- $9 por pack HD de primera generación
- $19 por 3 packs

### Razón
Reduce fricción inicial y valida demanda antes de meter SaaS completo.

### Después, si hay señales
Pasar a:
- suscripción mensual
- créditos
- plan Pro para volumen

---

## Qué NO entra en el MVP
- login obligatorio desde el inicio
- edición manual avanzada
- biblioteca de proyectos compleja
- generación por lote
- remover fondo complejo en app
- integración con Shopify
- colaboración en equipo
- video
- anuncios automáticos
- analytics avanzados

---

## Stack recomendado MVP
### Frontend
- Next.js
- Tailwind

### Backend
- Next.js route handlers o server actions

### Storage
- Supabase Storage o S3-compatible

### Payments
- Stripe payment links o checkout simple

### Auth
- evitar auth al inicio si se puede
- añadir magic link después si hace falta

### AI image generation/editing
Proveedor por definir según pruebas

### Analytics
- PostHog o Plausible

### Hosting
- Vercel

---

## Arquitectura simple
1. usuario sube imagen
2. backend guarda asset
3. backend prepara prompt según preset
4. proveedor de imagen genera variantes
5. guardamos outputs
6. mostramos previews
7. si paga, desbloqueamos descarga HD

---

## Eventos a medir
### Funnel mínimo
- landing_view
- upload_started
- upload_completed
- mockup_type_selected
- generation_started
- generation_completed
- paywall_viewed
- checkout_started
- purchase_completed
- download_completed

---

## Landing MVP
### Hero
"Turn one product photo into ecommerce mockups in minutes"

### Subheadline
"Create studio shots, lifestyle scenes, and ad creatives without hiring a designer or photographer."

### CTA
- Upload your product photo
- Generate your first mockup free

### Sections
- before/after examples
- 3 use cases
- how it works in 3 steps
- pricing
- FAQ

---

## Validación inicial
### Objetivo
Probar si hay interés real y si la calidad percibida basta para pagar.

### Señales de éxito tempranas
- gente completa el upload
- gente espera la generación
- gente abre paywall
- al menos algunas compras del primer pack

### Test inicial recomendado
- landing simple
- 10-20 piezas de contenido corto mostrando antes/después
- outreach manual a pequeños sellers

---

## Canales de adquisición iniciales
### Orgánico
- TikTok
- Reels
- X

### Manual
- grupos de Shopify / Etsy
- outreach por DM/email
- comunidades de ecommerce

---

## Riesgos principales
- calidad insuficiente del output
- producto difícil de extraer o integrar en escena
- demasiado genérico frente a competidores
- poca intención de pago si se ve como juguete

---

## Estrategia de enfoque
No vender "IA".
Vender:
- más creativos
- más rápido
- sin diseñador
- sin fotógrafo
- listo para ads y tienda

---

## Siguiente paso
1. definir nombre temporal o dejar interno
2. elegir proveedor de generación de imágenes
3. diseñar prompts base para los 3 presets
4. crear landing + flujo de upload
5. preparar ejemplos demo
