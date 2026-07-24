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

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "hola@jardinsustentable.com",
    href: "mailto:hola@jardinsustentable.com",
  },
  {
    icon: "📞",
    label: "Teléfono",
    value: "+54 11 1234-5678",
    href: "tel:+541112345678",
  },
  {
    icon: "📍",
    label: "Ubicación",
    value: "Buenos Aires, Argentina",
    href: null,
  },
  {
    icon: "🕐",
    label: "Horario",
    value: "Lun–Vie 9:00 a 18:00",
    href: null,
  },
];

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
            <ContactForm />
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-6">
            <div className="bg-primary rounded-2xl p-6 md:p-8 text-white">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                Información de contacto
              </h2>
              <ul className="space-y-5">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span
                      className="text-xl flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wide mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white hover:text-secondary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-white">{item.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-text-main mb-3">
                ¿Qué pasa después?
              </h3>
              <ol className="space-y-3 text-sm text-text-muted">
                {[
                  "Recibimos tu consulta y la revisamos.",
                  "Te contactamos en menos de 24 horas.",
                  "Coordinamos una visita sin costo.",
                  "Te presentamos una propuesta personalizada.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
