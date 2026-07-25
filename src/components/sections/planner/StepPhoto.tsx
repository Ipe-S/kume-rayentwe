"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { LightExposure, SpaceInput } from "@/types";

interface StepPhotoProps {
  photoUrl: string | null;
  photoName: string | null;
  space: SpaceInput;
  onPhotoChange: (url: string | null, name: string | null) => void;
  onSpaceChange: (space: SpaceInput) => void;
  onBack: () => void;
  onNext: () => void;
}

const LIGHT_OPTIONS: { value: LightExposure; label: string; hint: string }[] = [
  { value: "pleno sol", label: "Pleno sol", hint: "6 h o más de sol directo" },
  { value: "media sombra", label: "Media sombra", hint: "3 a 6 h de sol" },
  { value: "sombra", label: "Sombra", hint: "Menos de 3 h de sol" },
];

export default function StepPhoto({
  photoUrl,
  photoName,
  space,
  onPhotoChange,
  onSpaceChange,
  onBack,
  onNext,
}: StepPhotoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const createdUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    };
  }, []);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen no puede superar los 8 MB.");
      return;
    }

    if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
    const url = URL.createObjectURL(file);
    createdUrlRef.current = url;
    setError(null);
    onPhotoChange(url, file.name);
  }

  const areaM2 = ((space.widthCm * space.depthCm) / 10000).toFixed(2);
  const sizeIsValid = space.widthCm > 0 && space.depthCm > 0;

  return (
    <div className="bg-surface rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-text-main mb-2">
        2. Foto y medidas del espacio
      </h2>
      <p className="text-text-muted mb-6">
        Sacá una foto del lugar (o subí una) e indicá cuánto mide, en centímetros.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="sr-only"
        aria-label="Foto del espacio"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {photoUrl ? (
            <figure className="rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Foto del espacio a plantar"
                className="w-full h-56 object-cover"
              />
              <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-text-muted bg-white">
                <span className="truncate">{photoName}</span>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary hover:underline whitespace-nowrap"
                >
                  Cambiar
                </button>
              </figcaption>
            </figure>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full h-56 rounded-xl border-2 border-dashed border-gray-300 bg-background hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl" aria-hidden="true">📷</span>
              <span className="font-medium text-text-main">
                Sacar o subir una foto
              </span>
              <span className="text-xs text-text-muted">
                JPG o PNG, hasta 8 MB
              </span>
            </button>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <p className="mt-3 text-xs text-text-muted">
            La foto queda solo en tu dispositivo: se usa como referencia visual del
            espacio y no se sube a ningún servidor.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-text-main">
              Ancho (cm)
              <input
                type="number"
                min={10}
                max={5000}
                value={space.widthCm || ""}
                onChange={(e) =>
                  onSpaceChange({ ...space, widthCm: Number(e.target.value) })
                }
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-text-main">
              Largo / profundidad (cm)
              <input
                type="number"
                min={10}
                max={5000}
                value={space.depthCm || ""}
                onChange={(e) =>
                  onSpaceChange({ ...space, depthCm: Number(e.target.value) })
                }
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </label>
          </div>

          <p className="text-sm text-text-muted">
            Superficie aproximada:{" "}
            <strong className="text-text-main">{areaM2} m²</strong>
          </p>

          <fieldset>
            <legend className="text-sm font-medium text-text-main mb-2">
              Exposición solar del lugar
            </legend>
            <div className="flex flex-col gap-2">
              {LIGHT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    space.light === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="light"
                    value={option.value}
                    checked={space.light === option.value}
                    onChange={() =>
                      onSpaceChange({ ...space, light: option.value })
                    }
                    className="mt-1 accent-[#2D6A4F]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-text-main">
                      {option.label}
                    </span>
                    <span className="block text-xs text-text-muted">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <button type="button" onClick={onBack} className="btn-secondary">
          Volver
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!sizeIsValid}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ver sugerencias
        </button>
      </div>
    </div>
  );
}
