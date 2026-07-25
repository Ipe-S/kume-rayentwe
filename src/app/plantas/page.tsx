import type { Metadata } from "next";
import { getPlants } from "@/lib/api";
import PlantCard from "@/components/ui/PlantCard";
import SectionHeader from "@/components/ui/SectionHeader";

// Forzar renderizado dinámico — requiere API key en runtime, no en build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Plantas",
  description:
    "Explorá plantas recomendadas para tu jardín. Información sobre riego, ciclo de vida y cuidados.",
  openGraph: {
    title: "Catálogo de Plantas — Küme Rayentwe",
    description:
      "Explorá plantas recomendadas para tu jardín. Información sobre riego, ciclo de vida y cuidados.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default async function PlantasPage() {
  const data = await getPlants(1);

  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom">
        <SectionHeader
          title="Catálogo de Plantas"
          subtitle="Descubrí especies recomendadas para diseñar y mantener tu jardín sustentable."
        />

        {data.data.length === 0 ? (
          <p className="text-center text-text-muted py-16">
            No se encontraron plantas. Intentá más tarde.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data.map((plant) => (
              <PlantCard
                key={plant.id}
                name={plant.scientific_name[0] ?? "Especie desconocida"}
                commonName={plant.common_name}
                imageUrl={plant.default_image?.medium_url ?? null}
                cycle={plant.cycle}
                watering={plant.watering}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
