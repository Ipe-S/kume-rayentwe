import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const featured = [
  {
    title: "Terraza Palermo",
    category: "Terraza",
    description: "Terraza urbana de 80m² con jardín vertical y deck de madera.",
    color: "from-green-800 to-green-600",
    emoji: "🏙️",
  },
  {
    title: "Jardín Zen, San Isidro",
    category: "Jardín privado",
    description: "Jardín de 300m² con laguna natural y plantas nativas.",
    color: "from-teal-800 to-teal-600",
    emoji: "🍃",
  },
  {
    title: "Hotel Boutique, Mendoza",
    category: "Comercial",
    description: "Espacio exterior de hotel con jardines aromáticos y senderos.",
    color: "from-emerald-800 to-emerald-600",
    emoji: "🌸",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="section-padding bg-white" id="proyectos-destacados">
      <div className="container-custom">
        <SectionHeader
          title="Proyectos Destacados"
          subtitle="Una muestra de los espacios que transformamos con diseño y pasión."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featured.map((project) => (
            <article
              key={project.title}
              className={`relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br ${project.color} flex flex-col justify-end p-6 text-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-8xl opacity-20"
                aria-hidden="true"
              >
                {project.emoji}
              </div>
              <span className="relative text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit mb-2">
                {project.category}
              </span>
              <h3 className="relative font-serif text-xl font-bold">
                {project.title}
              </h3>
              <p className="relative text-sm text-white/80 mt-1">
                {project.description}
              </p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/proyectos" className="btn-primary">
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
}
