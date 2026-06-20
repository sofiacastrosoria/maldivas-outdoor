"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";
import { useState } from "react";
import {
  CONTACT_MESSAGE_DEFAULT,
  contactToWhatsApp,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

const MAP_URL =
  "https://maps.app.goo.gl/RiJrTenL5BaVdtEE7?g_st=ic";

const SHOWROOM_IMAGE = "/images/contacto/local-showroom.jpg";

const contactLinks = [
  {
    label: "Instagram",
    value: "@maldivas.outdoor",
    href: "https://instagram.com/maldivas.outdoor",
  },
  {
    label: "WhatsApp",
    value: "+54 9 3516 81-2006",
    href: buildWhatsAppUrl("Hola Maldivas Outdoor."),
  },
];

export default function ContactoPage() {
  const [mensaje, setMensaje] = useState(CONTACT_MESSAGE_DEFAULT);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactToWhatsApp(mensaje);
  };

  return (
    <div className="pt-24 pb-32">
      <FadeIn className="px-6 md:px-12 mb-16 text-center">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
          Contacto
        </p>
        <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
          Visítenos
        </h1>
      </FadeIn>

      <div className="px-6 md:px-12 mb-20 max-w-6xl mx-auto">
        <div className={`relative w-full overflow-hidden ${IMAGE_BORDER_RADIUS}`}>
          <IntrinsicImage
            src={SHOWROOM_IMAGE}
            alt="Showroom Maldivas Outdoor"
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24 px-6 md:px-12 max-w-6xl mx-auto">
        <FadeIn>
          <div className="space-y-10">
            {contactLinks.map((item) => (
              <div key={item.label}>
                <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-2">
                  {item.label}
                </p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-light hover:opacity-60 transition-opacity duration-500"
                >
                  {item.value}
                </a>
              </div>
            ))}

            <div>
              <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-2">
                Ubicación
              </p>
              <p className="text-lg font-light leading-relaxed">
                Luis Jose de Tejeda 4286
                <br />
                Cerro de las Rosas
                <br />
                Córdoba Capital
              </p>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 w-full md:w-auto text-center bg-matte-black text-white px-12 py-4 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-colors duration-500"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[280px]">
            <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
              Escribinos por WhatsApp
            </p>
            <div
              className={`relative flex-1 rounded-sm border transition-all duration-500 ${
                focused
                  ? "border-matte-black/40 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
                  : "border-stone/20 bg-sand/5 hover:border-stone/35"
              }`}
            >
              <textarea
                required
                rows={8}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full h-full min-h-[220px] resize-none bg-transparent px-5 py-5 text-sm leading-relaxed text-matte-black/80 placeholder:text-matte-black/25 outline-none"
                aria-label="Mensaje para WhatsApp"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-matte-black text-white py-4 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-all duration-500 hover:tracking-[0.14em]"
            >
              Enviar mensaje
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}
