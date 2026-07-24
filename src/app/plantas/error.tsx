"use client";

import { useEffect } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlantasError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en /plantas:", error);
  }, [error]);

  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom">
        <ErrorMessage
          message={
            error.message.includes("PERENUAL_API_KEY")
              ? "La API key de plantas no está configurada. Agregá PERENUAL_API_KEY en tu archivo .env.local."
              : "No pudimos cargar el catálogo de plantas. Verificá tu conexión e intentá de nuevo."
          }
          retry={reset}
        />
      </div>
    </div>
  );
}
