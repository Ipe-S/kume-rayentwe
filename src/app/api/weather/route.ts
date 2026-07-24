import { NextResponse } from "next/server";
import { getWeatherByCoords } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "Parámetros lat y lon son requeridos y deben ser números." },
      { status: 400 }
    );
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Coordenadas fuera de rango válido." },
      { status: 400 }
    );
  }

  try {
    const data = await getWeatherByCoords(lat, lon);
    return NextResponse.json(data);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al obtener el clima.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
