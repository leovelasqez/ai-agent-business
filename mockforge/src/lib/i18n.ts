// Managed by MockForge i18n system
export type Language = "en" | "es";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const translations: Record<Language, Record<string, any>> = {
  en: {
    // Nav
    nav: {
      history: "History",
      generate: "Generate",
    },

    // Landing page
    landing: {
      badge: "Ecommerce mockup generator",
      headline: "Turn one product photo into mockups you can actually use.",
      subheadline: "Create studio shots, lifestyle scenes, and ad-style creatives without hiring a photographer or designer.",
      ctaPrimary: "Generate your first mockup free",
      ctaSecondary: "See how it works",
      presetFooter: "3 presets · 4 model variants",
      presetBadge: "Live",
      howItWorks: {
        steps: [
          ["1", "Upload your product", "Start with a simple product image. Clean photos work best for the MVP."],
          ["2", "Choose a preset", "Pick studio, lifestyle, or ad creative depending on the asset you need."],
          ["3", "Unlock HD", "Review previews first, then pay to unlock high-resolution exports."],
        ],
        stepLabel: "Step",
      },
      useCases: {
        label: "Use cases",
        headline: "Built for small ecommerce teams that need more creative volume.",
        items: [
          {
            title: "Product pages",
            description: "Create cleaner product visuals for your PDP without a full photoshoot.",
          },
          {
            title: "Paid ads",
            description: "Generate multiple visual angles to test in Meta, TikTok, or creative experiments.",
          },
          {
            title: "Organic content",
            description: "Turn one product shot into lifestyle and creative assets for social posting.",
          },
        ],
      },
      cta: {
        label: "Ready to start?",
        headline: "Turn your product photo into a commercial mockup in seconds.",
        button: "Generate your first mockup free",
      },
    },

    // Upload page
    upload: {
      back: "← Home",
      title: "Upload your product",
      description: "Upload a product image, choose a preset, and generate mockups ready to test in your store, ads, or content.",
    },

    // Results page
    results: {
      back: "← Back to upload",
      comparison: "Comparison",
      result: "Result",
    },

    // History page
    history: {
      title: "Generation history",
      newGeneration: "+ New generation",
      empty: "No saved generations yet.",
      createFirst: "Create first mockup",
      noPreview: "No preview",
      noName: "No name",
      liked: "Liked",
      disliked: "Didn't like",
    },

    // History detail page
    historyDetail: {
      back: "← History",
      generatedMockup: "Generated mockup",
      download: "Download",
      noImages: "No generated images",
      originalImage: "Original image",
      originalImageAlt: "Uploaded original image",
      noName: "No name",
      metaLabels: {
        preset: "Preset",
        category: "Category",
        format: "Format",
        variant: "Variant",
        model: "Model",
        provider: "Provider",
        status: "Status",
      },
      rating: "How did it turn out?",
      newGeneration: "+ New generation",
    },

    // Success page
    success: {
      badge: "Checkout success placeholder",
      title: "Your HD mockups are unlocked",
      description: "This screen will be the continuation of the flow after Stripe. Here we can show downloads, CTAs to generate more, and upsell to additional packs.",
      viewResults: "View results",
      generateMore: "Generate more",
    },

    // Upload form
    form: {
      variants: [
        { label: "A · FLUX Dev", description: "Faster and cheaper, but more prone to distortion." },
        { label: "B · FLUX Pro", description: "More expensive, should preserve the product better." },
        { label: "C · GPT Image 1", description: "Via fal, focused on editing without destroying the product." },
        { label: "D · Nano Banana 2", description: "Image editing with high fidelity to the product." },
      ],
      preloadedImage: "Preloaded image. You can generate directly or replace it by uploading another.",
      productName: "Product name",
      productNamePlaceholder: "E.g.: Vitamin C Serum",
      productCategory: "Product category",
      productCategoryPlaceholder: "E.g.: skincare, candle, supplement",
      format: "Format",
      formatOptions: {
        square: "1:1 Square",
        portrait: "4:5 Portrait",
        story: "9:16 Story (Instagram)",
      },
      modelMode: "Model mode",
      comparingVariants: "Comparing variants",
      compareVariants: "Compare variants",
      compareHint: "Select at least 2 variants to compare in parallel.",
      compareWarning: "Select at least 2 variants.",
      choosePreset: "Choose a preset",
      uploadFirst: "First upload a valid image and wait for it to be confirmed before generating, especially for variant C.",
      submitPreparing: "Preparing...",
      submitUploading: "Uploading image...",
      submitCompare: "Compare {n} variants",
      submitGenerate: "Generate mockups",
    },

    // Results view
    resultsView: {
      badge: {
        compare: "MockForge Comparison",
        single: "MockForge Results",
      },
      title: {
        compareLoading: "Generating variant comparison...",
        compareWithErrors: "Comparison completed with errors",
        compareDone: "Comparison ready",
        singleLoading: "Generating your premium mockups...",
        singleFailed: "Could not generate mockups",
        singleDone: "Your mockups are ready",
      },
      subtitle: {
        compare: "Generating the same product with multiple models in parallel so you can choose the best result.",
        singleLoading: "We're creating commercial-look versions from your image. This may take a few seconds.",
        singleFailed: "Try with another product image or go back to the previous step to adjust the data.",
        singleDone: "You now have previews ready to validate your idea, show clients, or prepare your next iteration.",
      },
      createAnother: "Create another version",
      openBest: "Open best result",
      statusLabel: "Status",
      statusProcessing: "Processing",
      statusCompleted: "Completed",
      badgeProcessing: "In progress",
      badgeReady: "Ready",
      variantLabel: "Variant",
      variantStatus: {
        processing: "In progress",
        failed: "Failed",
        completed: "Ready",
      },
      originalLabel: "Original",
      sourceImageTitle: "Source image",
      spinnerText: "Creating premium previews...",
      errorTitle: "Generation error",
      errorTip: "Tip: if this happened inside Telegram or another embedded browser, open MockForge in Chrome or Safari.",
      resultsLabel: "Results",
      generatedMockups: "Generated mockups",
      variants: "variants",
      mockupLabel: "Mockup",
      previewReady: "Preview ready to review or share",
      download: "Download",
      upsell: {
        title: "Unlock more variants and HD exports",
        description: "If this result works for you, the next step is converting these previews into a full commercial workflow with more packs, better resolution, and sell-ready deliverables.",
        pack: "$9 · Unlock this pack",
        bundle: "$19 · Buy 3 packs",
      },
      errors: {
        loadFailed: "The request failed to load. If you opened MockForge inside Telegram, try in Chrome or Safari and try again.",
        fetchFailed: "Could not connect to the server. Check your connection or try opening MockForge outside the embedded browser.",
        fileNotFound: "The source image no longer exists on the server. Upload the product again and try again.",
      },
    },

    // Results summary
    resultsSummary: {
      preset: "Preset",
      category: "Category",
      format: "Format",
      product: "Product",
      noCategory: "No category",
      noProduct: "Unnamed product",
    },

    // Rating buttons
    rating: {
      like: "Useful",
      dislike: "Not useful",
      likeTitle: "Like",
      dislikeTitle: "Dislike",
      likeAriaLabel: "Like",
      dislikeAriaLabel: "Dislike",
    },

    // File picker
    filePicker: {
      label: "Product image",
      formats: "PNG, JPG or WEBP",
      uploading: "· Uploading...",
      placeholder: "Preview will appear here when you select an image",
      hint: "Use a real product image. If you upload an empty, corrupted, or too small file, the system will reject it before generating.",
    },

    // Webview warning
    webviewWarning: {
      title: "Open MockForge outside of Telegram",
      message: "It looks like you opened MockForge inside an embedded browser, like Telegram or Instagram. Uploads and requests sometimes fail there.",
      openBrowser: "Open in browser",
      copyLink: "Copy link",
    },
  },

  es: {
    // Nav
    nav: {
      history: "Historial",
      generate: "Generar",
    },

    // Landing page
    landing: {
      badge: "Ecommerce mockup generator",
      headline: "Convierte una foto de producto en mockups que puedes usar de verdad.",
      subheadline: "Crea fotos de estudio, escenas lifestyle y creativos para anuncios sin contratar un fotógrafo o diseñador.",
      ctaPrimary: "Genera tu primer mockup gratis",
      ctaSecondary: "Ver cómo funciona",
      presetFooter: "3 presets · 4 variantes de modelo",
      presetBadge: "En producción",
      howItWorks: {
        steps: [
          ["1", "Sube tu producto", "Comienza con una imagen simple del producto. Las fotos limpias funcionan mejor."],
          ["2", "Elige un preset", "Selecciona estudio, lifestyle o ad creative según el asset que necesites."],
          ["3", "Desbloquea HD", "Revisa las previews primero, luego paga para desbloquear exports en alta resolución."],
        ],
        stepLabel: "Paso",
      },
      useCases: {
        label: "Casos de uso",
        headline: "Hecho para equipos pequeños de ecommerce que necesitan más volumen creativo.",
        items: [
          {
            title: "Páginas de producto",
            description: "Crea visuales más limpias para tu PDP sin una sesión de fotos completa.",
          },
          {
            title: "Anuncios pagados",
            description: "Genera múltiples ángulos visuales para probar en Meta, TikTok o experimentos creativos.",
          },
          {
            title: "Contenido orgánico",
            description: "Convierte una foto de producto en assets lifestyle y creativos para redes sociales.",
          },
        ],
      },
      cta: {
        label: "¿Listo para empezar?",
        headline: "Convierte tu foto de producto en un mockup comercial en segundos.",
        button: "Genera tu primer mockup gratis",
      },
    },

    // Upload page
    upload: {
      back: "← Inicio",
      title: "Sube tu producto",
      description: "Carga una imagen de tu producto, elige un preset y genera mockups listos para probar en tu tienda, anuncios o contenido.",
    },

    // Results page
    results: {
      back: "← Volver al upload",
      comparison: "Comparación",
      result: "Resultado",
    },

    // History page
    history: {
      title: "Historial de generaciones",
      newGeneration: "+ Nueva generación",
      empty: "No hay generaciones guardadas todavía.",
      createFirst: "Crear primer mockup",
      noPreview: "Sin preview",
      noName: "Sin nombre",
      liked: "Te gustó",
      disliked: "No te gustó",
    },

    // History detail page
    historyDetail: {
      back: "← Historial",
      generatedMockup: "Mockup generado",
      download: "Descargar",
      noImages: "Sin imágenes generadas",
      originalImage: "Imagen original",
      originalImageAlt: "Imagen original subida",
      noName: "Sin nombre",
      metaLabels: {
        preset: "Preset",
        category: "Categoría",
        format: "Formato",
        variant: "Variante",
        model: "Modelo",
        provider: "Proveedor",
        status: "Estado",
      },
      rating: "¿Cómo quedó?",
      newGeneration: "+ Nueva generación",
    },

    // Success page
    success: {
      badge: "Checkout success placeholder",
      title: "Tus mockups HD están desbloqueados",
      description: "Esta pantalla será la continuación del flujo después de Stripe. Aquí podremos mostrar descargas, CTA para generar más y upsell a packs adicionales.",
      viewResults: "Ver resultados",
      generateMore: "Generar más",
    },

    // Upload form
    form: {
      variants: [
        { label: "A · FLUX Dev", description: "Más rápido y barato, pero deforma más." },
        { label: "B · FLUX Pro", description: "Más caro, debería preservar mejor el producto." },
        { label: "C · GPT Image 1", description: "Vía fal, orientado a editar sin destruir el producto." },
        { label: "D · Nano Banana 2", description: "Edición de imagen con alta fidelidad al producto." },
      ],
      preloadedImage: "Imagen precargada. Puedes generar directo o reemplazarla subiendo otra.",
      productName: "Nombre del producto",
      productNamePlaceholder: "Ej: Vitamin C Serum",
      productCategory: "Categoría del producto",
      productCategoryPlaceholder: "Ej: skincare, candle, supplement",
      format: "Formato",
      formatOptions: {
        square: "1:1 Cuadrado",
        portrait: "4:5 Vertical",
        story: "9:16 Story (Instagram)",
      },
      modelMode: "Modo de modelo",
      comparingVariants: "Comparando variantes",
      compareVariants: "Comparar variantes",
      compareHint: "Selecciona al menos 2 variantes para comparar en paralelo.",
      compareWarning: "Selecciona al menos 2 variantes.",
      choosePreset: "Elige un preset",
      uploadFirst: "Primero sube una imagen válida y espera a que quede confirmada antes de generar, sobre todo para la variante C.",
      submitPreparing: "Preparando...",
      submitUploading: "Subiendo imagen...",
      submitCompare: "Comparar {n} variantes",
      submitGenerate: "Generar mockups",
    },

    // Results view
    resultsView: {
      badge: {
        compare: "MockForge Comparación",
        single: "MockForge Results",
      },
      title: {
        compareLoading: "Generando comparación de variantes...",
        compareWithErrors: "Comparación completada con errores",
        compareDone: "Comparación lista",
        singleLoading: "Generando tus mockups premium...",
        singleFailed: "No se pudieron generar los mockups",
        singleDone: "Tus mockups están listos",
      },
      subtitle: {
        compare: "Generando el mismo producto con múltiples modelos en paralelo para que puedas elegir el mejor resultado.",
        singleLoading: "Estamos creando versiones con look comercial a partir de tu imagen. Esto puede tardar unos segundos.",
        singleFailed: "Prueba con otra imagen del producto o vuelve al paso anterior para ajustar los datos.",
        singleDone: "Ya tienes previews listas para validar tu idea, enseñar a clientes o preparar tu siguiente iteración.",
      },
      createAnother: "Crear otra versión",
      openBest: "Abrir mejor resultado",
      statusLabel: "Estado",
      statusProcessing: "Procesando",
      statusCompleted: "Completado",
      badgeProcessing: "En curso",
      badgeReady: "Listo",
      variantLabel: "Variante",
      variantStatus: {
        processing: "En curso",
        failed: "Falló",
        completed: "Listo",
      },
      originalLabel: "Original",
      sourceImageTitle: "Imagen base",
      spinnerText: "Creando previews premium...",
      errorTitle: "Error de generación",
      errorTip: "Consejo: si esto pasó dentro de Telegram o de otro navegador embebido, abre MockForge en Chrome o Safari.",
      resultsLabel: "Resultados",
      generatedMockups: "Mockups generados",
      variants: "variantes",
      mockupLabel: "Mockup",
      previewReady: "Preview lista para revisar o compartir",
      download: "Descargar",
      upsell: {
        title: "Desbloquea más variantes y exports HD",
        description: "Si este resultado te sirve, el siguiente paso es convertir estas previews en un flujo comercial completo con más packs, mejor resolución y entregables listos para vender.",
        pack: "$9 · Desbloquear este pack",
        bundle: "$19 · Comprar 3 packs",
      },
      errors: {
        loadFailed: "La solicitud falló al cargar. Si abriste MockForge dentro de Telegram, prueba en Chrome o Safari y vuelve a intentar.",
        fetchFailed: "No se pudo conectar con el servidor. Revisa la conexión o intenta abrir MockForge fuera del navegador embebido.",
        fileNotFound: "La imagen fuente ya no existe en el servidor. Sube el producto otra vez e intenta de nuevo.",
      },
    },

    // Results summary
    resultsSummary: {
      preset: "Preset",
      category: "Categoría",
      format: "Formato",
      product: "Producto",
      noCategory: "Sin categoría",
      noProduct: "Producto sin nombre",
    },

    // Rating buttons
    rating: {
      like: "Útil",
      dislike: "No útil",
      likeTitle: "Me gusta",
      dislikeTitle: "No me gusta",
      likeAriaLabel: "Me gusta",
      dislikeAriaLabel: "No me gusta",
    },

    // File picker
    filePicker: {
      label: "Imagen del producto",
      formats: "PNG, JPG o WEBP",
      uploading: "· Subiendo...",
      placeholder: "La vista previa aparecerá aquí cuando selecciones una imagen",
      hint: "Usa una imagen real del producto. Si subes un archivo vacío, corrupto o demasiado pequeño, el sistema lo va a rechazar antes de generar.",
    },

    // Webview warning
    webviewWarning: {
      title: "Abre MockForge fuera de Telegram",
      message: "Parece que abriste MockForge dentro de un navegador embebido, como Telegram o Instagram. Ahí los uploads y requests a veces fallan.",
      openBrowser: "Abrir en navegador",
      copyLink: "Copiar link",
    },
  },
} as const;

export type Translations = (typeof translations)["en"];
