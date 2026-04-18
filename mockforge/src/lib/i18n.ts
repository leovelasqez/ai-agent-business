// Managed by MockForge i18n system
export type Language = "en" | "es" | "fr" | "pt" | "de";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const translations: Record<Language, Record<string, any>> = {
  en: {
    // Nav
    nav: {
      history: "History",
      generate: "Generate",
      howItWorks: "How it works",
      templates: "Templates",
      startFree: "Start free",
      switchToSpanish: "Switch to Spanish",
      switchToEnglish: "Switch to English",
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
      badge: "New mockup",
      productDetails: "Product details",
      presetDescription: "Select the visual style for your mockup",
      customSettings: "Custom model settings",
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
        { label: "A · Nano Banana 2", description: "Fast generation, high product fidelity." },
        { label: "B · GPT Image", description: "Precise editing, great with text and layouts." },
        { label: "C · FLUX.2 Pro", description: "Maximum realism, professional quality." },
        { label: "D · Personalizado", description: "Choose your model and write your own prompt." },
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
        landscape: "16:9 Landscape (TikTok)",
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
      customModel: "Model",
      customModelPlaceholder: "Select a model",
      customPrompt: "Prompt",
      customPromptPlaceholder: "Describe the style you want...",
      customPromptHint: "Your prompt completely replaces the automatic one.",
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
      dropHere: "Drop your product image here",
      releaseToUpload: "Release to upload",
      replaceImage: "Replace image",
      clickToBrowse: "Click to browse",
      uploadingStatus: "Uploading...",
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
      howItWorks: "Cómo funciona",
      templates: "Templates",
      startFree: "Empieza gratis",
      switchToSpanish: "Cambiar a español",
      switchToEnglish: "Cambiar a inglés",
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
      badge: "Nuevo mockup",
      productDetails: "Detalles del producto",
      presetDescription: "Selecciona el estilo visual para tu mockup",
      customSettings: "Configuración del modelo personalizado",
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
        { label: "A · Nano Banana 2", description: "Generación rápida, alta fidelidad al producto." },
        { label: "B · GPT Image", description: "Edición precisa, bueno con texto y layouts." },
        { label: "C · FLUX.2 Pro", description: "Máximo realismo, calidad profesional." },
        { label: "D · Personalizado", description: "Elige tu modelo y escribe tu propio prompt." },
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
        landscape: "16:9 Horizontal (TikTok)",
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
      customModel: "Modelo",
      customModelPlaceholder: "Selecciona un modelo",
      customPrompt: "Prompt",
      customPromptPlaceholder: "Describe el estilo que quieres...",
      customPromptHint: "Tu prompt reemplaza completamente el automático.",
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
      dropHere: "Suelta aquí la imagen de tu producto",
      releaseToUpload: "Suelta para subirla",
      replaceImage: "Reemplazar imagen",
      clickToBrowse: "Haz clic para buscar",
      uploadingStatus: "Subiendo...",
    },

    // Webview warning
    webviewWarning: {
      title: "Abre MockForge fuera de Telegram",
      message: "Parece que abriste MockForge dentro de un navegador embebido, como Telegram o Instagram. Ahí los uploads y requests a veces fallan.",
      openBrowser: "Abrir en navegador",
      copyLink: "Copiar link",
    },
  },
  fr: {
    nav: {
      history: "Historique", generate: "Générer", howItWorks: "Comment ça marche",
      templates: "Modèles", startFree: "Commencer gratuitement",
      switchToSpanish: "Passer à l'espagnol", switchToEnglish: "Passer à l'anglais",
    },
    landing: {
      badge: "Générateur de mockups e-commerce",
      headline: "Transformez une photo produit en mockups prêts à l'emploi.",
      subheadline: "Créez des photos studio, des scènes lifestyle et des créatifs pub sans photographe ni designer.",
      ctaPrimary: "Générez votre premier mockup gratuitement",
      ctaSecondary: "Voir comment ça marche",
      presetFooter: "3 presets · 4 variantes de modèle",
      presetBadge: "En direct",
      howItWorks: {
        steps: [
          ["1", "Importez votre produit", "Commencez par une image simple. Les photos nettes fonctionnent mieux."],
          ["2", "Choisissez un preset", "Studio, lifestyle ou créatif selon l'asset dont vous avez besoin."],
          ["3", "Déverrouillez la HD", "Vérifiez les aperçus, puis payez pour les exports haute résolution."],
        ],
        stepLabel: "Étape",
      },
      useCases: {
        label: "Cas d'usage",
        headline: "Fait pour les équipes e-commerce qui ont besoin de plus de volume créatif.",
        items: [
          { title: "Pages produit", description: "Créez des visuels plus propres pour vos fiches sans séance photo." },
          { title: "Publicités payantes", description: "Générez plusieurs angles visuels à tester sur Meta ou TikTok." },
          { title: "Contenu organique", description: "Transformez une photo en assets lifestyle pour les réseaux sociaux." },
        ],
      },
      cta: {
        label: "Prêt à commencer ?",
        headline: "Transformez votre photo produit en mockup commercial en quelques secondes.",
        button: "Générez votre premier mockup gratuitement",
      },
    },
    upload: {
      back: "← Accueil", title: "Importez votre produit",
      description: "Chargez une image, choisissez un preset et générez des mockups.",
      badge: "Nouveau mockup", productDetails: "Détails du produit",
      presetDescription: "Sélectionnez le style visuel pour votre mockup",
      customSettings: "Paramètres du modèle personnalisé",
    },
    results: { back: "← Retour à l'import", comparison: "Comparaison", result: "Résultat" },
    history: {
      title: "Historique des générations", newGeneration: "+ Nouvelle génération",
      empty: "Aucune génération sauvegardée.", createFirst: "Créer le premier mockup",
      noPreview: "Pas d'aperçu", noName: "Sans nom", liked: "Aimé", disliked: "Pas aimé",
    },
    historyDetail: {
      back: "← Historique", generatedMockup: "Mockup généré", download: "Télécharger",
      noImages: "Aucune image générée", originalImage: "Image originale",
      originalImageAlt: "Image originale importée", noName: "Sans nom",
      metaLabels: { preset: "Preset", category: "Catégorie", format: "Format", variant: "Variante", model: "Modèle", provider: "Fournisseur", status: "Statut" },
      rating: "Comment s'est passée la génération ?", newGeneration: "+ Nouvelle génération",
    },
    success: {
      badge: "Paiement réussi", title: "Vos mockups HD sont déverrouillés",
      description: "Téléchargez vos exports haute résolution.", viewResults: "Voir les résultats", generateMore: "Générer plus",
    },
    form: {
      variants: [
        { label: "A · Nano Banana 2", description: "Génération rapide, haute fidélité produit." },
        { label: "B · GPT Image", description: "Édition précise, excellent pour le texte." },
        { label: "C · FLUX.2 Pro", description: "Réalisme maximum, qualité professionnelle." },
        { label: "D · Personnalisé", description: "Choisissez votre modèle et rédigez votre prompt." },
      ],
      preloadedImage: "Image pré-chargée. Générez directement ou remplacez-la.",
      productName: "Nom du produit", productNamePlaceholder: "Ex : Sérum Vitamine C",
      productCategory: "Catégorie", productCategoryPlaceholder: "Ex : skincare, bougie",
      format: "Format",
      formatOptions: { square: "1:1 Carré", portrait: "4:5 Portrait", story: "9:16 Story", landscape: "16:9 Paysage" },
      modelMode: "Mode modèle", comparingVariants: "Comparaison en cours",
      compareVariants: "Comparer les variantes", compareHint: "Sélectionnez au moins 2 variantes.",
      compareWarning: "Sélectionnez au moins 2 variantes.", choosePreset: "Choisissez un preset",
      uploadFirst: "Importez d'abord une image valide avant de générer.",
      submitPreparing: "Préparation...", submitUploading: "Import en cours...",
      submitCompare: "Comparer {n} variantes", submitGenerate: "Générer les mockups",
      customModel: "Modèle", customModelPlaceholder: "Sélectionnez un modèle",
      customPrompt: "Prompt", customPromptPlaceholder: "Décrivez le style souhaité...",
      customPromptHint: "Votre prompt remplace complètement le prompt automatique.",
      batchAll: "Batch A+B+C",
    },
    resultsView: {
      badge: { compare: "MockForge Comparaison", single: "MockForge Résultats" },
      title: {
        compareLoading: "Comparaison des variantes en cours...", compareWithErrors: "Comparaison terminée avec des erreurs",
        compareDone: "Comparaison prête", singleLoading: "Génération de vos mockups premium...",
        singleFailed: "Impossible de générer les mockups", singleDone: "Vos mockups sont prêts",
      },
      subtitle: {
        compare: "Génération du même produit avec plusieurs modèles en parallèle.",
        singleLoading: "Création de versions commerciales à partir de votre image.",
        singleFailed: "Essayez avec une autre image ou retournez ajuster les données.",
        singleDone: "Aperçus prêts à valider votre idée ou présenter à des clients.",
      },
      createAnother: "Créer une autre version", openBest: "Ouvrir le meilleur résultat",
      statusLabel: "Statut", statusProcessing: "En cours", statusCompleted: "Terminé",
      badgeProcessing: "En cours", badgeReady: "Prêt", variantLabel: "Variante",
      variantStatus: { processing: "En cours", failed: "Échoué", completed: "Prêt" },
      originalLabel: "Original", sourceImageTitle: "Image source",
      spinnerText: "Création des aperçus premium...", errorTitle: "Erreur de génération",
      errorTip: "Conseil : si cela s'est produit dans Telegram, ouvrez MockForge dans Chrome ou Safari.",
      resultsLabel: "Résultats", generatedMockups: "Mockups générés", variants: "variantes",
      mockupLabel: "Mockup", previewReady: "Aperçu prêt à revoir ou partager", download: "Télécharger",
      upsell: {
        title: "Déverrouillez plus de variantes et d'exports HD",
        description: "Si ce résultat vous convient, passez à l'étape suivante avec plus de packs et une meilleure résolution.",
        pack: "9 € · Déverrouiller ce pack", bundle: "19 € · Acheter 3 packs",
      },
      errors: {
        loadFailed: "La requête a échoué. Si vous avez ouvert MockForge dans Telegram, essayez dans Chrome ou Safari.",
        fetchFailed: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
        fileNotFound: "L'image source n'existe plus sur le serveur. Importez à nouveau le produit.",
      },
    },
    resultsSummary: { preset: "Preset", category: "Catégorie", format: "Format", product: "Produit", noCategory: "Sans catégorie", noProduct: "Produit sans nom" },
    rating: { like: "Utile", dislike: "Pas utile", likeTitle: "J'aime", dislikeTitle: "Je n'aime pas", likeAriaLabel: "J'aime", dislikeAriaLabel: "Je n'aime pas" },
    filePicker: {
      label: "Image du produit", formats: "PNG, JPG ou WEBP", uploading: "· Importation...",
      placeholder: "L'aperçu apparaîtra ici", hint: "Utilisez une vraie image produit.",
      dropHere: "Déposez votre image ici", releaseToUpload: "Relâchez pour importer",
      replaceImage: "Remplacer l'image", clickToBrowse: "Cliquez pour parcourir", uploadingStatus: "Importation...",
    },
    webviewWarning: {
      title: "Ouvrez MockForge en dehors de Telegram",
      message: "Vous semblez utiliser un navigateur intégré. Les uploads peuvent échouer dans ce contexte.",
      openBrowser: "Ouvrir dans le navigateur", copyLink: "Copier le lien",
    },
  },

  pt: {
    nav: {
      history: "Histórico", generate: "Gerar", howItWorks: "Como funciona",
      templates: "Modelos", startFree: "Começar grátis",
      switchToSpanish: "Mudar para espanhol", switchToEnglish: "Mudar para inglês",
    },
    landing: {
      badge: "Gerador de mockups e-commerce",
      headline: "Transforme uma foto de produto em mockups prontos para usar.",
      subheadline: "Crie fotos de estúdio, cenas lifestyle e criativos para anúncios sem fotógrafo ou designer.",
      ctaPrimary: "Gere seu primeiro mockup grátis",
      ctaSecondary: "Ver como funciona",
      presetFooter: "3 presets · 4 variantes de modelo",
      presetBadge: "Ao vivo",
      howItWorks: {
        steps: [
          ["1", "Envie seu produto", "Comece com uma imagem simples. Fotos limpas funcionam melhor."],
          ["2", "Escolha um preset", "Studio, lifestyle ou criativo conforme o asset que você precisa."],
          ["3", "Desbloqueie o HD", "Revise os previews e pague para desbloquear exports em alta resolução."],
        ],
        stepLabel: "Passo",
      },
      useCases: {
        label: "Casos de uso",
        headline: "Feito para equipes de e-commerce que precisam de mais volume criativo.",
        items: [
          { title: "Páginas de produto", description: "Crie visuais mais limpos para seu PDP sem sessão de fotos." },
          { title: "Anúncios pagos", description: "Gere múltiplos ângulos visuais para testar no Meta ou TikTok." },
          { title: "Conteúdo orgânico", description: "Transforme uma foto em assets lifestyle para redes sociais." },
        ],
      },
      cta: {
        label: "Pronto para começar?",
        headline: "Transforme sua foto de produto em um mockup comercial em segundos.",
        button: "Gere seu primeiro mockup grátis",
      },
    },
    upload: {
      back: "← Início", title: "Envie seu produto",
      description: "Carregue uma imagem, escolha um preset e gere mockups.",
      badge: "Novo mockup", productDetails: "Detalhes do produto",
      presetDescription: "Selecione o estilo visual do seu mockup",
      customSettings: "Configurações do modelo personalizado",
    },
    results: { back: "← Voltar ao upload", comparison: "Comparação", result: "Resultado" },
    history: {
      title: "Histórico de gerações", newGeneration: "+ Nova geração",
      empty: "Nenhuma geração salva ainda.", createFirst: "Criar primeiro mockup",
      noPreview: "Sem preview", noName: "Sem nome", liked: "Gostou", disliked: "Não gostou",
    },
    historyDetail: {
      back: "← Histórico", generatedMockup: "Mockup gerado", download: "Baixar",
      noImages: "Nenhuma imagem gerada", originalImage: "Imagem original",
      originalImageAlt: "Imagem original enviada", noName: "Sem nome",
      metaLabels: { preset: "Preset", category: "Categoria", format: "Formato", variant: "Variante", model: "Modelo", provider: "Provedor", status: "Status" },
      rating: "Como ficou?", newGeneration: "+ Nova geração",
    },
    success: {
      badge: "Pagamento concluído", title: "Seus mockups HD estão desbloqueados",
      description: "Baixe seus exports em alta resolução.", viewResults: "Ver resultados", generateMore: "Gerar mais",
    },
    form: {
      variants: [
        { label: "A · Nano Banana 2", description: "Geração rápida, alta fidelidade ao produto." },
        { label: "B · GPT Image", description: "Edição precisa, ótimo para texto e layouts." },
        { label: "C · FLUX.2 Pro", description: "Máximo realismo, qualidade profissional." },
        { label: "D · Personalizado", description: "Escolha seu modelo e escreva seu próprio prompt." },
      ],
      preloadedImage: "Imagem pré-carregada. Gere diretamente ou substitua por outra.",
      productName: "Nome do produto", productNamePlaceholder: "Ex.: Sérum Vitamina C",
      productCategory: "Categoria do produto", productCategoryPlaceholder: "Ex.: skincare, vela",
      format: "Formato",
      formatOptions: { square: "1:1 Quadrado", portrait: "4:5 Retrato", story: "9:16 Story", landscape: "16:9 Paisagem" },
      modelMode: "Modo de modelo", comparingVariants: "Comparando variantes",
      compareVariants: "Comparar variantes", compareHint: "Selecione pelo menos 2 variantes.",
      compareWarning: "Selecione pelo menos 2 variantes.", choosePreset: "Escolha um preset",
      uploadFirst: "Envie uma imagem válida antes de gerar.",
      submitPreparing: "Preparando...", submitUploading: "Enviando imagem...",
      submitCompare: "Comparar {n} variantes", submitGenerate: "Gerar mockups",
      customModel: "Modelo", customModelPlaceholder: "Selecione um modelo",
      customPrompt: "Prompt", customPromptPlaceholder: "Descreva o estilo que você quer...",
      customPromptHint: "Seu prompt substitui completamente o automático.",
      batchAll: "Batch A+B+C",
    },
    resultsView: {
      badge: { compare: "MockForge Comparação", single: "MockForge Resultados" },
      title: {
        compareLoading: "Gerando comparação de variantes...", compareWithErrors: "Comparação concluída com erros",
        compareDone: "Comparação pronta", singleLoading: "Gerando seus mockups premium...",
        singleFailed: "Não foi possível gerar os mockups", singleDone: "Seus mockups estão prontos",
      },
      subtitle: {
        compare: "Gerando o mesmo produto com vários modelos em paralelo.",
        singleLoading: "Criando versões com visual comercial a partir da sua imagem.",
        singleFailed: "Tente com outra imagem ou volte para ajustar os dados.",
        singleDone: "Previews prontos para validar sua ideia ou mostrar a clientes.",
      },
      createAnother: "Criar outra versão", openBest: "Abrir melhor resultado",
      statusLabel: "Status", statusProcessing: "Processando", statusCompleted: "Concluído",
      badgeProcessing: "Em progresso", badgeReady: "Pronto", variantLabel: "Variante",
      variantStatus: { processing: "Em progresso", failed: "Falhou", completed: "Pronto" },
      originalLabel: "Original", sourceImageTitle: "Imagem base",
      spinnerText: "Criando previews premium...", errorTitle: "Erro de geração",
      errorTip: "Dica: se isso ocorreu no Telegram, abra o MockForge no Chrome ou Safari.",
      resultsLabel: "Resultados", generatedMockups: "Mockups gerados", variants: "variantes",
      mockupLabel: "Mockup", previewReady: "Preview pronto para revisar ou compartilhar", download: "Baixar",
      upsell: {
        title: "Desbloqueie mais variantes e exports HD",
        description: "Se esse resultado funcionar, o próximo passo é converter em um fluxo comercial completo.",
        pack: "R$9 · Desbloquear este pack", bundle: "R$19 · Comprar 3 packs",
      },
      errors: {
        loadFailed: "A solicitação falhou. Se você abriu no Telegram, tente no Chrome ou Safari.",
        fetchFailed: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        fileNotFound: "A imagem fonte não existe mais no servidor. Envie o produto novamente.",
      },
    },
    resultsSummary: { preset: "Preset", category: "Categoria", format: "Formato", product: "Produto", noCategory: "Sem categoria", noProduct: "Produto sem nome" },
    rating: { like: "Útil", dislike: "Não útil", likeTitle: "Gostei", dislikeTitle: "Não gostei", likeAriaLabel: "Gostei", dislikeAriaLabel: "Não gostei" },
    filePicker: {
      label: "Imagem do produto", formats: "PNG, JPG ou WEBP", uploading: "· Enviando...",
      placeholder: "O preview aparecerá aqui", hint: "Use uma imagem real do produto.",
      dropHere: "Solte sua imagem aqui", releaseToUpload: "Solte para enviar",
      replaceImage: "Substituir imagem", clickToBrowse: "Clique para procurar", uploadingStatus: "Enviando...",
    },
    webviewWarning: {
      title: "Abra o MockForge fora do Telegram",
      message: "Parece que você abriu o MockForge em um navegador embutido. Uploads podem falhar nesse contexto.",
      openBrowser: "Abrir no navegador", copyLink: "Copiar link",
    },
  },

  de: {
    nav: {
      history: "Verlauf", generate: "Generieren", howItWorks: "Wie es funktioniert",
      templates: "Vorlagen", startFree: "Kostenlos starten",
      switchToSpanish: "Zu Spanisch wechseln", switchToEnglish: "Zu Englisch wechseln",
    },
    landing: {
      badge: "E-Commerce Mockup-Generator",
      headline: "Verwandeln Sie ein Produktfoto in nutzbare Mockups.",
      subheadline: "Erstellen Sie Studioaufnahmen, Lifestyle-Szenen und Werbekreative ohne Fotograf oder Designer.",
      ctaPrimary: "Erstes Mockup kostenlos generieren",
      ctaSecondary: "Wie es funktioniert",
      presetFooter: "3 Presets · 4 Modellvarianten",
      presetBadge: "Live",
      howItWorks: {
        steps: [
          ["1", "Produkt hochladen", "Beginnen Sie mit einem einfachen Produktbild. Saubere Fotos funktionieren am besten."],
          ["2", "Preset wählen", "Studio, Lifestyle oder Werbung – je nach benötigtem Asset."],
          ["3", "HD freischalten", "Vorschauen prüfen, dann zahlen, um HD-Exporte freizuschalten."],
        ],
        stepLabel: "Schritt",
      },
      useCases: {
        label: "Anwendungsfälle",
        headline: "Entwickelt für kleine E-Commerce-Teams, die mehr kreatives Volumen benötigen.",
        items: [
          { title: "Produktseiten", description: "Sauberere Produktbilder für Ihre PDP ohne aufwändiges Fotoshooting." },
          { title: "Bezahlte Anzeigen", description: "Mehrere visuelle Winkel für Tests auf Meta oder TikTok generieren." },
          { title: "Organische Inhalte", description: "Ein Produktfoto in Lifestyle-Assets für soziale Medien verwandeln." },
        ],
      },
      cta: {
        label: "Bereit anzufangen?",
        headline: "Verwandeln Sie Ihr Produktfoto in Sekunden in ein kommerzielles Mockup.",
        button: "Erstes Mockup kostenlos generieren",
      },
    },
    upload: {
      back: "← Startseite", title: "Produkt hochladen",
      description: "Bild laden, Preset wählen und Mockups generieren.",
      badge: "Neues Mockup", productDetails: "Produktdetails",
      presetDescription: "Visuellen Stil für Ihr Mockup auswählen",
      customSettings: "Einstellungen des benutzerdefinierten Modells",
    },
    results: { back: "← Zurück zum Upload", comparison: "Vergleich", result: "Ergebnis" },
    history: {
      title: "Generierungsverlauf", newGeneration: "+ Neue Generierung",
      empty: "Noch keine gespeicherten Generierungen.", createFirst: "Erstes Mockup erstellen",
      noPreview: "Keine Vorschau", noName: "Kein Name", liked: "Gefiel", disliked: "Gefiel nicht",
    },
    historyDetail: {
      back: "← Verlauf", generatedMockup: "Generiertes Mockup", download: "Herunterladen",
      noImages: "Keine generierten Bilder", originalImage: "Originalbild",
      originalImageAlt: "Hochgeladenes Originalbild", noName: "Kein Name",
      metaLabels: { preset: "Preset", category: "Kategorie", format: "Format", variant: "Variante", model: "Modell", provider: "Anbieter", status: "Status" },
      rating: "Wie ist es geworden?", newGeneration: "+ Neue Generierung",
    },
    success: {
      badge: "Zahlung erfolgreich", title: "Ihre HD-Mockups sind freigeschaltet",
      description: "Laden Sie Ihre hochauflösenden Exporte herunter.", viewResults: "Ergebnisse anzeigen", generateMore: "Mehr generieren",
    },
    form: {
      variants: [
        { label: "A · Nano Banana 2", description: "Schnelle Generierung, hohe Produkttreue." },
        { label: "B · GPT Image", description: "Präzise Bearbeitung, sehr gut für Text." },
        { label: "C · FLUX.2 Pro", description: "Maximaler Realismus, professionelle Qualität." },
        { label: "D · Benutzerdefiniert", description: "Wählen Sie Ihr Modell und schreiben Sie Ihren eigenen Prompt." },
      ],
      preloadedImage: "Vorgeladenes Bild. Direkt generieren oder durch ein anderes ersetzen.",
      productName: "Produktname", productNamePlaceholder: "z.B.: Vitamin-C-Serum",
      productCategory: "Produktkategorie", productCategoryPlaceholder: "z.B.: Hautpflege, Kerze",
      format: "Format",
      formatOptions: { square: "1:1 Quadrat", portrait: "4:5 Hochformat", story: "9:16 Story", landscape: "16:9 Querformat" },
      modelMode: "Modell-Modus", comparingVariants: "Varianten werden verglichen",
      compareVariants: "Varianten vergleichen", compareHint: "Mindestens 2 Varianten auswählen.",
      compareWarning: "Mindestens 2 Varianten auswählen.", choosePreset: "Preset wählen",
      uploadFirst: "Bitte laden Sie zuerst ein gültiges Bild hoch, bevor Sie generieren.",
      submitPreparing: "Vorbereitung...", submitUploading: "Bild wird hochgeladen...",
      submitCompare: "{n} Varianten vergleichen", submitGenerate: "Mockups generieren",
      customModel: "Modell", customModelPlaceholder: "Modell auswählen",
      customPrompt: "Prompt", customPromptPlaceholder: "Beschreiben Sie den gewünschten Stil...",
      customPromptHint: "Ihr Prompt ersetzt den automatischen Prompt vollständig.",
      batchAll: "Batch A+B+C",
    },
    resultsView: {
      badge: { compare: "MockForge Vergleich", single: "MockForge Ergebnisse" },
      title: {
        compareLoading: "Variantenvergleich wird generiert...", compareWithErrors: "Vergleich mit Fehlern abgeschlossen",
        compareDone: "Vergleich bereit", singleLoading: "Ihre Premium-Mockups werden generiert...",
        singleFailed: "Mockups konnten nicht generiert werden", singleDone: "Ihre Mockups sind bereit",
      },
      subtitle: {
        compare: "Dasselbe Produkt mit mehreren Modellen parallel generieren.",
        singleLoading: "Kommerzielle Versionen aus Ihrem Bild werden erstellt.",
        singleFailed: "Versuchen Sie es mit einem anderen Bild oder passen Sie die Daten an.",
        singleDone: "Vorschauen bereit zur Validierung Ihrer Idee oder Präsentation bei Kunden.",
      },
      createAnother: "Weitere Version erstellen", openBest: "Bestes Ergebnis öffnen",
      statusLabel: "Status", statusProcessing: "In Bearbeitung", statusCompleted: "Abgeschlossen",
      badgeProcessing: "In Bearbeitung", badgeReady: "Bereit", variantLabel: "Variante",
      variantStatus: { processing: "In Bearbeitung", failed: "Fehlgeschlagen", completed: "Bereit" },
      originalLabel: "Original", sourceImageTitle: "Quellbild",
      spinnerText: "Premium-Vorschauen werden erstellt...", errorTitle: "Generierungsfehler",
      errorTip: "Tipp: Wenn dies in Telegram passiert ist, öffnen Sie MockForge in Chrome oder Safari.",
      resultsLabel: "Ergebnisse", generatedMockups: "Generierte Mockups", variants: "Varianten",
      mockupLabel: "Mockup", previewReady: "Vorschau bereit zum Überprüfen oder Teilen", download: "Herunterladen",
      upsell: {
        title: "Mehr Varianten und HD-Exporte freischalten",
        description: "Wenn dieses Ergebnis für Sie passt, ist der nächste Schritt ein vollständiger kommerzieller Workflow.",
        pack: "9 € · Dieses Pack freischalten", bundle: "19 € · 3 Packs kaufen",
      },
      errors: {
        loadFailed: "Die Anfrage konnte nicht geladen werden. In Telegram geöffnet? Versuchen Sie Chrome oder Safari.",
        fetchFailed: "Verbindung zum Server nicht möglich. Überprüfen Sie Ihre Verbindung.",
        fileNotFound: "Das Quellbild existiert nicht mehr auf dem Server. Laden Sie das Produkt erneut hoch.",
      },
    },
    resultsSummary: { preset: "Preset", category: "Kategorie", format: "Format", product: "Produkt", noCategory: "Keine Kategorie", noProduct: "Produkt ohne Namen" },
    rating: { like: "Nützlich", dislike: "Nicht nützlich", likeTitle: "Gefällt mir", dislikeTitle: "Gefällt mir nicht", likeAriaLabel: "Gefällt mir", dislikeAriaLabel: "Gefällt mir nicht" },
    filePicker: {
      label: "Produktbild", formats: "PNG, JPG oder WEBP", uploading: "· Wird hochgeladen...",
      placeholder: "Vorschau erscheint hier", hint: "Verwenden Sie ein echtes Produktbild.",
      dropHere: "Produktbild hier ablegen", releaseToUpload: "Zum Hochladen loslassen",
      replaceImage: "Bild ersetzen", clickToBrowse: "Klicken Sie zum Durchsuchen", uploadingStatus: "Wird hochgeladen...",
    },
    webviewWarning: {
      title: "MockForge außerhalb von Telegram öffnen",
      message: "Es sieht aus, als ob Sie MockForge in einem eingebetteten Browser geöffnet haben. Uploads können dort fehlschlagen.",
      openBrowser: "Im Browser öffnen", copyLink: "Link kopieren",
    },
  },
} as const;

export type Translations = (typeof translations)["en"];
