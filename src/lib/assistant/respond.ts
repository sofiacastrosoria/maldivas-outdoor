import { products } from "@/data/products";
import { defaultProductConfig } from "@/lib/images";
import { calculatePrice, formatPrice } from "@/lib/pricing";
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

export function respondShowroom(): string {
  return "Podés coordinar una visita a nuestro showroom para conocer materiales, terminaciones y distintas colecciones de manera presencial. Estamos en Cerro de las Rosas, Córdoba. Si querés, también podemos asesorarte previamente por WhatsApp.";
}

export function respondCompany(): string {
  return `${COMPANY.name} es una marca de muebles de exterior premium de ${COMPANY.location}. ${COMPANY.manufacturing}, con una filosofía de ${COMPANY.philosophy}. ${COMPANY.inspiration}. Ofrecemos ${COMPANY.approach}.`;
}

export function respondPrice(product: Product): string {
  const config = defaultProductConfig(product);
  const price = calculatePrice(product, config);
  const formatted = formatPrice(price);
  const name = productDisplayName(product);
  const size = product.sizes[0];

  const parts = [
    `El ${name} tiene un precio estimativo desde ${formatted} en configuración base`,
  ];

  if (size?.dimensions) {
    parts.push(`(${size.label}: ${size.dimensions})`);
  }

  if (product.fabrics.length > 0) {
    parts.push(
      "El valor puede variar según estructura, tapizado y tamaño elegidos"
    );
  } else if (product.customizableSize) {
    parts.push(
      "En mesas, el precio también depende de la medida y la piedra seleccionada"
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
  return `${capitalize(LOGISTICS.shipping)}. ${capitalize(LOGISTICS.timeline)}.`;
}

export function respondTimeline(): string {
  return `${capitalize(LOGISTICS.timeline)}. Si tenés una fecha objetivo para tu proyecto, conviene consultarnos con anticipación para planificar la fabricación.`;
}

export function respondPayment(): string {
  return `${capitalize(LOGISTICS.payment)}. ${capitalize(LOGISTICS.cashDiscount)}. ${capitalize(LOGISTICS.priceDisclaimer)}.`;
}

export function respondWarranty(): string {
  return `${capitalize(LOGISTICS.warranty)}, bajo uso residencial normal en exteriores. Ante cualquier consulta específica sobre tu producto, nuestro equipo puede orientarte de forma personalizada.`;
}

export function respondPurchase(): string {
  return "Podés personalizar cada producto en su ficha, agregarlo al carrito y solicitar cotización por WhatsApp con el detalle de tu configuración. También podés escribirnos desde Contacto o coordinar una visita al showroom antes de decidir.";
}

export function respondMaintenance(): string {
  return "El mantenimiento es mínimo: limpieza periódica con agua y jabón neutro, sin productos abrasivos. Recomendamos resguardar almohadones en lluvias prolongadas y actuar rápido ante manchas en las telas. Con estos cuidados básicos, los muebles conservan su estética y desempeño durante muchos años.";
}

export function respondSamples(): string {
  return `Sí, podés solicitar muestras de tela según disponibilidad vigente. También podés visitar el showroom en ${SHOWROOM.full} para ver materiales y terminaciones en persona.`;
}

export function respondGreeting(): string {
  return "Hola, un gusto saludarte. Soy el Asistente Maldivas y puedo ayudarte con productos, precios actualizados, materiales, envíos o elegir la colección ideal para tu espacio. ¿En qué te gustaría que te oriente?";
}

export function respondHelp(): string {
  return "Puedo informarte precios vigentes, diferencias entre colecciones, opciones de configuración, materiales, envíos, plazos, pagos y cómo usar el configurador de la web. Contame qué estás buscando o elegí una sugerencia abajo.";
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
