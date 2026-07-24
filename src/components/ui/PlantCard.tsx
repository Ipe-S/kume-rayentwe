import Image from "next/image";
import type { PlantCardProps } from "@/types";

const wateringColors: Record<string, string> = {
  Frequent: "bg-blue-100 text-blue-700",
  Average: "bg-green-100 text-green-700",
  Minimum: "bg-yellow-100 text-yellow-700",
  None: "bg-gray-100 text-gray-600",
};

const wateringLabels: Record<string, string> = {
  Frequent: "Riego frecuente",
  Average: "Riego moderado",
  Minimum: "Riego mínimo",
  None: "Sin riego",
};

export default function PlantCard({
  name,
  commonName,
  imageUrl,
  cycle,
  watering,
}: PlantCardProps) {
  const wateringColor =
    wateringColors[watering] ?? "bg-gray-100 text-gray-600";
  const wateringLabel = wateringLabels[watering] ?? watering;

  return (
    <article className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-primary/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={commonName ?? name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">
              🌱
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {commonName && (
          <h3 className="font-serif text-lg font-semibold text-text-main leading-tight line-clamp-1">
            {commonName}
          </h3>
        )}
        <p className="text-sm text-text-muted italic line-clamp-1">{name}</p>

        <div className="mt-auto pt-3 flex flex-wrap gap-2">
          {/* Cycle badge */}
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {cycle}
          </span>
          {/* Watering badge */}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${wateringColor}`}>
            {wateringLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
