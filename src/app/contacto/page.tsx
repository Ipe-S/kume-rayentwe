import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con el equipo de Küme Rayentwe. Te respondemos en menos de 24 horas.",
  openGraph: {
    title: "Contacto — Küme Rayentwe",
    description:
      "Contactate con el equipo de Küme Rayentwe. Te respondemos en menos de 24 horas.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function ContactoPage() {
  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom">
        <SectionHeader
          title="Hablemos"
          subtitle="Contanos sobre tu proyecto y te preparamos una propuesta sin cargo."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl">
          {/* Form */}
          <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl font-semibold text-text-main mb-6">
              Envianos un mensaje
            </h2>
            <ContactForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
