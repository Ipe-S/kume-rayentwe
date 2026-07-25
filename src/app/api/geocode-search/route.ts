import { NextResponse } from "next/server";
import { searchCity } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Ingresá al menos 2 caracteres." },
      { status: 400 }
    );
  }

  try {
    const results = await searchCity(query);
    return NextResponse.json({ results });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al buscar la ubicación.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
