/** Constantes y metadatos del Asistente Maldivas */

export const ASSISTANT_WELCOME =
  "Hola, soy el Asistente Maldivas. Estoy para ayudarte a encontrar la mejor solución para tu espacio exterior.";

export const ASSISTANT_ESCALATION_MESSAGE =
  "No dispongo de esa información específica en este momento. Nuestro equipo puede ayudarte de manera personalizada.";

export const ASSISTANT_WHATSAPP_MESSAGE =
  "Hola, estaba utilizando el Asistente Maldivas y necesito información adicional sobre sus productos.";

export const ASSISTANT_QUOTE_WHATSAPP_MESSAGE =
  "Hola, estaba utilizando el Asistente Maldivas y quiero solicitar una cotización.";

export const ASSISTANT_SHOWROOM_WHATSAPP_MESSAGE =
  "Hola, me gustaría coordinar una visita al showroom de Maldivas Outdoor.";

export const DEFAULT_SUGGESTIONS = [
  "¿Querés que te ayude a elegir una colección?",
  "¿Necesitás asesoramiento para una galería o terraza?",
  "¿Querés conocer las opciones de telas disponibles?",
  "¿Querés que te explique las diferencias entre los modelos?",
];

/** Mesa de Living Skorphio — colección, medida, piedras y precio */
export const MESA_SKORPHIO_LIVING = {
  collection: "Skorphio",
  category: "Mesa de Living",
  measure: "160 x 80 x 33 cm",
  stoneBrand: "Infinity",
  stones: ["Travertino Chiaro", "Laurent", "White Macaubas"] as const,
  exclusiveStone: "White Macaubas",
  listPrice: 3_747_600,
  transferDiscountPercent: 15,
  cashDiscountPercent: 30,
} as const;

/** Piedras Infinity en la sección general Conocer Piedras (sin White Macaubas) */
export const INFINITY_STONES_CATALOG = [
  "Atlantis Grey",
  "Calacatta Oro",
  "Andromeda",
  "Travertino Chiaro",
  "Defense",
  "Pietra Grey",
  "Laurent",
  "Calacatta Hermitage",
  "Chianca Di Ostuni",
  "Royal Peacock",
  "Tundra Select",
  "Sahara Noir",
] as const;

/** Respuestas orientativas para consultas frecuentes sobre Mesa Skorphio */
export const MESA_SKORPHIO_RESPONSES = {
  stones:
    "La mesa Skorphio está disponible con tres superficies de piedra Infinity: Travertino Chiaro, Laurent y White Macaubas.",
  measure:
    "La mesa de living Skorphio se fabrica en una medida de 160 x 80 x 33 cm.",
  price:
    "El precio de lista es de $3.747.600. También contamos con beneficios por pago mediante transferencia bancaria y efectivo.",
  whiteMacaubas:
    "White Macaubas es una piedra exclusiva disponible dentro de la configuración de la mesa Skorphio, seleccionada por su estética sofisticada y su integración con ambientes de diseño contemporáneo.",
} as const;
