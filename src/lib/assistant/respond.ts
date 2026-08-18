import { products } from "@/data/products";
import { defaultProductConfig } from "@/lib/images";
import { calculatePriceBreakdown, formatPrice } from "@/lib/pricing";
import { getProductTypeLabel } from "@/lib/productDisplay";
import type { Product } from "@/types";
import {
  CATEGORY_OVERVIEW,
  COLLECTION_TRAITS,
  COMPANY,
  FABRIC_BRANDS,
  LOGISTICS,
  SHOWROOM,
  STRUCTURE_FACTS,
  type CollectionSlug,
  type FabricSlug,
} from "@/lib/assistant/facts";
import type { AssistantIntent } from "@/lib/assistant/types";
import type { TopicId } from "@/lib/assistant/topicMatcher";
import { MESA_SKORPHIO_LIVING } from "@/data/knowledge-base";

function isMesaSkorphioLiving(product: Product): boolean {
  return product.id === "mesa-skorphio";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function productDisplayName(product: Product): string {
  const type = getProductTypeLabel(product);
  if (product.name.toLowerCase().startsWith(type.toLowerCase())) {
    return product.name;
  }
  return `${type} ${product.name}`;
}

export function respondShowroom(trimmed?: string): string {
  const n = trimmed
    ? trimmed
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";

  const locationOnly =
    /\b(donde\s+estan|donde\s+queda|ubicacion|direccion|como\s+llegar)\b/.test(
      n
    ) &&
    !/\b(visitar|visita|ver\s+(los\s+)?muebles|showroom|puedo\s+visitar)\b/.test(
      n
    );

  if (locationOnly) {
    return `Nuestro showroom está en ${SHOWROOM.full}. Podés visitarnos coordinando previamente o usar el mapa para llegar.`;
  }

  return `Podés conocer materiales, telas y colecciones en nuestro showroom de ${SHOWROOM.full}. Coordinamos visitas con anticipación y también podemos asesorarte por WhatsApp antes de tu visita.`;
}

export function respondWebsite(): string {
  return "Podés explorar las distintas categorías desde Productos. Elegí una colección, personalizá estructura, tela y configuración, y visualizá los cambios directamente en pantalla. También podés ampliar imágenes, agregar al carrito o solicitar asesoramiento en cualquier momento.";
}

export function respondQuote(): string {
  return "Con gusto te armamos una cotización según la configuración que elijas. Podés hacerlo desde el carrito o escribirnos directamente por WhatsApp con el detalle de tu proyecto.";
}

export function respondBuy(): string {
  return "Podés explorar todas las colecciones en Productos, personalizar cada modelo y agregarlo al carrito cuando tengas la configuración lista.";
}

export function respondAdvisor(): string {
  return "Con gusto. Nuestro equipo puede asesorarte de forma personalizada según tu espacio, uso y estilo.";
}

export function respondOxidation(): string {
  return "No. Las estructuras están fabricadas en aluminio, un material que no se oxida como el hierro. Además utilizamos terminaciones especialmente desarrolladas para uso exterior.";
}

export function respondOutdoorPermanent(): string {
  return "Sí. Los muebles Maldivas Outdoor fueron diseñados para uso exterior permanente. Los materiales seleccionados están preparados para soportar sol, humedad y condiciones climáticas normales.";
}

export function respondFabricRecommendation(): string {
  return "Las tres opciones —Sunbrella, Agora y Bliss— son aptas para exterior, con resistencia UV, buen comportamiento frente a la humedad y facilidad de limpieza. Si buscás máxima trayectoria y reconocimiento internacional, Sunbrella es una excelente alternativa. Contame si el espacio tiene mucho sol o uso intensivo y te oriento con más detalle.";
}

export function respondCompany(): string {
  return `${COMPANY.name} es una marca de muebles de exterior premium de ${COMPANY.location}, con fabricación propia y diseño atemporal. Personalizamos estructura, tapizado y terminaciones en cada colección para espacios que perduran.`;
}

export function respondPrice(product: Product): string {
  const config = defaultProductConfig(product);
  const breakdown = calculatePriceBreakdown(product, config);
  const name = productDisplayName(product);
  const size = product.sizes.find((s) => s.id === config.sizeId);

  if (!breakdown) {
    return `Para ${name}, el precio queda en A cotizar según la configuración elegida. Coordiná con nuestro equipo. ${LOGISTICS.priceDisclaimer}.`;
  }

  const parts = [
    `El ${name} tiene un precio de lista de ${formatPrice(breakdown.list)} en configuración base`,
  ];

  if (size?.dimensions) {
    parts.push(`(${size.label}: ${size.dimensions})`);
  }

  parts.push(
    `En efectivo con 30% OFF: ${formatPrice(breakdown.cash)}. En transferencia con 15% OFF: ${formatPrice(breakdown.transfer)}.`
  );

  if (product.fabrics.length > 0) {
    parts.push("El valor varía según estructura y tamaño; la tela no modifica el precio");
  } else if (isMesaSkorphioLiving(product)) {
    parts.push(
      "Las tres opciones de piedra Infinity comparten el mismo precio de lista"
    );
  } else if (product.category === "mesas") {
    parts.push("El valor varía según la estructura elegida");
  } else if (product.customizableSize) {
    parts.push(
      "En mesas, el precio se define según medida y piedra seleccionadas"
    );
  }

  parts.push(LOGISTICS.priceDisclaimer + ".");

  return parts.join(". ").replace(/\.\./g, ".");
}

export function respondProductInfo(product: Product): string {
  const name = productDisplayName(product);
  const trait = COLLECTION_TRAITS[product.slug as CollectionSlug];
  const traitLine = trait
    ? ` Se distingue por ${trait}.`
    : "";

  const configBits: string[] = [];
  if (product.sizes.length > 1) {
    configBits.push(
      `disponible en ${product.sizes.map((s) => s.label.toLowerCase()).join(" o ")}`
    );
  }
  if (product.structures.length > 1) {
    configBits.push("varias terminaciones de estructura");
  }
  if (product.fabrics.length > 0) {
    configBits.push("tapizado personalizable");
  }
  if (product.mesaStoneModels?.length) {
    configBits.push(
      `piedra ${MESA_SKORPHIO_LIVING.stoneBrand} (${product.mesaStoneModels.map((m) => m.label).join(", ")})`
    );
  }
  if (product.fixedMeasure && product.sizes[0]?.dimensions) {
    configBits.push(`medida ${product.sizes[0].dimensions}`);
  }
  if (product.customizableSize) {
    configBits.push("medida y piedra a elección");
  }

  const configLine =
    configBits.length > 0
      ? ` Podés configurarlo con ${configBits.join(", ")} desde su ficha en la web.`
      : "";

  return `${name}: ${product.description}${traitLine}${configLine}`;
}

export function respondCategoryOverview(
  category: keyof typeof CATEGORY_OVERVIEW
): string {
  const info = CATEGORY_OVERVIEW[category];
  return `En ${info.label} trabajamos las colecciones ${info.collections}: ${info.summary}. Podés explorar cada modelo, personalizarlo y ver el precio estimativo actualizado en la sección Productos.`;
}

export function respondCompare(
  slugA: CollectionSlug,
  slugB: CollectionSlug,
  categoryHint?: Product["category"]
): string | null {
  const pick = (slug: CollectionSlug) => {
    const candidates = products.filter((p) => p.slug === slug);
    if (categoryHint) {
      return candidates.find((p) => p.category === categoryHint) ?? candidates[0];
    }
    return candidates[0];
  };

  const productA = pick(slugA);
  const productB = pick(slugB);
  if (!productA || !productB) return null;

  const traitA = COLLECTION_TRAITS[slugA];
  const traitB = COLLECTION_TRAITS[slugB];

  if (productA.category === productB.category) {
    return `${capitalize(productA.name)} apuesta por ${traitA}, mientras que ${productB.name} se orienta a ${traitB}. En términos de uso, ${productA.description.split(".")[0].toLowerCase()}; ${productB.name}, por su parte, ${productB.description.charAt(0).toLowerCase()}${productB.description.slice(1).split(".")[0]}. Si querés, puedo orientarte según el espacio que tenés disponible.`;
  }

  return `${capitalize(slugA)} (${traitA}) y ${capitalize(slugB)} (${traitB}) pertenecen a líneas distintas de Maldivas Outdoor. Para una comparación más precisa, indicame si te interesa reposeras, living, mesas o comedor.`;
}

export function respondCompareFabrics(a: FabricSlug, b: FabricSlug): string {
  const brandA = FABRIC_BRANDS[a];
  const brandB = FABRIC_BRANDS[b];
  return `${brandA.name} se destaca por ${brandA.traits}. ${brandB.name}, en cambio, ofrece ${brandB.traits}. Ambas son opciones outdoor premium; la elección depende del uso previsto, la exposición al sol y la estética que buscás para tu proyecto.`;
}

export function respondCompareStructures(): string {
  return `El aluminio pintado brinda una terminación uniforme y contemporánea —ideal si buscás negro, greige o blanco con presencia actual. El anodizado modifica la superficie del aluminio para mayor resistencia y una estética más sofisticada, con opciones como negro lijado, peltre lijado o natural. El símil madera aporta calidez visual manteniendo la durabilidad del aluminio. La disponibilidad varía según el modelo.`;
}

export function respondConfiguration(product?: Product): string {
  if (product) {
    const name = productDisplayName(product);
    const lines: string[] = [
      `Para el ${name} podés elegir`,
    ];
    const opts: string[] = [];
    if (product.sizes.length) {
      opts.push(
        `tamaño (${product.sizes.map((s) => `${s.label} ${s.dimensions}`).join("; ")})`
      );
    }
    if (product.structures.length > 1) {
      opts.push(
        `estructura (${product.structures.map((s) => s.label).join(", ")})`
      );
    }
    if (product.fabrics.length) {
      opts.push(
        `tapizado (${product.fabrics.map((f) => f.label).join(", ")})`
      );
    }
    if (product.mesaStoneModels?.length) {
      opts.push(
        `piedra ${MESA_SKORPHIO_LIVING.stoneBrand} (${product.mesaStoneModels.map((m) => m.label).join(", ")})`
      );
    }
    if (product.stoneBrands?.length) {
      opts.push(
        `piedra (${product.stoneBrands.map((b) => b.label).join(", ")})`
      );
    }
    if (product.customizableSize) {
      opts.push("medida personalizada");
    }
    return `${lines[0]} ${opts.join(", ")}. El configurador de la web actualiza el precio estimativo en tiempo real según cada elección.`;
  }

  return "En reposeras y sillones podés elegir tamaño, estructura y tapizado. En mesas, medida y piedra sinterizada. Cada ficha de producto tiene un configurador que muestra el precio estimativo según tu selección.";
}

export function respondFabrics(): string {
  const brands = Object.values(FABRIC_BRANDS)
    .map((b) => `${b.name} (${b.traits})`)
    .join("; ");
  return `Trabajamos telas outdoor premium: ${brands}. Los colores de tapizado varían según el modelo (negro, gris, beige, blanco). Para limpieza, recomendamos agua y jabón neutro. También podés solicitar muestras de tela coordinando con nuestro equipo.`;
}

export function respondStructures(): string {
  return `${STRUCTURE_FACTS.anodizado.label}: ${STRUCTURE_FACTS.anodizado.traits} (${STRUCTURE_FACTS.anodizado.variants.join(", ")}). ${STRUCTURE_FACTS.pintado.label}: ${STRUCTURE_FACTS.pintado.traits} (${STRUCTURE_FACTS.pintado.variants.join(", ")}). ${STRUCTURE_FACTS["simil-madera"].label}: ${STRUCTURE_FACTS["simil-madera"].traits}. La disponibilidad depende del modelo elegido.`;
}

export function respondMaterials(): string {
  return "Fabricamos en aluminio Aluar con terminaciones pintadas o anodizadas, telas acrílicas outdoor de alta resistencia UV y goma espuma Piero Soft de alta densidad. Todo el sistema está pensado para uso exterior permanente: no se oxida como el hierro y soporta sol, humedad y zonas de piscina con el mantenimiento adecuado.";
}

export function respondShipping(): string {
  return "Sí. Realizamos envíos a distintas ciudades de Argentina mediante transportes especializados. Los muebles viajan protegidos para minimizar riesgos durante el transporte.";
}

export function respondTimeline(): string {
  return `${capitalize(LOGISTICS.timeline)}. Si tenés una fecha objetivo para tu proyecto, conviene consultarnos con anticipación para planificar la fabricación.`;
}

export function respondPayment(): string {
  return "Trabajamos con distintos medios de pago. Podemos informarte las opciones vigentes al momento de la compra, incluyendo beneficios por pago contado según promociones activas.";
}

export function respondWarranty(): string {
  return "Sí. Todos nuestros productos cuentan con garantía contra defectos de fabricación.";
}

export function respondPurchase(): string {
  return "Personalizá cada producto en su ficha, agregalo al carrito y solicitá cotización con el detalle de tu configuración. También podés escribirnos por WhatsApp o visitar el showroom antes de decidir.";
}

export function respondTopic(topic: TopicId): string {
  switch (topic) {
    case "oxidation":
      return respondOxidation();
    case "outdoor_permanent":
      return respondOutdoorPermanent();
    case "fabric_recommend":
      return respondFabricRecommendation();
    case "fabric_fade":
      return "Trabajamos con telas outdoor premium seleccionadas por su alta resistencia UV. Con uso normal y mantenimiento adecuado, conservan color y apariencia durante muchos años.";
    case "fabric_outdoor_vs_common":
      return "Las telas outdoor están desarrolladas para resistir radiación UV, humedad y manchas superficiales, con mayor estabilidad dimensional que una tela común. Por eso son la opción correcta para muebles de exterior permanente.";
    case "fabric_clean":
      return "Generalmente basta con agua y jabón neutro. Ante manchas puntuales, conviene actuar rápido para que no penetren en las fibras.";
    case "fabric_waterproof":
      return "Las telas outdoor tienen tratamientos hidrorrepelentes que retrasan la absorción del agua. Ninguna tela transpirable puede considerarse totalmente impermeable, pero están pensadas para el uso exterior.";
    case "rain_cushions":
      return "Los almohadones están preparados para exteriores, aunque recomendamos resguardarlos en lluvias prolongadas para prolongar su vida útil y mantener su aspecto original.";
    case "painted_vs_anodized":
      return respondCompareStructures();
    case "factory":
      return "Sí, somos fabricantes. Diseñamos y producimos cada pieza en aluminio Aluar con terminaciones premium y control de calidad en cada etapa.";
    case "made_to_order":
      return "Sí. Cada pieza se fabrica según la configuración que elijas: tamaño, estructura, tapizado y —en mesas— medida y piedra.";
    case "customization":
      return "Podés personalizar estructura, tapizado y terminaciones según el modelo. En mesas, también medida y piedra sinterizada. El configurador de la web muestra el precio estimativo en tiempo real.";
    case "integral_project":
      return "Sí, asesoramos proyectos integrales para galerías, quinchos y terrazas. Podemos ayudarte a combinar reposeras, living y comedor con una propuesta coherente para tu espacio.";
    case "kids_pets":
      return "Para hogares con niños o mascotas podemos orientarte hacia telas outdoor de fácil limpieza y excelente resistencia al uso intensivo. Sunbrella, Agora y Bliss son opciones muy sólidas.";
    case "pool":
      return "Sí, los materiales son aptos para zonas de piscina y ambientes exteriores húmedos. El aluminio y las telas outdoor están pensados para ese tipo de exposición.";
    case "heat_sun":
      return "Como cualquier material al sol directo, pueden elevar su temperatura. Los colores claros suelen mantenerse más frescos; la elección de tapizado y ubicación del mueble influye en la sensación térmica.";
    case "lifespan":
      return "Con mantenimiento básico —limpieza con agua y jabón neutro— los muebles conservan funcionalidad y estética durante muchos años. La durabilidad es parte central de nuestra propuesta de diseño atemporal.";
    case "why_premium":
      return "La diferencia está en materiales, construcción, comodidad y terminaciones. Un mueble premium está pensado para conservar presencia y desempeño en el tiempo, no solo para lucir bien el primer año.";
    case "why_maldivas":
      return `${COMPANY.name} combina fabricación propia, ${COMPANY.philosophy} y materiales seleccionados para crear espacios exteriores que perduren. ${COMPANY.inspiration}`;
    case "removable_covers":
      return "Sí, los tapizados están diseñados para facilitar limpieza y mantenimiento.";
    case "combine_collections":
      return "Sí, muchas de nuestras colecciones fueron pensadas para convivir estéticamente en un mismo proyecto exterior. Podemos ayudarte a armar una propuesta coherente entre reposeras, living y comedor.";
    case "choose_model":
      return "La elección depende del espacio, la orientación al sol y el uso previsto. Contame dimensiones y estilo de tu proyecto —galería, terraza o quincho— y te recomiendo colecciones y configuraciones concretas.";
    default:
      return respondHelp();
  }
}

export function respondMaintenance(): string {
  return "El mantenimiento es mínimo: limpieza periódica con agua y jabón neutro, sin productos abrasivos. Recomendamos resguardar almohadones en lluvias prolongadas y actuar rápido ante manchas en las telas. Con estos cuidados básicos, los muebles conservan su estética y desempeño durante muchos años.";
}

export function respondSamples(): string {
  return `Sí, podés solicitar muestras de tela según disponibilidad vigente. También podés visitar el showroom en ${SHOWROOM.full} para ver materiales y terminaciones en persona.`;
}

export function respondGreeting(): string {
  return "Hola, un gusto saludarte. Puedo ayudarte con productos, precios, materiales, envíos o elegir la colección ideal para tu espacio. ¿En qué te oriento?";
}

export function respondHelp(): string {
  return "Puedo orientarte sobre colecciones, precios, materiales, envíos y cómo usar la web para personalizar cada mueble. Contame qué estás buscando o elegí una sugerencia abajo.";
}

export function respondUnknown(): string {
  return "";
}

export function suggestionsForIntent(
  intent: AssistantIntent,
  product?: Product
): string[] {
  switch (intent) {
    case "showroom":
      return [
        "¿Querés que te ayude a elegir una colección?",
        "¿Cómo uso la web?",
      ];
    case "company":
      return [
        "¿Querés que te ayude a elegir una colección?",
        "¿Dónde puedo ver los muebles?",
      ];
    case "price":
      return product
        ? [
            "¿Qué opciones de configuración tiene?",
            "¿Cuál es el plazo de fabricación?",
          ]
        : [
            "¿Cuánto cuesta una reposera Fendi?",
            "¿Cuánto cuesta un living Maldivas?",
          ];
    case "compare":
      return [
        "¿Querés que te ayude a elegir una colección?",
        "¿Necesitás asesoramiento para una galería o terraza?",
      ];
    case "product_info":
      return [
        "¿Y cuánto cuesta?",
        "¿Qué opciones de configuración tiene?",
      ];
    case "configuration":
      return ["¿Y cuánto cuesta?", "¿Querés conocer las opciones de telas?"];
    case "help":
      return [
        "¿Dónde puedo ver los muebles?",
        "¿Qué tela me recomendás?",
      ];
    case "advisor":
    case "quote":
    case "buy":
    case "website":
      return [];
    case "oxidation":
    case "outdoor_use":
    case "fabric_recommendation":
      return [
        "¿Querés conocer las opciones de telas?",
        "¿Dónde puedo ver los muebles?",
      ];
    case "payment":
    case "warranty":
    case "shipping":
      return [
        "¿Cuál es el plazo de fabricación?",
        "¿Cómo personalizo un producto?",
      ];
    case "fabrics":
    case "structures":
    case "materials":
      return [
        "¿Querés conocer las opciones de telas disponibles?",
        "¿Querés que te explique las diferencias entre los modelos?",
      ];
    default:
      return [
        "¿Querés que te ayude a elegir una colección?",
        "¿Dónde puedo ver los muebles?",
      ];
  }
}
