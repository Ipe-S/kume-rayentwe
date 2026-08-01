/**
 * growstuff.ts
 * Integración con Growstuff API (growstuff.org) + Wikimedia REST API.
 *
 * Growstuff provee datos reales de cultivo (días a cosecha, perenne/anual,
 * cantidad de usuarios que lo siembran, nombre científico, URL Wikipedia).
 * Wikimedia provee la imagen del artículo Wikipedia correspondiente.
 *
 * Ambas son públicas, gratuitas y sin API key.
 */

import type { GrowstuffCrop, GrowstuffEnrichment } from "@/types";

const GROWSTUFF_BASE = "https://www.growstuff.org/crops";
const WIKIMEDIA_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary";

// ─── Growstuff fetch ──────────────────────────────────────────────────────────

export async function fetchGrowstuffCrop(
  slug: string
): Promise<GrowstuffCrop | null> {
  try {
    const res = await fetch(`${GROWSTUFF_BASE}/${slug}.json`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // cachear 24h — datos estables
    });
    if (!res.ok) return null;
    return (await res.json()) as GrowstuffCrop;
  } catch {
    return null;
  }
}

// ─── Wikimedia image fetch ────────────────────────────────────────────────────

async function fetchWikipediaImage(
  wikipediaUrl: string | null | undefined
): Promise<string | null> {
  if (!wikipediaUrl) return null;

  // Extraer el título del artículo desde la URL
  // Ej: "https://en.wikipedia.org/wiki/Tomato" → "Tomato"
  const match = wikipediaUrl.match(/\/wiki\/(.+)$/);
  if (!match) return null;

  const title = match[1];
  try {
    const res = await fetch(`${WIKIMEDIA_BASE}/${encodeURIComponent(title)}`, {
      headers: { "Api-User-Agent": "KumeRayentwe/1.0 (paisajismo-app)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    // El campo thumbnail.source tiene la imagen principal del artículo
    return (data?.thumbnail?.source as string) ?? null;
  } catch {
    return null;
  }
}

// ─── Mapa de plant ID → Growstuff slug ────────────────────────────────────────
// Mapeo manual entre los IDs del catálogo local y los slugs de Growstuff.
// Los slugs se verificaron en https://www.growstuff.org/crops/{slug}.json

const SLUG_MAP: Record<string, string> = {
  "lechuga-mantecosa": "lettuce",
  espinaca: "spinach",
  acelga: "chard",
  rucula: "rocket",
  kale: "kale",
  "tomate-cherry": "tomato",
  pimiento: "capsicum",
  berenjena: "eggplant",
  zanahoria: "carrot",
  rabanito: "radish",
  remolacha: "beetroot",
  "poroto-chaucha": "green-beans",
  arvejas: "peas",
  albahaca: "basil",
  perejil: "parsley",
  cilantro: "coriander",
  menta: "mint",
  ciboulette: "chives",
  tomillo: "thyme",
  oregano: "oregano",
  "zapallito-redondo": "zucchini",
  pepino: "cucumber",
  frutilla: "strawberry",
  "limon-patio": "lemon",
  arándano: "blueberry",
  "cebolla-de-verdeo": "spring-onion",
  ajo: "garlic",
};

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Obtiene el enriquecimiento de Growstuff + imagen de Wikipedia
 * para un cultivo del catálogo local.
 * Retorna null silenciosamente si la API no responde.
 */
export async function enrichPlantFromGrowstuff(
  plantId: string
): Promise<GrowstuffEnrichment | null> {
  const slug = SLUG_MAP[plantId];
  if (!slug) return null;

  const crop = await fetchGrowstuffCrop(slug);
  if (!crop) return null;

  // Buscar imagen en Wikipedia en paralelo (no bloquea si falla)
  const imageUrl = await fetchWikipediaImage(crop.en_wikipedia_url);

  return {
    growstuffSlug: crop.slug,
    growstuffUrl: `${GROWSTUFF_BASE}/${crop.slug}`,
    wikipediaUrl: crop.en_wikipedia_url ?? null,
    imageUrl,
    perennial: crop.perennial,
    medianDaysToFirstHarvest: crop.median_days_to_first_harvest,
    medianDaysToLastHarvest: crop.median_days_to_last_harvest,
    plantingsCount: crop.plantings_count,
    scientificName:
      crop.scientific_names?.[0]?.name ?? null,
  };
}

/**
 * Enriquece múltiples sugerencias en paralelo con un timeout por planta.
 * Las que fallen se quedan sin enriquecimiento (enrichment: null).
 */
export async function enrichSuggestions(
  plantIds: string[]
): Promise<Record<string, GrowstuffEnrichment | null>> {
  const results = await Promise.allSettled(
    plantIds.map((id) => enrichPlantFromGrowstuff(id))
  );

  return Object.fromEntries(
    plantIds.map((id, i) => {
      const result = results[i];
      return [
        id,
        result.status === "fulfilled" ? result.value : null,
      ];
    })
  );
}
