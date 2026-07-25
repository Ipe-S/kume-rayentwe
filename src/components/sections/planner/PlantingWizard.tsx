"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StepIndicator from "./StepIndicator";
import StepLocation from "./StepLocation";
import StepPhoto from "./StepPhoto";
import StepSuggestions from "./StepSuggestions";
import StepDetail from "./StepDetail";
import type {
  PlannerLocation,
  PlantSuggestion,
  SpaceInput,
  SuggestionResponse,
} from "@/types";

const STEPS = ["Ubicación", "Foto y medidas", "Sugerencias", "Detalle"];

const INITIAL_SPACE: SpaceInput = {
  widthCm: 100,
  depthCm: 100,
  light: "pleno sol",
};

export default function PlantingWizard() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  const [location, setLocation] = useState<PlannerLocation | null>(null);
  const [space, setSpace] = useState<SpaceInput>(INITIAL_SPACE);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const photoUrlRef = useRef<string | null>(null);

  const [data, setData] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PlantSuggestion | null>(null);

  // El object URL vive mientras dure el asistente: StepPhoto se desmonta al
  // cambiar de paso, pero la vista previa se sigue mostrando en el detalle.
  useEffect(() => {
    return () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    };
  }, []);

  const setPhoto = useCallback((file: File | null) => {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    const url = file ? URL.createObjectURL(file) : null;
    photoUrlRef.current = url;
    setPhotoUrl(url);
    setPhotoName(file?.name ?? null);
  }, []);

  const goTo = useCallback((index: number) => {
    setStep(index);
    setMaxReached((prev) => Math.max(prev, index));
  }, []);

  const fetchSuggestions = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: String(location.latitude),
        lon: String(location.longitude),
        width: String(space.widthCm),
        depth: String(space.depthCm),
        light: space.light,
      });
      const res = await fetch(`/api/suggest-plants?${params}`);
      const body: SuggestionResponse & { error?: string } = await res.json();
      if (!res.ok || body.error) {
        throw new Error(body.error ?? "No pudimos generar sugerencias.");
      }
      setData(body);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No pudimos generar sugerencias."
      );
    } finally {
      setLoading(false);
    }
  }, [location, space]);

  async function handleShowSuggestions() {
    goTo(2);
    await fetchSuggestions();
  }

  function handleRestart() {
    setStep(0);
    setMaxReached(0);
    setLocation(null);
    setSpace(INITIAL_SPACE);
    setPhoto(null);
    setData(null);
    setSelected(null);
    setError(null);
  }

  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom max-w-5xl">
        <header className="text-center mb-10">
          <p className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            🌿 Planificá tu plantación en 4 pasos
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main mb-3">
            ¿Qué planto en mi espacio?
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Indicá dónde vas a plantar, subí una foto con las medidas del lugar y
            recibí especies sugeridas con sus condiciones, ventajas y desventajas.
          </p>
        </header>

        <StepIndicator
          steps={STEPS}
          current={step}
          maxReached={maxReached}
          onSelect={goTo}
        />

        {step === 0 && (
          <StepLocation
            value={location}
            onChange={(loc) => {
              setLocation(loc);
              setData(null);
            }}
            onNext={() => goTo(1)}
          />
        )}

        {step === 1 && (
          <StepPhoto
            photoUrl={photoUrl}
            photoName={photoName}
            space={space}
            onPhotoChange={setPhoto}
            onSpaceChange={(next) => {
              setSpace(next);
              setData(null);
            }}
            onBack={() => goTo(0)}
            onNext={handleShowSuggestions}
          />
        )}

        {step === 2 && (
          <StepSuggestions
            loading={loading}
            error={error}
            data={data}
            onRetry={fetchSuggestions}
            onSelect={(suggestion) => {
              setSelected(suggestion);
              goTo(3);
            }}
            onBack={() => goTo(1)}
          />
        )}

        {step === 3 && selected && data && location && (
          <StepDetail
            suggestion={selected}
            location={location}
            space={space}
            photoUrl={photoUrl}
            data={data}
            onBack={() => goTo(2)}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
