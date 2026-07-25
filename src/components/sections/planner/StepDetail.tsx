"use client";

import type {
  PlannerLocation,
  PlantSuggestion,
  SpaceInput,
  SuggestionResponse,
} from "@/types";

interface StepDetailProps {
  suggestion: PlantSuggestion;
  location: PlannerLocation;
  space: SpaceInput;
  photoUrl: string | null;
  data: SuggestionResponse;
  onBack: () => void;
  onRestart: () => void;
}

export default function StepDetail({
  suggestion,
  location,
  space,
  photoUrl,
  data,
  onBack,
  onRestart,
}: StepDetailProps) {
  const { plant, reasons, warnings, unitsThatFit, score } = suggestion;

  const conditions: { label: string; value: string }[] = [
    { label: "Suelo", value: plant.planting.soil },
    { label: "Marco de plantación", value: `${plant.planting.spacingCm} cm entre ejemplares` },
    { label: "Profundidad del pozo", value: `${plant.planting.depthCm} cm` },
    { label: "Mejor época", value: plant.planting.season },
    { label: "Riego", value: plant.planting.watering },
    { label: "Cuidados", value: plant.planting.care },
    { label: "Exposición ideal", value: plant.light },
    {
      label: "Tamaño adulto",
      value: `${plant.matureWidthCm} cm de ancho × ${plant.matureHeightCm} cm de alto`,
    },
  ];

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-text-main mb-2">
        4. Detalle de la plantación
      </h2>
      <p className="text-text-muted mb-6">
        Condiciones, ventajas y desventajas de plantar{" "}
        <strong>{plant.commonName}</strong> en tu espacio.
      </p>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="font-serif text-xl font-semibold text-text-main mb-1">
            <span aria-hidden="true">{plant.emoji}</span> {plant.commonName}
          </h3>
          <p className="text-sm italic text-text-muted mb-3">
            {plant.scientificName} · {plant.category}
          </p>
          <p className="text-sm text-text-main mb-4">{plant.summary}</p>
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-text-muted">Ubicación</dt>
              <dd className="font-medium text-text-main">{location.label}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Zona climática</dt>
              <dd className="font-medium text-text-main">
                {data.zone.emoji} {data.zone.zone}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Espacio declarado</dt>
              <dd className="font-medium text-text-main">
                {space.widthCm} × {space.depthCm} cm · {space.light}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Afinidad</dt>
              <dd className="font-medium text-text-main">
                {score}% · entran ~{unitsThatFit} ejemplar
                {unitsThatFit === 1 ? "" : "es"}
              </dd>
            </div>
          </dl>
        </div>

        {photoUrl && (
          <figure className="rounded-xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Foto del espacio a plantar"
              className="w-full h-48 md:h-full object-cover"
            />
          </figure>
        )}
      </div>

      <section className="mb-8">
        <h3 className="font-serif text-lg font-semibold text-text-main mb-3">
          Condiciones de la plantación
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          {conditions.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <dt className="text-xs uppercase tracking-wide text-text-muted mb-1">
                {item.label}
              </dt>
              <dd className="text-sm text-text-main">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <section className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h3 className="font-serif text-lg font-semibold text-green-900 mb-3">
            Ventajas
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-green-900">
            {plant.advantages.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-serif text-lg font-semibold text-amber-900 mb-3">
            Desventajas
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-amber-900">
            {plant.disadvantages.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">⚠️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <section>
          <h3 className="font-serif text-lg font-semibold text-text-main mb-3">
            Por qué encaja en tu espacio
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-text-main">
            {reasons.length > 0 ? (
              reasons.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">🌿</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-text-muted">
                No hay coincidencias destacadas para esta combinación.
              </li>
            )}
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-lg font-semibold text-text-main mb-3">
            A tener en cuenta
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-text-main">
            {warnings.length > 0 ? (
              warnings.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">📌</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-text-muted">
                Sin advertencias: la especie encaja bien con los datos ingresados.
              </li>
            )}
          </ul>
        </section>
      </div>

      {data.zone.gardenTips.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-background p-5 mb-8">
          <h3 className="font-serif text-lg font-semibold text-text-main mb-3">
            Recomendaciones para la zona {data.zone.zone}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-text-main">
            {data.zone.gardenTips.slice(0, 4).map((tip) => (
              <li key={tip} className="flex gap-2">
                <span aria-hidden="true">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-secondary">
          Ver otras sugerencias
        </button>
        <button type="button" onClick={onRestart} className="btn-primary">
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
