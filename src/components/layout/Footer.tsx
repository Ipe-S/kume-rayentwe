import Link from "next/link";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Plantas", href: "/plantas" },
  { label: "Clima", href: "/clima" },
  { label: "Contacto", href: "/contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-xl font-bold">
                Küme Rayentwe
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Transformamos espacios en entornos naturales únicos, diseñados con
              criterio sustentable y amor por la naturaleza.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📧</span>
                <a
                  href="mailto:hola@jardinsustentable.com"
                  className="hover:text-white transition-colors"
                >
                  hola@jardinsustentable.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📞</span>
                <a
                  href="tel:+541112345678"
                  className="hover:text-white transition-colors"
                >
                  +54 11 1234-5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📍</span>
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 text-center text-sm text-white/50">
          © {year} Küme Rayentwe. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
