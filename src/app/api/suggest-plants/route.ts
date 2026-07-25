import { NextResponse } from "next/server";
import {
  classifyGardenZone,
  getWeatherByCoords,
  getWeatherDescription,
  getWeatherEmoji,
} from "@/lib/weather";
import { suggestPlants } from "@/lib/plantSuggestions";
import type {
  ClimateSummary,
  LightExposure,
  SuggestionResponse,
} from "@/types";

const LIGHT_VALUES: LightExposure[] = ["pleno sol", "media sombra", "sombra"];

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");
  const widthCm = parseFloat(searchParams.get("width") ?? "");
  const depthCm = parseFloat(searchParams.get("depth") ?? "");
  const light = searchParams.get("light") ?? "";

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Coordenadas inválidas." },
      { status: 400 }
    );
  }

  if (isNaN(widthCm) || isNaN(depthCm) || widthCm <= 0 || depthCm <= 0) {
    return NextResponse.json(
      { error: "El ancho y el largo del espacio deben ser mayores a 0 cm." },
      { status: 400 }
    );
  }

  if (!LIGHT_VALUES.includes(light as LightExposure)) {
    return NextResponse.json(
      { error: "Exposición solar inválida." },
      { status: 400 }
    );
  }

  try {
    const weather = await getWeatherByCoords(lat, lon);

    const climate: ClimateSummary = {
      avgTemp: average(weather.daily.temperature_2m_max),
      avgPrecip: average(weather.daily.precipitation_sum),
      currentTemp: weather.current.temperature_2m,
      humidity: weather.current.relative_humidity_2m,
      weatherDescription: getWeatherDescription(weather.current.weather_code),
      weatherEmoji: getWeatherEmoji(
        weather.current.weather_code,
        weather.current.is_day
      ),
    };

    const zone = classifyGardenZone({
      lat,
      lon,
      avgTemp: climate.avgTemp,
      avgPrecip: climate.avgPrecip,
    });

    const body: SuggestionResponse = {
      zone,
      climate,
      suggestions: suggestPlants(
        { widthCm, depthCm, light: light as LightExposure },
        climate
      ),
    };

    return NextResponse.json(body);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al generar las sugerencias.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
