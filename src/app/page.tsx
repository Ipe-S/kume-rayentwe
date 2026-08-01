import type { Metadata } from "next";
import PlantingWizard from "@/components/sections/planner/PlantingWizard";

export const metadata: Metadata = {
  title: "Küme Rayentwe — ¿Qué siembro en mi espacio?",
  description:
    "Asistente en 4 pasos: ubicación, foto y medidas del espacio, sugerencias de especies y detalle con condiciones, ventajas y desventajas.",
  openGraph: {
    title: "Küme Rayentwe — ¿Qué planto en mi espacio?",
    description:
      "Asistente en 4 pasos: ubicación, foto y medidas del espacio, sugerencias de especies y detalle con condiciones, ventajas y desventajas.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
export default function HomePage() {
  return <PlantingWizard />;
}
