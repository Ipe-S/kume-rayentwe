import type { ReactNode } from "react";

// ─── Layout Components ───────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

// ─── UI Components ───────────────────────────────────────────────────────────

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

// ─── Plant / API ─────────────────────────────────────────────────────────────

export interface PlantImage {
  original_url: string | null;
  regular_url: string | null;
  medium_url: string | null;
  small_url: string | null;
  thumbnail: string | null;
}

export interface Plant {
  id: number;
  common_name: string | null;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image: PlantImage | null;
}

export interface PlantsApiResponse {
  data: Plant[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

export interface PlantCardProps {
  name: string;
  commonName: string | null;
  imageUrl: string | null;
  cycle: string;
  watering: string;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  description: string;
  category: "urbano" | "terraza" | "patio" | "comercial";
  imageUrl: string;
  location: string;
  year: number;
}

// ─── Weather / Clima ──────────────────────────────────────────────────────────

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // provincia / estado
  timezone: string;
  population?: number;
  elevation?: number; // metros snm — provisto por Open-Meteo geocoding
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  wind_speed_10m: number;
  weather_code: number;
  is_day: number;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weather_code: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyWeather;
}

// ─── Planificador de plantación (wizard) ─────────────────────────────────────

export type LightExposure = "pleno sol" | "media sombra" | "sombra";
export type WaterNeed = "bajo" | "medio" | "alto";

export interface PlantingConditions {
  soil: string;
  spacingCm: number;
  depthCm: number;
  season: string;
  watering: string;
  care: string;
}

export interface CatalogPlant {
  id: string;
  commonName: string;
  scientificName: string;
  emoji: string;
  category: string;
  matureWidthCm: number;
  matureHeightCm: number;
  light: LightExposure;
  water: WaterNeed;
  /** Rango de temperatura media semanal tolerado (°C) */
  tempMin: number;
  tempMax: number;
  summary: string;
  advantages: string[];
  disadvantages: string[];
  planting: PlantingConditions;
}

export interface PlantSuggestion {
  plant: CatalogPlant;
  /** Compatibilidad 0-100 con la ubicación y el espacio declarados */
  score: number;
  reasons: string[];
  warnings: string[];
  /** Cantidad de ejemplares que entran en el espacio disponible */
  unitsThatFit: number;
}

export interface SpaceInput {
  widthCm: number;
  depthCm: number;
  light: LightExposure;
}

export interface PlannerLocation {
  label: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
  /** Cómo se obtuvo la ubicación */
  source: "gps" | "manual";
}

export interface SuggestionRequest extends SpaceInput {
  latitude: number;
  longitude: number;
}

export interface ClimateSummary {
  avgTemp: number;
  avgPrecip: number;
  currentTemp: number;
  humidity: number;
  weatherDescription: string;
  weatherEmoji: string;
}

export interface SuggestionResponse {
  zone: WeatherZoneInfo;
  climate: ClimateSummary;
  suggestions: PlantSuggestion[];
}

export interface WeatherZoneInfo {
  zone: string;
  biome: string;
  emoji: string;
  description: string;
  recommendedPlants: string[];
  gardenTips: string[];
}
