"use client";

import { useEffect } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClimaError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en /clima:", error);
  }, [error]);

  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom max-w-4xl">
        <ErrorMessage
          message="No pudimos obtener los datos del clima. Verificá tu conexión e intentá de nuevo."
          retry={reset}
        />
      </div>
    </div>
  );
}
