"use client";

import { useEffect, useState, useCallback } from "react";
import type { WeatherResponse, GeocodingResult } from "@/types";
import WeatherDashboard from "./WeatherDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type Status = "idle" | "requesting" | "loading" | "success" | "denied" | "error";

interface AutoLocationProps {
  /** Si hay una búsqueda manual activa, no auto-detectar */
  skip?: boolean;
}

export default function AutoLocation({ skip = false }: AutoLocationProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const detect = useCallback(async () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      setErrorMsg("Tu navegador no soporta geolocalización.");
      return;
    }

    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus("loading");
        const { latitude: lat, longitude: lon } = pos.coords;

        try {
          // Llamadas paralelas: clima + reverse geocoding
          const [weatherRes, geoRes] = await Promise.all([
            fetch(`/api/weather?lat=${lat}&lon=${lon}`),
            fetch(`/api/geocode-reverse?lat=${lat}&lon=${lon}`),
          ]);

          if (!weatherRes.ok || !geoRes.ok) {
            throw new Error("No se pudieron obtener los datos de tu ubicación.");
          }

          const [weatherData, geoData]: [WeatherResponse, GeocodingResult] =
            await Promise.all([weatherRes.json(), geoRes.json()]);

          if ("error" in weatherData || "error" in geoData) {
            throw new Error(
              (weatherData as { error: string }).error ??
              (geoData as { error: string }).error
            );
          }

          setWeather(weatherData);
          setLocation(geoData);
          setStatus("success");
        } catch (e) {
          setErrorMsg(
            e instanceof Error ? e.message : "Error al cargar los datos."
          );
          setStatus("error");
        }
      },
      (err) => {
        // El usuario denegó el permiso o hubo un timeout
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setErrorMsg("Permiso de ubicación denegado.");
        } else {
          setStatus("error");
          setErrorMsg("No se pudo obtener tu ubicación. Buscá tu ciudad manualmente.");
        }
      },
      { timeout: 10000, maximumAge: 300000 } // 5 min de caché en el browser
    );
  }, []);

  useEffect(() => {
    if (!skip) detect();
  }, [skip, detect]);

  // ── Estados visuales ──────────────────────────────────────────────────────

  if (skip) return null;

  if (status === "idle" || status === "requesting") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">📍</div>
        <p className="font-serif text-xl font-semibold text-text-main mb-2">
          Detectando tu ubicación…
        </p>
        <p className="text-text-muted text-sm">
          {status === "requesting"
            ? "Esperando permiso del navegador…"
            : "Iniciando geolocalización…"}
        </p>
        {status === "requesting" && (
          <p className="text-xs text-text-muted mt-3 max-w-xs mx-auto">
            Aparecerá un diálogo del navegador solicitando permiso de ubicación.
          </p>
        )}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <LoadingSpinner message="Cargando clima de tu zona…" />
    );
  }

  if (status === "denied") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3" aria-hidden="true">🔒</div>
        <h3 className="font-serif text-lg font-semibold text-amber-800 mb-2">
          Ubicación no disponible
        </h3>
        <p className="text-amber-700 text-sm max-w-sm mx-auto">
          {errorMsg} Podés buscar tu ciudad manualmente usando el campo de búsqueda.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3" aria-hidden="true">⚠️</div>
        <h3 className="font-serif text-lg font-semibold text-red-800 mb-2">
          No pudimos detectar tu ubicación
        </h3>
        <p className="text-red-700 text-sm mb-4 max-w-sm mx-auto">{errorMsg}</p>
        <button onClick={detect} className="btn-primary text-sm">
          Reintentar
        </button>
      </div>
    );
  }

  // status === "success"
  if (weather && location) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-sm text-text-muted">
          <span aria-hidden="true">📍</span>
          <span>Mostrando clima de tu ubicación actual</span>
          <button
            onClick={detect}
            className="ml-auto text-xs text-primary hover:underline"
            aria-label="Actualizar ubicación"
          >
            Actualizar
          </button>
        </div>
        <WeatherDashboard weather={weather} location={location} />
      </div>
    );
  }

  return null;
}
