import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const CONTACT_EMAIL = "maldivas.outdoor@gmail.com";

export const metadata: Metadata = {
  title: "Eliminación de datos de usuario",
  description:
    "Cómo solicitar la eliminación de datos personales enviados a Maldivas Outdoor.",
};

export default function DataDeletionPage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Eliminación de datos de usuario">
      <p>
        Los usuarios pueden solicitar la eliminación de sus datos personales
        enviados a Maldivas Outdoor.
      </p>
      <p>
        Para solicitarlo, deben escribir a{" "}
        <a href={`mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20datos`}>
          {CONTACT_EMAIL}
        </a>{" "}
        con el asunto &ldquo;Solicitud de eliminación de datos&rdquo;.
      </p>
      <p>Indicar:</p>
      <ul>
        <li>Nombre</li>
        <li>Email o teléfono usado para contactar</li>
        <li>Detalle de la solicitud</li>
      </ul>
      <p>
        Maldivas Outdoor revisará y eliminará los datos asociados cuando
        corresponda.
      </p>
      <p>
        Si el contacto se originó desde Meta, Instagram o Facebook, el usuario
        también puede gestionar sus datos desde la configuración de privacidad de
        Meta.
      </p>
    </LegalPageLayout>
  );
}
