import { PLANT_CATALOG } from "@/lib/plantCatalog";
import type {
  CatalogPlant,
  ClimateSummary,
  PlantSuggestion,
  SpaceInput,
  WaterNeed,
} from "@/types";

const LIGHT_ORDER = ["sombra", "media sombra", "pleno sol"] as const;

/** Necesidad hídrica esperable según la lluvia diaria promedio de la zona. */
function expectedWaterNeed(avgPrecip: number): WaterNeed {
  if (avgPrecip >= 4) return "alto";
  if (avgPrecip >= 1.2) return "medio";
  return "bajo";
}

function lightDistance(plant: CatalogPlant, space: SpaceInput): number {
  return Math.abs(
    LIGHT_ORDER.indexOf(plant.light) - LIGHT_ORDER.indexOf(space.light)
  );
}

function unitsThatFit(plant: CatalogPlant, space: SpaceInput): number {
  const step = Math.max(plant.planting.spacingCm, 1);
  const cols = Math.floor(space.widthCm / step);
  const rows = Math.floor(space.depthCm / step);
  return Math.max(cols * rows, 0);
}

/**
 * Devuelve la estación actual según la latitud (hemisferio).
 * Hemisferio sur: las estaciones están invertidas respecto al norte.
 */
function currentSeason(lat: number): "primavera" | "verano" | "otoño" | "invierno" {
  const month = new Date().getMonth(); // 0 = enero
  const isNorth = lat >= 0;

  // Estaciones del hemisferio norte (invertidas para el sur)
  const northSeason = (): "primavera" | "verano" | "otoño" | "invierno" => {
    if (month >= 2 && month <= 4) return "primavera";
    if (month >= 5 && month <= 7) return "verano";
    if (month >= 8 && month <= 10) return "otoño";
    return "invierno";
  };

  const s = northSeason();
  if (isNorth) return s;
  // Hemisferio sur: invertir
  const inv: Record<string, "primavera" | "verano" | "otoño" | "invierno"> = {
    primavera: "otoño",
    verano: "invierno",
    otoño: "primavera",
    invierno: "verano",
  };
  return inv[s];
}

/**
 * Puntúa si la estación actual coincide con la temporada de siembra.
 * Penaliza pero no descarta: el usuario puede planificar con anticipación.
 */
function seasonScore(plant: CatalogPlant, season: string): number {
  const s = plant.planting.season.toLowerCase();
  // "todo el año" = sin penalización
  if (s.includes("todo el año") || s.includes("todo año")) return 0;
  if (s.includes(season)) return 0;          // ideal
  // Estación adyacente: penalización leve
  const adjacent: Record<string, string[]> = {
    primavera: ["verano", "invierno"],
    verano:    ["primavera", "otoño"],
    otoño:     ["verano", "invierno"],
    invierno:  ["otoño", "primavera"],
  };
  if (adjacent[season]?.some((s2) => s.includes(s2))) return -10;
  return -20; // estación opuesta
}

function scorePlant(
  plant: CatalogPlant,
  space: SpaceInput,
  climate: ClimateSummary,
  lat: number
): PlantSuggestion {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // ── Estación actual ───────────────────────────────────────────────────────
  const season = currentSeason(lat);
  const sPenalty = seasonScore(plant, season);
  score += sPenalty;
  if (sPenalty === 0) {
    reasons.push(`Es época ideal de siembra en tu zona (${season}).`);
  } else if (sPenalty === -10) {
    warnings.push(
      `Su temporada óptima es ${plant.planting.season}; podés anticipar la siembra en almácigo.`
    );
  } else {
    warnings.push(
      `Fuera de temporada ahora (${season}). Mejor sembrar en: ${plant.planting.season}.`
    );
  }

  // ── Clima: temperatura media semanal ──────────────────────────────────────
  const { avgTemp, avgPrecip } = climate;
  if (avgTemp < plant.tempMin) {
    const gap = plant.tempMin - avgTemp;
    score -= Math.min(gap * 6, 40);
    warnings.push(
      `La temperatura media (${avgTemp.toFixed(0)} °C) está ${gap.toFixed(0)} °C por debajo de su mínimo tolerado.`
    );
  } else if (avgTemp > plant.tempMax) {
    const gap = avgTemp - plant.tempMax;
    score -= Math.min(gap * 6, 40);
    warnings.push(
      `La zona supera su máximo tolerado (${plant.tempMax} °C): necesitará sombra en verano.`
    );
  } else {
    reasons.push(
      `Temperatura de la zona (${avgTemp.toFixed(0)} °C) dentro de su rango ideal (${plant.tempMin}–${plant.tempMax} °C).`
    );
  }

  // ── Clima: régimen de lluvias ─────────────────────────────────────────────
  const needed = expectedWaterNeed(avgPrecip);
  const waterGap = Math.abs(
    (["bajo", "medio", "alto"] as WaterNeed[]).indexOf(plant.water) -
      (["bajo", "medio", "alto"] as WaterNeed[]).indexOf(needed)
  );
  if (waterGap === 0) {
    reasons.push(
      `Demanda de riego (${plant.water}) alineada con las lluvias de la zona (${avgPrecip.toFixed(1)} mm/día).`
    );
  } else {
    score -= waterGap * 12;
    warnings.push(
      plant.water === "alto"
        ? "Requiere riego complementario: la zona tiene lluvias escasas."
        : "La zona es más húmeda: asegurá buen drenaje para evitar pudrición."
    );
  }

  // ── Luz disponible ────────────────────────────────────────────────────────
  const lightGap = lightDistance(plant, space);
  if (lightGap === 0) {
    reasons.push(`Se adapta perfectamente a la exposición declarada (${space.light}).`);
  } else {
    score -= lightGap * 16;
    warnings.push(
      `Prefiere ${plant.light}; con ${space.light} su crecimiento será más lento.`
    );
  }

  // ── Espacio disponible ────────────────────────────────────────────────────
  const fits = unitsThatFit(plant, space);
  const minSide = Math.min(space.widthCm, space.depthCm);
  if (plant.matureWidthCm > Math.max(space.widthCm, space.depthCm)) {
    score -= 40;
    warnings.push(
      `Al madurar ocupa ${plant.matureWidthCm} cm de ancho: no entra en el espacio medido.`
    );
  } else if (plant.matureWidthCm > minSide) {
    score -= 12;
    warnings.push(
      `El espacio es justo: al madurar ocupa ${plant.matureWidthCm} cm de ancho.`
    );
  } else {
    reasons.push(
      `Cabe cómoda en ${space.widthCm} × ${space.depthCm} cm (ocupa ${plant.matureWidthCm} cm al madurar).`
    );
  }

  return {
    plant,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    warnings,
    unitsThatFit: fits,
  };
}

export function suggestPlants(
  space: SpaceInput,
  climate: ClimateSummary,
  lat: number,
  limit = 6
): PlantSuggestion[] {
  return PLANT_CATALOG.map((plant) => scorePlant(plant, space, climate, lat))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
