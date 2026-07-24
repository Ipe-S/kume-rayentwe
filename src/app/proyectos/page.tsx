import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Galería de proyectos de paisajismo realizados por Küme Rayentwe en Buenos Aires y alrededores.",
  openGraph: {
    title: "Proyectos — Küme Rayentwe",
    description:
      "Galería de proyectos de paisajismo realizados por Küme Rayentwe.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const projects: Project[] = [
  {
    id: 1,
    title: "Terraza Palermo",
    description:
      "Terraza urbana de 80m² con jardín vertical, deck de madera recuperada y sistema de riego automático.",
    category: "terraza",
    imageUrl: "",
    location: "Palermo, CABA",
    year: 2024,
  },
  {
    id: 2,
    title: "Jardín Zen, San Isidro",
    description:
      "Jardín de 300m² con laguna natural, puente de madera y selección de plantas nativas de la región pampeana.",
    category: "patio",
    imageUrl: "",
    location: "San Isidro, Buenos Aires",
    year: 2023,
  },
  {
    id: 3,
    title: "Hotel Boutique Mendoza",
    description:
      "Espacio exterior de hotel con jardines aromáticos, senderos empedrados y iluminación ambiental led.",
    category: "comercial",
    imageUrl: "",
    location: "Ciudad de Mendoza",
    year: 2024,
  },
  {
    id: 4,
    title: "Patio Interior Microcentro",
    description:
      "Transformación de un patio ciego de 25m² en un oasis verde con plantas tropicales y bancos de madera.",
    category: "urbano",
    imageUrl: "",
    location: "Microcentro, CABA",
    year: 2023,
  },
  {
    id: 5,
    title: "Quincho Sustentable, Tigre",
    description:
      "Diseño integral de jardín con huerta orgánica, compostaje y sistema de captación de agua de lluvia.",
    category: "patio",
    imageUrl: "",
    location: "Tigre, Buenos Aires",
    year: 2022,
  },
  {
    id: 6,
    title: "Oficinas Corporativas",
    description:
      "Interiores biofílicos con paredes verdes vivas, plantas purificadoras y espacios de bienestar para empleados.",
    category: "comercial",
    imageUrl: "",
    location: "Puerto Madero, CABA",
    year: 2024,
  },
];

const categoryColors: Record<Project["category"], string> = {
  urbano: "bg-blue-100 text-blue-700",
  terraza: "bg-purple-100 text-purple-700",
  patio: "bg-green-100 text-green-700",
  comercial: "bg-orange-100 text-orange-700",
};

const categoryEmojis: Record<Project["category"], string> = {
  urbano: "🏙️",
  terraza: "🌇",
  patio: "🍃",
  comercial: "🏢",
};

const gradients = [
  "from-green-800 to-green-600",
  "from-teal-800 to-teal-600",
  "from-emerald-800 to-emerald-600",
  "from-cyan-800 to-cyan-600",
  "from-lime-800 to-lime-600",
  "from-green-900 to-teal-700",
];

export default function ProyectosPage() {
  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom">
        <SectionHeader
          title="Nuestros Proyectos"
          subtitle="Más de 150 espacios transformados con diseño, criterio y amor por la naturaleza."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div
                className={`h-48 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-6xl`}
                aria-hidden="true"
              >
                {categoryEmojis[project.category]}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[project.category]}`}
                  >
                    {project.category.charAt(0).toUpperCase() +
                      project.category.slice(1)}
                  </span>
                  <span className="text-xs text-text-muted">{project.year}</span>
                </div>

                <h2 className="font-serif text-xl font-semibold text-text-main mb-2">
                  {project.title}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed mb-3">
                  {project.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <span aria-hidden="true">📍</span>
                  <span>{project.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
