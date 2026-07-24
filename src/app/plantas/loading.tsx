import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PlantasLoading() {
  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom">
        <LoadingSpinner message="Cargando catálogo de plantas…" />
      </div>
    </div>
  );
}
