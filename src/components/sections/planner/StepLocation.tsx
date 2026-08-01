"use client";

import { useState, type FormEvent } from "react";
import type { GeocodingResult, PlannerLocation } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface StepLocationProps {
  value: PlannerLocation | null;
  onChange: (location: PlannerLocation) => void;
  onNext: () => void;
}

function formatLabel(result: GeocodingResult): string {
  return [result.name, result.admin1, result.country]
    .filter(Boolean)
    .join(", ");
}

export default function StepLocation({
  value,
  onChange,
  onNext,
}: StepLocationProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function detectCurrentLocation() {
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización. Buscá la dirección manualmente.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/geocode-reverse?lat=${latitude}&lon=${longitude}`
          );
          const data: GeocodingResult & { error?: string } = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error ?? "No pudimos identificar tu dirección.");
          }
          onChange({
            label: formatLabel(data),
            latitude,
            longitude,
            admin1: data.admin1,
            country: data.country,
            source: "gps",
          });
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "No pudimos identificar tu dirección."
          );
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Ingresá la dirección manualmente."
            : "No pudimos obtener tu ubicación. Ingresá la dirección manualmente."
        );
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    setError(null);
    setSearching(true);
    try {
      const res = await fetch(`/api/geocode-search?q=${encodeURIComponent(trimmed)}`);
      const data: { results?: GeocodingResult[]; error?: string } = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "No pudimos buscar esa ubicación.");
      }
      setResults(data.results ?? []);
      if ((data.results ?? []).length === 0) {
        setError(`No encontramos "${trimmed}". Probá con otra localidad.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al buscar la ubicación.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-text-main mb-2">
        1. ¿Dónde vas a sembrar?
      </h2>
      <p className="text-text-muted mb-6">
        Usá tu ubicación actual o escribí la dirección o localidad del espacio.
      </p>

      <button
        type="button"
        onClick={detectCurrentLocation}
        disabled={locating}
        className="btn-primary w-full sm:w-auto mb-6 disabled:opacity-60"
      >
        {locating ? "Detectando…" : "Usar mi ubicación actual"}
      </button>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Puente Alto"
          aria-label="Buscar dirección o localidad"
          minLength={2}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        />
        <button type="submit" className="btn-secondary" disabled={searching}>
          {searching ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {searching && <LoadingSpinner message="Buscando ubicaciones…" />}

      {results.length > 0 && (
        <ul className="flex flex-col gap-2 mb-4">
          {results.map((result) => (
            <li key={`${result.id}-${result.latitude}`}>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    label: formatLabel(result),
                    latitude: result.latitude,
                    longitude: result.longitude,
                    admin1: result.admin1,
                    country: result.country,
                    source: "manual",
                  })
                }
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <span className="font-medium text-text-main">{result.name}</span>
                <span className="text-sm text-text-muted">
                  {" "}
                  — {[result.admin1, result.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {value && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <p className="text-sm text-text-main flex-1">
            <span aria-hidden="true"></span>{" "}
            <strong>{value.label}</strong>{" "}
            <span className="text-text-muted">
              ({value.latitude.toFixed(3)}, {value.longitude.toFixed(3)} ·{" "}
              {value.source === "gps" ? "ubicación actual" : "ingresada manualmente"})
            </span>
          </p>
          <button type="button" onClick={onNext} className="btn-primary">
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
