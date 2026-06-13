"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const placeholders = [
  {
    id: "1",
    question: "¿Los muebles pueden permanecer al exterior todo el año?",
    answer:
      "Sí. Todos los muebles Maldivas Outdoor están diseñados específicamente para uso exterior permanente. Utilizamos estructuras de aluminio, pinturas y terminaciones aptas para intemperie, junto con telas técnicas desarrolladas para resistir sol, humedad y uso cotidiano.",
  },
  {
    id: "2",
    question: "¿Las telas se destiñen con el sol?",
    answer:
      "Trabajamos con telas outdoor premium seleccionadas por su alta resistencia UV. Con un uso normal y mantenimiento adecuado, conservan color y apariencia durante muchos años.",
  },
  {
    id: "3",
    question: "¿Qué diferencia hay entre una tela común y una tela outdoor?",
    answer:
      "Las telas outdoor están desarrolladas para resistir radiación UV, humedad, hongos y manchas superficiales. Además ofrecen una mayor estabilidad dimensional y durabilidad frente al uso exterior.",
  },
  {
    id: "4",
    question: "¿Las fundas son desmontables?",
    answer:
      "Sí. Los tapizados están diseñados para facilitar su limpieza y mantenimiento.",
  },
  {
    id: "5",
    question: "¿Cómo se limpian las telas?",
    answer:
      "Generalmente basta con agua y jabón neutro. Para manchas específicas recomendamos una limpieza rápida para evitar que penetren en las fibras.",
  },
  {
    id: "6",
    question: "¿Las telas son impermeables?",
    answer:
      "Las telas outdoor poseen tratamientos hidrorrepelentes que retrasan la absorción del agua. Sin embargo, ninguna tela transpirable puede considerarse completamente impermeable.",
  },
  {
    id: "7",
    question: "¿Los almohadones pueden quedar bajo la lluvia?",
    answer:
      "Aunque están preparados para exteriores, recomendamos resguardarlos durante lluvias prolongadas para prolongar su vida útil y mantener su aspecto original.",
  },
  {
    id: "8",
    question: "¿Las estructuras se oxidan?",
    answer:
      "No. Las estructuras están fabricadas en aluminio, un material que no se oxida como el hierro.",
  },
  {
    id: "9",
    question: "¿Qué diferencia hay entre aluminio pintado y aluminio anodizado?",
    answer:
      "El aluminio pintado ofrece una terminación uniforme y contemporánea. El anodizado incorpora un tratamiento que modifica la superficie del aluminio aumentando su resistencia y aportando una estética más sofisticada.",
  },
  {
    id: "10",
    question: "¿Qué mantenimiento requieren los muebles?",
    answer:
      "Muy poco. Recomendamos limpieza periódica con agua y jabón neutro y evitar productos abrasivos.",
  },
  {
    id: "11",
    question: "¿Fabrican ustedes los muebles?",
    answer:
      "Sí. Somos fabricantes. Diseñamos y producimos cada pieza cuidando los detalles constructivos, materiales y terminaciones.",
  },
  {
    id: "12",
    question: "¿Los muebles se fabrican a pedido?",
    answer:
      "Sí. Cada pieza se fabrica según la configuración elegida por el cliente.",
  },
  {
    id: "13",
    question: "¿Puedo personalizar colores y terminaciones?",
    answer:
      "Sí. Dependiendo del modelo, es posible elegir estructura, tela y diferentes configuraciones.",
  },
  {
    id: "14",
    question: "¿Puedo solicitar una combinación especial?",
    answer: "Sí. Evaluamos cada proyecto de manera personalizada.",
  },
  {
    id: "15",
    question:
      "¿Realizan proyectos integrales para galerías, quinchos y terrazas?",
    answer:
      "Sí. Podemos asesorar en la selección de muebles para lograr una propuesta coherente y funcional para cada espacio.",
  },
  {
    id: "16",
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí. Realizamos envíos a distintas ciudades de Argentina mediante transportes especializados.",
  },
  {
    id: "17",
    question: "¿Cómo llega el producto?",
    answer:
      "Los muebles viajan protegidos para minimizar riesgos durante el transporte.",
  },
  {
    id: "18",
    question: "¿Cuál es el plazo de fabricación?",
    answer:
      "Depende del modelo y la época del año. El plazo estimado se informa al momento de la compra.",
  },
  {
    id: "19",
    question: "¿Puedo visitar el showroom?",
    answer:
      "Sí. Coordinamos visitas para que puedas conocer los materiales, terminaciones y modelos disponibles.",
  },
  {
    id: "20",
    question: "¿Puedo solicitar muestras de tela?",
    answer: "Sí. Consultanos disponibilidad y opciones vigentes.",
  },
  {
    id: "21",
    question: "¿Cuál es la garantía?",
    answer:
      "Todos nuestros productos cuentan con garantía contra defectos de fabricación.",
  },
  {
    id: "22",
    question: "¿Qué formas de pago aceptan?",
    answer:
      "Aceptamos diferentes medios de pago. Consultanos las promociones vigentes al momento de la compra.",
  },
  {
    id: "23",
    question: "¿Existe descuento por pago contado?",
    answer:
      "Sí. Disponemos de beneficios especiales para determinadas modalidades de pago.",
  },
  {
    id: "24",
    question: "¿Los precios publicados son definitivos?",
    answer:
      "Los precios publicados son estimativos y pueden variar según configuración, terminaciones y actualizaciones de costos.",
  },
  {
    id: "25",
    question: "¿Los muebles soportan uso intensivo?",
    answer:
      "Sí. Están diseñados para uso residencial exigente y espacios de alta utilización.",
  },
  {
    id: "26",
    question: "¿Los muebles se calientan al sol?",
    answer:
      "Como cualquier material expuesto al sol directo, pueden elevar su temperatura. Los colores claros tienden a mantenerse más frescos que los oscuros.",
  },
  {
    id: "27",
    question: "¿Puedo dejar los muebles junto a una piscina?",
    answer:
      "Sí. Los materiales utilizados son aptos para ambientes exteriores y zonas de piscina.",
  },
  {
    id: "28",
    question: "¿Qué vida útil tienen?",
    answer:
      "Con mantenimiento básico, los muebles pueden conservar su funcionalidad y estética durante muchos años.",
  },
  {
    id: "29",
    question: "¿Por qué elegir Maldivas Outdoor?",
    answer:
      "Porque combinamos diseño atemporal, materiales seleccionados, fabricación propia y una filosofía centrada en crear espacios exteriores que perduren en el tiempo.",
  },
  {
    id: "30",
    question:
      "¿Por qué los muebles premium tienen un valor diferente a los muebles convencionales?",
    answer:
      "La diferencia está en los materiales, la construcción, la durabilidad, la comodidad y el nivel de terminación. Un mueble premium está pensado para conservar su presencia y desempeño durante años.",
  },
  {
    id: "31",
    question: "¿Cómo sé qué modelo elegir para mi espacio?",
    answer:
      "Podemos asesorarte según las dimensiones, el uso previsto, la orientación solar y el estilo arquitectónico de tu proyecto.",
  },
  {
    id: "32",
    question: "¿Qué colección recomiendan para una galería familiar?",
    answer:
      "Dependerá del espacio y la cantidad de usuarios, pero generalmente recomendamos configuraciones amplias que permitan reuniones cómodas y flexibles.",
  },
  {
    id: "33",
    question: "¿Qué tela recomiendan para hogares con niños o mascotas?",
    answer:
      "Podemos orientarte hacia opciones con mayor facilidad de limpieza y excelente comportamiento frente al uso intensivo.",
  },
  {
    id: "34",
    question: "¿Puedo combinar reposeras, living y comedor de la misma línea?",
    answer:
      "Sí. Muchas de nuestras colecciones fueron pensadas para convivir estéticamente dentro de un mismo proyecto exterior.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-3xl mx-auto">
      <FadeIn className="text-center mb-20">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
          Preguntas Frecuentes
        </p>
        <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
          FAQ
        </h1>
      </FadeIn>

      <div className="divide-y divide-stone/20 border-t border-b border-stone/20">
        {placeholders.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() =>
                setOpenId(openId === item.id ? null : item.id)
              }
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="text-sm md:text-base font-light pr-8 group-hover:opacity-60 transition-opacity">
                {item.question}
              </span>
              <span className="text-matte-black/30 text-xl flex-shrink-0">
                {openId === item.id ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence>
              {openId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-sm text-matte-black/40 italic">
                    {item.answer || "Contenido próximamente."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
