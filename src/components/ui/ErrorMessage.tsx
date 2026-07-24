import type { ErrorMessageProps } from "@/types";

export default function ErrorMessage({
  message = "Algo salió mal. Por favor, intentá de nuevo.",
  retry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4"
    >
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div>
        <h3 className="font-serif text-xl font-semibold text-text-main mb-2">
          Ocurrió un error
        </h3>
        <p className="text-text-muted text-sm max-w-md">{message}</p>
      </div>

      {retry && (
        <button
          onClick={retry}
          className="btn-primary mt-2"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
