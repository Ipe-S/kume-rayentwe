import type { WeatherResponse, GeocodingResult } from "@/types";
import {
  getWeatherDescription,
  getWeatherEmoji,
  classifyGardenZone,
  formatDayName,
} from "@/lib/weather";

interface WeatherDashboardProps {
  weather: WeatherResponse;
  location: GeocodingResult;
}

export default function WeatherDashboard({
  weather,
  location,
}: WeatherDashboardProps) {
  const { current, daily } = weather;

  // Promedio de máximas y precipitación semanal para clasificación
  const avgTemp =
    daily.temperature_2m_max.reduce((a, b) => a + b, 0) /
    daily.temperature_2m_max.length;
  const avgPrecip =
    daily.precipitation_sum.reduce((a, b) => a + b, 0) /
    daily.precipitation_sum.length;

  // Clasificación geográfica real usando lat + lon + elevación + clima
  const zone = classifyGardenZone({
    lat: location.latitude,
    lon: location.longitude,
    elevation: location.elevation,
    avgTemp,
    avgPrecip,
  });

  return (
    <div className="space-y-6">
      {/* Current weather card */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white/70">
                📍 {location.name}
                {location.admin1 ? `, ${location.admin1}` : ""},{" "}
                {location.country}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-7xl" aria-hidden="true">
                {getWeatherEmoji(current.weather_code, current.is_day)}
              </span>
              <div>
                <div className="font-serif text-6xl font-bold">
                  {Math.round(current.temperature_2m)}°C
                </div>
                <div className="text-white/80 text-lg mt-1">
                  {getWeatherDescription(current.weather_code)}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  Sensación {Math.round(current.apparent_temperature)}°C
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs text-white/60 mb-1">Humedad</div>
              <div className="font-semibold text-lg">
                {current.relative_humidity_2m}%
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs text-white/60 mb-1">Viento</div>
              <div className="font-semibold text-lg">
                {Math.round(current.wind_speed_10m)} km/h
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs text-white/60 mb-1">Precipit.</div>
              <div className="font-semibold text-lg">
                {current.precipitation} mm
              </div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs text-white/60 mb-1">UV máx.</div>
              <div className="font-semibold text-lg">
                {daily.uv_index_max[0] ?? "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-6 text-sm text-white/70">
          <span>
            🌅 Amanecer:{" "}
            {daily.sunrise[0]
              ? new Date(daily.sunrise[0]).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
          <span>
            🌇 Atardecer:{" "}
            {daily.sunset[0]
              ? new Date(daily.sunset[0]).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </span>
          {location.elevation != null && (
            <span>⛰️ Elevación: {Math.round(location.elevation)} m snm</span>
          )}
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-text-main">
            Pronóstico 7 días
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {daily.time.map((day, i) => (
            <div
              key={day}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 text-sm font-medium text-text-main">
                {formatDayName(day)}
              </div>
              <span className="text-2xl" aria-hidden="true">
                {getWeatherEmoji(daily.weather_code[i])}
              </span>
              <div className="text-xs text-text-muted w-24 text-center hidden sm:block">
                {getWeatherDescription(daily.weather_code[i])}
              </div>
              <div className="text-xs text-blue-500 w-12 text-center">
                {daily.precipitation_sum[i] > 0
                  ? `${daily.precipitation_sum[i].toFixed(1)} mm`
                  : "—"}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-blue-500">
                  {Math.round(daily.temperature_2m_min[i])}°
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-orange-500">
                  {Math.round(daily.temperature_2m_max[i])}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garden zone — based on real geography */}
      <div className="bg-background rounded-2xl border border-primary/20 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
            {zone.emoji}
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wide font-medium mb-0.5">
              Zona de jardín
            </div>
            <h2 className="font-serif text-xl font-semibold text-primary leading-tight">
              {zone.zone}
            </h2>
            <p className="text-xs text-text-muted mt-1 italic">{zone.biome}</p>
          </div>
        </div>

        <p className="text-text-muted text-sm leading-relaxed mb-5">
          {zone.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plantas recomendadas */}
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
              <span aria-hidden="true">🌱</span> Plantas recomendadas para la zona
            </h3>
            <div className="flex flex-wrap gap-2">
              {zone.recommendedPlants.map((plant) => (
                <span
                  key={plant}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {plant}
                </span>
              ))}
            </div>
          </div>

          {/* Tips de jardín */}
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
              <span aria-hidden="true">💡</span> Tips para tu jardín local
            </h3>
            <ul className="space-y-2">
              {zone.gardenTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-text-muted"
                >
                  <span className="text-primary-light mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coords debug badge */}
        <div className="mt-5 pt-4 border-t border-primary/10 flex flex-wrap gap-3 text-xs text-text-muted">
          <span>
            🌐 {location.latitude.toFixed(2)}°{location.latitude >= 0 ? "N" : "S"},{" "}
            {Math.abs(location.longitude).toFixed(2)}°
            {location.longitude >= 0 ? "E" : "O"}
          </span>
          <span>📊 Temperatura media: {avgTemp.toFixed(1)}°C</span>
          <span>🌧️ Precip. media: {avgPrecip.toFixed(1)} mm/día</span>
        </div>
      </div>
    </div>
  );
}
