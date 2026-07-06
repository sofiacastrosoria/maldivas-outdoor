import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const CONTACT_EMAIL = "maldivas.outdoor@gmail.com";
const LAST_UPDATED = "6 de julio de 2026";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Maldivas Outdoor. Información sobre el uso de datos personales y contacto.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Política de privacidad"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        Maldivas Outdoor puede recopilar datos de contacto enviados
        voluntariamente por usuarios, como nombre, teléfono, email, ciudad,
        mensaje o consulta comercial.
      </p>
      <p>Los datos se usan para:</p>
      <ul>
        <li>Responder consultas</li>
        <li>Cotizar productos</li>
        <li>Coordinar asesoramiento comercial</li>
        <li>Mejorar campañas publicitarias</li>
      </ul>
      <p>
        Podemos usar herramientas de terceros como Meta Ads, Instagram, Google
        Analytics/Ads, formularios web o WhatsApp para medir rendimiento y
        responder consultas.
      </p>
      <p>No vendemos datos personales.</p>
      <p>
        El usuario puede solicitar acceso, corrección o eliminación de sus datos
        escribiendo a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
      <p>
        Contacto: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPageLayout>
  );
}
