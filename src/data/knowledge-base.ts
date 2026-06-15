import { products } from "@/data/products";
import { faqItems } from "@/data/faq";

export interface KnowledgeEntry {
  id: string;
  topics: string[];
  question?: string;
  answer: string;
  suggestions?: string[];
}

export const ASSISTANT_WELCOME =
  "Hola, soy el Asistente Maldivas. Estoy para ayudarte a encontrar la mejor solución para tu espacio exterior.";

export const ASSISTANT_ESCALATION_MESSAGE =
  "No dispongo de esa información específica en este momento. Nuestro equipo puede ayudarte de manera personalizada.";

export const ASSISTANT_WHATSAPP_MESSAGE =
  "Hola, estaba utilizando el Asistente Maldivas y necesito información adicional sobre sus productos.";

export const DEFAULT_SUGGESTIONS = [
  "¿Querés que te ayude a elegir una colección?",
  "¿Necesitás asesoramiento para una galería o terraza?",
  "¿Querés conocer las opciones de telas disponibles?",
  "¿Querés que te explique las diferencias entre los modelos?",
];

const STOP_WORDS = new Set([
  "que",
  "como",
  "cual",
  "cuál",
  "para",
  "con",
  "los",
  "las",
  "del",
  "una",
  "uno",
  "por",
  "son",
  "hay",
  "puedo",
  "puede",
  "tiene",
  "tienen",
  "esta",
  "este",
  "sus",
  "mis",
  "muebles",
  "maldivas",
  "outdoor",
]);

function extractTopics(question: string): string[] {
  const normalized = question
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return [...new Set(normalized)];
}

const faqEntries: KnowledgeEntry[] = faqItems.map((item) => ({
  id: `faq-${item.id}`,
  topics: extractTopics(item.question),
  question: item.question,
  answer: item.answer,
}));

const materialEntries: KnowledgeEntry[] = [
  {
    id: "sunbrella",
    topics: ["sunbrella", "tela sunbrella", "telas sunbrella"],
    answer:
      "Sunbrella es una tela acrílica outdoor de referencia mundial, reconocida por su resistencia UV, estabilidad de color y excelente comportamiento frente al sol y la humedad. En Maldivas Outdoor la trabajamos como opción premium para tapizados de reposeras y sillones.",
    suggestions: ["¿Querés conocer las opciones de telas disponibles?"],
  },
  {
    id: "agora",
    topics: ["agora", "tela agora", "telas agora"],
    answer:
      "Agora es una tela outdoor premium de alta performance, pensada para uso intensivo en exteriores. Ofrece gran resistencia al sol, buena estabilidad dimensional y facilidad de mantenimiento.",
    suggestions: ["¿Cómo se limpian las telas?"],
  },
  {
    id: "bliss",
    topics: ["bliss", "tela bliss", "telas bliss"],
    answer:
      "Bliss es una tela outdoor premium que combina confort, resistencia y estética refinada. Es una excelente opción para proyectos que buscan tapizados duraderos con presencia contemporánea.",
    suggestions: ["¿Querés conocer las opciones de telas disponibles?"],
  },
  {
    id: "materiales-general",
    topics: ["materiales", "material", "aluminio", "aluar", "goma espuma"],
    answer:
      "Trabajamos con estructuras de aluminio Aluar, terminaciones premium en pintura o anodizado, telas acrílicas outdoor (Sunbrella, Agora, Bliss) y goma espuma Piero Soft de alta densidad. Cada material fue seleccionado para uso exterior permanente.",
  },
  {
    id: "anodizado",
    topics: ["anodizado", "anodizada", "anodizadonegro", "anodizadopeltre"],
    answer:
      "El aluminio anodizado recibe un tratamiento que modifica su superficie, aumentando resistencia y aportando una estética sofisticada. Disponemos de terminaciones como anodizado negro lijado, peltre lijado y natural, según el modelo.",
  },
  {
    id: "pintado",
    topics: ["pintado", "pintura", "negro pintado", "greige", "blanco pintado"],
    answer:
      "El aluminio pintado ofrece una terminación uniforme y contemporánea, con colores como negro, greige y blanco. Es una opción versátil que se integra muy bien en proyectos de arquitectura actual.",
  },
];

