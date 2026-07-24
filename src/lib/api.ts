import type { PlantsApiResponse } from "@/types";

const BASE_URL = "https://perenual.com/api";

export async function getPlants(page = 1): Promise<PlantsApiResponse> {
  const apiKey = process.env.PERENUAL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "PERENUAL_API_KEY no está configurada. Agregala en .env.local"
    );
  }

  const url = `${BASE_URL}/species-list?key=${apiKey}&page=${page}&per_page=12`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // ISR: revalidar cada hora
  });

  if (!res.ok) {
    throw new Error(
      `Error al cargar las plantas: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
