import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Diseño y creación de jardines sustentables en Buenos Aires. Transformamos espacios en entornos naturales únicos.",
  openGraph: {
    title: "Nosotros — Küme Rayentwe",
    description:
      "Diseño y creación de jardines sustentables en Buenos Aires. Transformamos espacios en entornos naturales únicos.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function NosotrosPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects />
      <CtaBanner />
    </>
  );
}
