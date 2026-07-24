import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import CitySearch from "@/components/sections/weather/CitySearch";
import WeatherDashboard from "@/components/sections/weather/WeatherDashboard";
import AutoLocation from "@/components/sections/weather/AutoLocation";
import { searchCity, getWeatherByCoords } from "@/lib/weather";

export const metadata: Metadata = {
  title: "Clima por Zona",
  description:
    "Consultá el clima de tu ciudad y descubrí qué plantas son ideales para tu zona geográfica.",
  openGraph: {
    title: "Clima por Zona — Küme Rayentwe",
    description:
      "Consultá el clima de tu ciudad y descubrí qué plantas son ideales para tu zona geográfica.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

interface ClimaPageProps {
  searchParams: Promise<{ ciudad?: string }>;
}

const QUICK_CITIES = [
  "Buenos Aires",
  "Córdoba",
  "Mendoza",
  "Rosario",
  "Bariloche",
  "Salta",
];

export default async function ClimaPage({ searchParams }: ClimaPageProps) {
  const { ciudad } = await searchParams;

  // ── Búsqueda manual activa ─────────────────────────────────────────────────
  let weatherData = null;
  let locationData = null;
  let searchError: string | null = null;

  if (ciudad) {
    try {
      const results = await searchCity(ciudad);
      if (results.length === 0) {
        searchError = `No encontramos "${ciudad}". Probá con otro nombre.`;
      } else {
        locationData = results[0];
        weatherData = await getWeatherByCoords(
          locationData.latitude,
          locationData.longitude
        );
      }
    } catch (e) {
      searchError =
        e instanceof Error ? e.message : "Error al obtener el clima.";
    }
  }

  const hasManualSearch = Boolean(ciudad);

  return (
    <div className="section-padding bg-background min-h-screen">
      <div className="container-custom max-w-4xl">
        <SectionHeader
          title="Clima por Zona"
          subtitle="Cargamos automáticamente el clima de tu ubicación. También podés buscar cualquier ciudad del mundo."
        />

        {/* Search bar — siempre visible */}
        <div className="mb-8">
          <CitySearch defaultValue={ciudad ?? ""} />
        </div>

        {/* Resultado de búsqueda manual */}
        {hasManualSearch && (
          <>
            {searchError && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6"
              >
                <span className="text-3xl block mb-3" aria-hidden="true">🔍</span>
                <p className="text-red-700 font-medium">{searchError}</p>
                <p className="text-red-500 text-sm mt-1">
                  Probá con el nombre en español o en inglés.
                </p>
              </div>
            )}
            {weatherData && locationData && (
              <WeatherDashboard weather={weatherData} location={locationData} />
            )}
          </>
        )}

        {/* Auto-detección por geolocalización — solo si no hay búsqueda manual */}
        {!hasManualSearch && (
          <>
            <AutoLocation skip={false} />

            {/* Accesos rápidos debajo del auto-detect */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-text-muted mb-3 text-center">
                O explorá estas ciudades
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {QUICK_CITIES.map((city) => (
                  <a
                    key={city}
                    href={`/clima?ciudad=${encodeURIComponent(city)}`}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-text-main hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {city}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
