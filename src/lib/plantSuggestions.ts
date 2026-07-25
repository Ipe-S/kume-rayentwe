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

function scorePlant(
  plant: CatalogPlant,
  space: SpaceInput,
  climate: ClimateSummary
): PlantSuggestion {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // ── Clima: temperatura media semanal ──────────────────────────────────────
  const { avgTemp, avgPrecip } = climate;
  if (avgTemp < plant.tempMin) {
    const gap = plant.tempMin - avgTemp;
    score -= Math.min(gap * 6, 45);
    warnings.push(
      `La temperatura media de la zona (${avgTemp.toFixed(0)} °C) está ${gap.toFixed(0)} °C por debajo de su mínimo tolerado.`
    );
  } else if (avgTemp > plant.tempMax) {
    const gap = avgTemp - plant.tempMax;
    score -= Math.min(gap * 6, 45);
    warnings.push(
      `La zona supera su máximo tolerado (${plant.tempMax} °C): necesitará sombra extra en verano.`
    );
  } else {
    reasons.push(
      `Tolera el rango térmico de la zona (${plant.tempMin}–${plant.tempMax} °C).`
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
      `Su demanda de riego ${plant.water} coincide con las lluvias de la zona (${avgPrecip.toFixed(1)} mm/día).`
    );
  } else {
    score -= waterGap * 14;
    warnings.push(
      plant.water === "alto"
        ? "Requiere riego complementario: la zona tiene lluvias escasas."
        : "La zona es más húmeda de lo que necesita: asegurá buen drenaje."
    );
  }

  // ── Luz disponible ────────────────────────────────────────────────────────
  const lightGap = lightDistance(plant, space);
  if (lightGap === 0) {
    reasons.push(`Se adapta a la exposición declarada (${space.light}).`);
  } else {
    score -= lightGap * 18;
    warnings.push(
      `Prefiere ${plant.light}; con ${space.light} su desarrollo será más lento.`
    );
  }

  // ── Espacio disponible ────────────────────────────────────────────────────
  const minSide = Math.min(space.widthCm, space.depthCm);
  const fits = unitsThatFit(plant, space);
  if (plant.matureWidthCm > Math.max(space.widthCm, space.depthCm)) {
    score -= 45;
    warnings.push(
      `Adulta alcanza ${plant.matureWidthCm} cm de ancho: no entra en el espacio medido.`
    );
  } else if (plant.matureWidthCm > minSide) {
    score -= 15;
    warnings.push(
      `El espacio es justo: al madurar ocupa ${plant.matureWidthCm} cm de ancho.`
    );
  } else {
    reasons.push(
      `Entra cómoda en ${space.widthCm} × ${space.depthCm} cm (ocupa ${plant.matureWidthCm} cm al madurar).`
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
  limit = 6
): PlantSuggestion[] {
  return PLANT_CATALOG.map((plant) => scorePlant(plant, space, climate))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
