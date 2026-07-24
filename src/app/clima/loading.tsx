import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ClimaLoading() {
  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom max-w-4xl">
        <LoadingSpinner message="Obteniendo datos del clima…" />
      </div>
    </div>
  );
}