const categoryEntries: KnowledgeEntry[] = [
  {
    id: "reposeras",
    topics: ["reposera", "reposeras", "reposar", "descanso"],
    answer:
      "Nuestras reposeras incluyen las colecciones Fendi, Skorphio, Málaga, MDQ y Baros. Podés elegir tamaño (estándar o doble), estructura y tapizado. Cada modelo tiene su propia identidad de diseño y configuraciones disponibles.",
    suggestions: ["¿Querés que te explique las diferencias entre los modelos?"],
  },
  {
    id: "sillones",
    topics: ["sillon", "sillones", "living", "juego de living", "modular"],
    answer:
      "Los juegos de living incluyen sillones en colecciones Fendi, Skorphio, Málaga, Maldivas y Milos, con configuraciones de 1 o 4 cuerpos. También ofrecemos mesas de living con medida y piedra personalizables.",
    suggestions: ["¿Necesitás asesoramiento para una galería o terraza?"],
  },
  {
    id: "mesas",
    topics: ["mesa", "mesas", "piedra", "sinterizada", "dekton", "infinity"],
    answer:
      "Las mesas de living y comedor cuentan con top en piedra sinterizada premium. Podés elegir medida personalizada y marca de piedra (Infinity, Dekton, Pura Prima). Modelos disponibles: Fendi, Skorphio, Málaga, Milos y Marbella.",
  },
  {
    id: "comedor",
    topics: ["comedor", "comedores", "marbella", "mesa comedor"],
    answer:
      "En comedor destacamos la mesa Marbella, con top en piedra sinterizada y medida personalizable. Es ideal para terrazas y espacios gourmet al aire libre con presencia arquitectónica.",
  },
  {
    id: "colecciones",
    topics: [
      "coleccion",
      "colecciones",
      "diferencia",
      "diferencias",
      "modelo",
      "modelos",
      "fendi",
      "skorphio",
      "malaga",
      "maldivas",
      "milos",
      "mdq",
      "baros",
      "marbella",
    ],
    answer:
      "Cada colección tiene una identidad propia: Fendi destaca por líneas puras y presencia escultórica; Skorphio por perfil contemporáneo; Málaga por geometría precisa; Maldivas es la esencia de la marca; Milos es compacto y refinado; MDQ evoca la costa atlántica; Baros conecta interior y paisaje; Marbella define el comedor exterior.",
    suggestions: ["¿Querés que te ayude a elegir una colección?"],
  },
];

const purchaseEntries: KnowledgeEntry[] = [
  {
    id: "comprar",
    topics: [
      "comprar",
      "compra",
      "pedido",
      "carrito",
      "agregar",
      "cotizacion",
      "cotización",
      "presupuesto",
      "presupuestar",
      "solicitar",
      "whatsapp",
    ],
    answer:
      "Podés personalizar cada producto en su ficha, agregarlo al carrito y solicitar cotización por WhatsApp. También podés escribirnos directamente desde la sección Contacto o coordinar una visita al showroom en Cerro de las Rosas, Córdoba.",
    suggestions: ["¿Cómo personalizo un producto?"],
  },
  {
    id: "personalizar",
    topics: [
      "personalizar",
      "personalizacion",
      "personalización",
      "configurar",
      "configuracion",
      "configuración",
      "tapizado",
      "estructura",
      "medida",
      "medidas",
      "tamaño",
      "tamano",
    ],
    answer:
      "En cada producto podés elegir tamaño, estructura, tapizado y —en mesas— medida y piedra. El configurador muestra el precio estimativo en tiempo real. Una vez definida tu combinación, agregá al carrito o solicitá cotización.",
  },
  {
    id: "web",
    topics: ["web", "sitio", "pagina", "página", "navegar", "usar la web"],
    answer:
      "Desde Productos podés explorar Reposeras, Juegos de Living y Comedor. Cada categoría muestra sus colecciones. Al entrar a un modelo, personalizás y consultás precio estimativo. El carrito y WhatsApp están disponibles en todo el sitio.",
  },
];

const productEntries: KnowledgeEntry[] = products.map((product) => ({
  id: product.id,
  topics: [
    product.slug,
    product.name.toLowerCase(),
    product.category,
    ...(product.subcategory ? [product.subcategory] : []),
  ],
  question: `¿Qué es ${product.name}?`,
  answer: `${product.name}: ${product.description}`,
}));

export const knowledgeEntries: KnowledgeEntry[] = [
  ...faqEntries,
  ...materialEntries,
  ...categoryEntries,
  ...purchaseEntries,
  ...productEntries,
];
