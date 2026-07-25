"use client";

import type { PlantSuggestion, SuggestionResponse } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface StepSuggestionsProps {
  loading: boolean;
  error: string | null;
  data: SuggestionResponse | null;
  onRetry: () => void;
  onSelect: (suggestion: PlantSuggestion) => void;
  onBack: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export default function StepSuggestions({
  loading,
  error,
  data,
  onRetry,
  onSelect,
  onBack,
}: StepSuggestionsProps) {
  return (
    <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-text-main mb-2">
        3. Qué podés plantar
      </h2>
      <p className="text-text-muted mb-6">
        Cruzamos el clima de tu ubicación con el tamaño y la luz del espacio.
      </p>

      {loading && <LoadingSpinner message="Analizando clima y espacio…" />}

      {error && !loading && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button type="button" onClick={onRetry} className="btn-primary">
            Reintentar
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 grid gap-2 sm:grid-cols-2">
            <p className="text-sm text-text-main">
              <span aria-hidden="true">{data.zone.emoji}</span> Zona:{" "}
              <strong>{data.zone.zone}</strong> — {data.zone.biome}
            </p>
            <p className="text-sm text-text-main">
              <span aria-hidden="true">{data.climate.weatherEmoji}</span>{" "}
              {data.climate.weatherDescription} · {data.climate.currentTemp.toFixed(0)} °C ·
              humedad {data.climate.humidity}%
            </p>
            <p className="text-sm text-text-muted sm:col-span-2">
              Media semanal de máximas {data.climate.avgTemp.toFixed(1)} °C · lluvia
              promedio {data.climate.avgPrecip.toFixed(1)} mm/día
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {data.suggestions.map((suggestion) => (
              <li key={suggestion.plant.id}>
                <button
                  type="button"
                  onClick={() => onSelect(suggestion)}
                  className="w-full h-full text-left p-5 rounded-2xl border border-gray-200 bg-white hover:border-primary hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-text-main">
                        <span aria-hidden="true">{suggestion.plant.emoji}</span>{" "}
                        {suggestion.plant.commonName}
                      </h3>
                      <p className="text-sm italic text-text-muted">
                        {suggestion.plant.scientificName}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${scoreColor(suggestion.score)}`}
                    >
                      {suggestion.score}% afinidad
                    </span>
                  </div>

                  <p className="text-sm text-text-muted">{suggestion.plant.summary}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {suggestion.plant.light}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      riego {suggestion.plant.water}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-text-muted font-medium">
                      {suggestion.plant.matureWidthCm} × {suggestion.plant.matureHeightCm} cm
                    </span>
                  </div>

                  <p className="text-xs text-text-muted mt-auto">
                    {suggestion.unitsThatFit > 0
                      ? `Entran ~${suggestion.unitsThatFit} ejemplar${suggestion.unitsThatFit === 1 ? "" : "es"} en tu espacio`
                      : "El espacio medido es menor al marco de plantación recomendado"}
                  </p>
                  <span className="text-sm text-primary font-medium">
                    Ver detalle →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8">
        <button type="button" onClick={onBack} className="btn-secondary">
          Volver
        </button>
      </div>
    </div>
  );
}
