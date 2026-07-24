"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CitySearchProps {
  defaultValue?: string;
}

export default function CitySearch({ defaultValue = "" }: CitySearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/clima?ciudad=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Buenos Aires, Mendoza, Córdoba…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          aria-label="Buscar ciudad"
          autoComplete="off"
          minLength={2}
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        Ver clima
      </button>
    </form>
  );
}
