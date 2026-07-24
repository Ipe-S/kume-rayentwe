import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-label="Bienvenida"
    >
      {/* Background gradient (replaces image until a real one is added) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light"
        aria-hidden="true"
      />

      {/* Decorative circles */}
      <div
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white px-4">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-8">
          <span aria-hidden="true">🌿</span>
          Paisajismo sustentable en Buenos Aires
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Jardines que
          <span className="block text-secondary">cuentan historias</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Diseñamos y creamos espacios verdes únicos, pensados para armonizar
          con tu estilo de vida y el medioambiente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/proyectos" className="btn-outline text-base">
            Ver proyectos
          </Link>
          <Link href="/contacto" className="btn-secondary text-base">
            Consulta gratuita
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "+150", label: "Proyectos realizados" },
            { value: "12", label: "Años de experiencia" },
            { value: "100%", label: "Clientes satisfechos" },
            { value: "3", label: "Premios de diseño" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="font-serif text-2xl font-bold text-secondary">
                {stat.value}
              </div>
              <div className="text-xs text-white/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs"
        aria-hidden="true"
      >
        <span>Deslizá</span>
        <svg
          className="w-5 h-5 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
