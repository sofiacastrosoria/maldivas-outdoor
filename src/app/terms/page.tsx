import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const CONTACT_EMAIL = "maldivas.outdoor@gmail.com";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio web de Maldivas Outdoor.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Términos y condiciones">
      <p>
        La información publicada en el sitio es de carácter comercial e
        informativo.
      </p>
      <p>
        Los productos, precios, medidas, materiales, disponibilidad y plazos
        pueden variar según proyecto, ubicación y configuración.
      </p>
      <p>
        Las cotizaciones se confirman por contacto directo con Maldivas Outdoor.
      </p>
      <p>El uso del sitio no implica una compra automática.</p>
      <p>
        Maldivas Outdoor puede modificar el contenido del sitio cuando sea
        necesario.
      </p>
      <p>
        Contacto: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPageLayout>
  );
}
