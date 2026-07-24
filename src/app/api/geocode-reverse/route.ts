import { NextResponse } from "next/server";
import type { GeocodingResult } from "@/types";

// Open-Meteo no tiene reverse geocoding, usamos el endpoint de búsqueda
// con la API de nominatim (OpenStreetMap) que sí acepta coordenadas.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

interface NominatimResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
  lat: string;
  lon: string;
  display_name: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "Parámetros lat y lon son requeridos." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`,
      {
        headers: {
          // Nominatim requiere un User-Agent identificador
          "User-Agent": "KumeRayentwe/1.0 (paisajismo-app)",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) throw new Error("No se pudo obtener la ubicación");

    const data: NominatimResponse = await res.json();
    const addr = data.address;

    // Prioridad: ciudad > localidad > municipio > condado
    const cityName =
      addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? "Ubicación desconocida";

    // Construir objeto compatible con GeocodingResult
    const result: GeocodingResult = {
      id: 0,
      name: cityName,
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      country: addr.country ?? "",
      country_code: (addr.country_code ?? "").toUpperCase(),
      admin1: addr.state,
      timezone: "auto",
    };

    return NextResponse.json(result);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al obtener la ubicación.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
