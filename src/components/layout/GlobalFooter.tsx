import {
  buildWhatsAppUrl,
  CONTACT_MESSAGE_DEFAULT,
  generateContactWhatsAppMessage,
} from "@/lib/whatsapp";

const MAP_URL =
  "https://maps.app.goo.gl/RiJrTenL5BaVdtEE7?g_st=ic";

const INSTAGRAM_URL = "https://instagram.com/maldivas.outdoor";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacidad" },
  { href: "/terms", label: "Términos" },
  { href: "/data-deletion", label: "Eliminación de datos" },
] as const;

const whatsappHref = buildWhatsAppUrl(
  generateContactWhatsAppMessage(CONTACT_MESSAGE_DEFAULT)
);

export function GlobalFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-matte-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="space-y-1">
            <p className="text-[10px] tracking-luxury uppercase text-white/45">
              Maldivas Outdoor
            </p>
            <p className="text-sm font-light text-white/70">
              Lujo silencioso · Córdoba, Argentina
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-luxury uppercase text-white/80 border border-white/20 px-6 py-3 hover:bg-white hover:text-matte-black transition-all duration-500"
            >
              WhatsApp
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-white/75 hover:text-white transition-colors duration-500"
            >
              @maldivas.outdoor
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-luxury uppercase text-white/45 mb-3">
              Showroom
            </p>
            <p className="text-sm font-light leading-relaxed text-white/75">
              Luis Jose de Tejeda 4286
              <br />
              Cerro de las Rosas
              <br />
              Córdoba Capital
            </p>
          </div>

          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center text-xs tracking-luxury uppercase border border-white/25 px-8 py-3 text-white/90 hover:bg-white hover:text-matte-black transition-all duration-500 w-full md:w-auto"
          >
            Cómo llegar
          </a>
        </div>

        <nav
          className="mt-10 border-t border-white/10 pt-8 flex flex-wrap gap-x-6 gap-y-2"
          aria-label="Enlaces legales"
        >
          {LEGAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-light text-white/50 hover:text-white transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
