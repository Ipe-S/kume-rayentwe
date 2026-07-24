import Link from "next/link";

export default function CtaBanner() {
  return (
    <section
      className="bg-primary section-padding"
      aria-labelledby="cta-heading"
    >
      <div className="container-custom text-center text-white">
        <h2
          id="cta-heading"
          className="font-serif text-3xl md:text-4xl font-bold mb-4"
        >
          ¿Listo para transformar tu espacio?
        </h2>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
          Contanos tu idea y te hacemos una propuesta sin cargo. El jardín que
          siempre imaginaste está a un mensaje de distancia.
        </p>
        <Link href="/contacto" className="btn-secondary text-base">
          Empezar ahora
        </Link>
      </div>
    </section>
  );
}
