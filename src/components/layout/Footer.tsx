import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* que hacemos somos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-xl font-bold">
                Küme Rayentwe
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Transformamos espacios en entornos sustentables, diseñados con
              criterio y amor por la naturaleza.
            </p>
          </div>
          {/* contacto */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <a
                  href="mailto:hola@jardinsustentable.com"
                  className="hover:text-white transition-colors"
                >
                  contacto@kumerayentwe.cl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="tel:+541112345678"
                  className="hover:text-white transition-colors"
                >
                  +56 9 5555 6666
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>Santiago, Chile</span>
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
