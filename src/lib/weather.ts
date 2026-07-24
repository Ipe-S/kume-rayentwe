import type {
  GeocodingResponse,
  GeocodingResult,
  WeatherResponse,
  WeatherZoneInfo,
} from "@/types";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_URL = "https://api.open-meteo.com/v1";

// ─── Geocoding ────────────────────────────────────────────────────────────────

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "6",
    language: "es",
    format: "json",
  });

  const res = await fetch(`${GEO_URL}/search?${params}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) throw new Error("No se pudo buscar la ciudad");

  const data: GeocodingResponse = await res.json();
  return data.results ?? [];
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "weather_code",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  const res = await fetch(`${WEATHER_URL}/forecast?${params}`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok)
    throw new Error("No se pudo obtener el clima para esta ubicación");

  return res.json();
}

// ─── Weather code helpers ─────────────────────────────────────────────────────

export function getWeatherDescription(code: number): string {
  if (code === 0) return "Cielo despejado";
  if (code <= 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code <= 49) return "Niebla";
  if (code <= 59) return "Llovizna";
  if (code <= 69) return "Lluvia";
  if (code <= 79) return "Nevada";
  if (code <= 82) return "Lluvia intensa";
  if (code <= 86) return "Nevada intensa";
  if (code <= 99) return "Tormenta";
  return "Desconocido";
}

export function getWeatherEmoji(code: number, isDay = 1): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "⛅" : "🌤️";
  if (code === 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 59) return "🌦️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 82) return "⛈️";
  if (code <= 86) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

// ─── Geographic Zone Classification ──────────────────────────────────────────
//
// La clasificación combina:
//   • Latitud absoluta  → zona climática global (tropical / templada / polar)
//   • Longitud          → continente / región (América, Europa, Asia, África, Oceanía)
//   • Elevación         → corrección altitudinal (>2000 m = montaña)
//   • Temperatura media → validación con datos reales del forecast
//   • Precipitación     → diferenciación húmedo / seco dentro de cada zona

export interface GeoContext {
  lat: number;
  lon: number;
  elevation?: number; // metros snm (opcional, provisto por Open-Meteo)
  avgTemp: number; // promedio de máximas semanales
  avgPrecip: number; // promedio diario de precipitación (mm)
}

export function classifyGardenZone(ctx: GeoContext): WeatherZoneInfo {
  const { lat, lon, elevation = 0, avgTemp, avgPrecip } = ctx;
  const absLat = Math.abs(lat);

  // ── 1. ALTA MONTAÑA (cualquier latitud, >2500 m) ──────────────────────────
  if (elevation > 2500) {
    return {
      zone: "Alta Montaña",
      biome: "Región altoandina / alpina",
      emoji: "🏔️",
      description:
        "Zona de alta montaña con suelos pobres, heladas frecuentes y radiación UV intensa. La vegetación es baja, resistente y muy especializada.",
      recommendedPlants: [
        "Puna (Stipa ichu)",
        "Yareta (Azorella compacta)",
        "Quenoa (Polylepis incana)",
        "Cactus puneños (Trichocereus)",
        "Musgos y líquenes",
        "Pensamiento de montaña",
      ],
      gardenTips: [
        "Usá especies nativas de alta montaña adaptadas a heladas nocturnas",
        "El suelo requiere enmiendas orgánicas para mejorar su fertilidad",
        "Protegé los cultivos con invernaderos o túneles plásticos",
        "Cosechá agua de lluvia y deshielo para el riego",
        "Evitá plantas de raíz profunda — los suelos rocosos limitan el crecimiento",
      ],
    };
  }

  // ── 2. ZONA POLAR / SUBPOLAR (>60° latitud) ───────────────────────────────
  if (absLat > 60) {
    return {
      zone: "Subpolar / Tundra",
      biome: "Tundra y taiga",
      emoji: "🧊",
      description:
        "Inviernos extremadamente fríos y veranos muy cortos. La vegetación se limita a especies de crecimiento lento y alta resistencia al frío.",
      recommendedPlants: [
        "Abeto (Picea abies)",
        "Pino silvestre (Pinus sylvestris)",
        "Abedul (Betula pendula)",
        "Brezo (Calluna vulgaris)",
        "Sauce ártico (Salix arctica)",
        "Rododendro resistente al frío",
      ],
      gardenTips: [
        "Solo plantá en la ventana de verano (junio-agosto en norte, dic-feb en sur)",
        "Usá variedades de maduración ultrarrápida para hortalizas",
        "El suelo permafrost requiere camas elevadas con drenaje",
        "Los invernaderos son esenciales para extender la temporada",
        "Aprovechá el sol de medianoche con plantas de día largo",
      ],
    };
  }

  // ── 3. ZONA TROPICAL (< 23.5° latitud) ───────────────────────────────────
  if (absLat <= 23.5) {
    if (avgPrecip >= 3 && avgTemp >= 22) {
      // Tropical húmedo / selva
      const isAmerica = lon >= -120 && lon <= -30;
      const isAfrica = lon >= -20 && lon <= 55;
      const isAsia = lon > 55 && lon <= 180;
      return {
        zone: "Tropical Húmedo",
        biome: isAmerica
          ? "Selva amazónica / bosque lluvioso americano"
          : isAfrica
            ? "Bosque ecuatorial africano"
            : isAsia
              ? "Selva tropical asiática"
              : "Bosque lluvioso tropical",
        emoji: "🌴",
        description:
          "Clima cálido y muy húmedo todo el año. Biodiversidad máxima, crecimiento rápido y lluvia abundante. Ideal para plantas tropicales exuberantes.",
        recommendedPlants: isAmerica
          ? [
              "Heliconias",
              "Bromelias (Tillandsia)",
              "Orquídeas nativas",
              "Palmera de coco",
              "Árbol de caucho (Ficus elastica)",
              "Caña de azúcar",
            ]
          : isAfrica
            ? [
                "Plátano (Musa)",
                "Papayo",
                "Cacao",
                "Plumbago auriculata",
                "Strelitzia (Ave del paraíso)",
                "Frangipani (Plumeria)",
              ]
            : [
                "Ylang-ylang",
                "Bambú tropical",
                "Hibisco",
                "Jengibre ornamental",
                "Taro (Colocasia)",
                "Pitahaya (Dragonfruit)",
              ],
        gardenTips: [
          "El drenaje es crítico: las raíces se pudren con suelo encharcado",
          "Instalá sistemas de drenaje profundo antes de plantar",
          "Usá mulch orgánico grueso para regular temperatura del suelo",
          "Aprovechá el dosel natural para plantas de sombra",
          "La humedad alta favorece hongos: rotá fungicidas preventivos",
        ],
      };
    }

    // Tropical seco / sabana
    return {
      zone: "Tropical Seco / Sabana",
      biome:
        lon >= -120 && lon <= -30
          ? "Sabana y bosque seco americano"
          : "Sabana tropical",
      emoji: "🌵",
      description:
        "Temperatura alta todo el año con una marcada estación seca. La vegetación es resistente a la sequía con lluvias estacionales intensas.",
      recommendedPlants: [
        "Cactus columnares",
        "Agave americano",
        "Nopal (Opuntia)",
        "Palo verde (Parkinsonia)",
        "Buganvilla (Bougainvillea)",
        "Mezquite (Prosopis)",
      ],
      gardenTips: [
        "Plantá en la estación lluviosa para aprovechar el agua natural",
        "El riego por goteo es indispensable en la estación seca",
        "Usá sustratos con alta proporción de arena para buen drenaje",
        "Recogé agua de lluvia en cisternas durante la temporada húmeda",
        "Las plantas xerófitas no necesitan riego una vez establecidas",
      ],
    };
  }

  // ── 4. ZONA SUBTROPICAL (23.5° – 35° latitud) ────────────────────────────
  if (absLat > 23.5 && absLat <= 35) {
    // Subtropical húmedo (este de los continentes: Cono Sur, SE USA, China E, Japón S)
    const isHumidSubtropical =
      (lat < 0 && lon >= -75 && lon <= -45) || // Pampa húmeda, sur de Brasil
      (lat > 0 && lon >= -100 && lon <= -70) || // SE USA
      (lat > 0 && lon >= 100 && lon <= 145); // E China, Japón

    if (isHumidSubtropical && avgPrecip >= 1.5) {
      return {
        zone: "Subtropical Húmedo",
        biome:
          lat < 0
            ? "Pampa húmeda / Bosque del Plata"
            : "Bosque subtropical húmedo",
        emoji: "🌿",
        description:
          "Veranos cálidos y húmedos, inviernos suaves. Suelos fértiles con lluvias bien distribuidas. Excelente para una gran variedad de jardines.",
        recommendedPlants:
          lat < 0
            ? [
                "Jacarandá (Jacaranda mimosifolia)",
                "Ceibo (Erythrina crista-galli)",
                "Lapachos",
                "Palo borracho (Ceiba speciosa)",
                "Gramíneas pampeanas",
                "Cortadera (Cortaderia selloana)",
              ]
            : [
                "Magnolia",
                "Azalea",
                "Camelia japónica",
                "Bambú",
                "Wisteria",
                "Gardenia",
              ],
        gardenTips: [
          "Los suelos son ricos: aprovechalos con plantaciones densas",
          "Regá en profundidad 2-3 veces por semana en verano",
          "El otoño es ideal para plantar árboles y arbustos",
          "Controlá el vigor de las gramíneas nativas: crecen muy rápido",
          "El jacarandá florece en primavera antes de brotar hojas: plantalo visible",
        ],
      };
    }

    // Mediterráneo (costa oeste de continentes: Chile central, California, Mediterráneo)
    const isMediterranean =
      (lat < 0 && lon >= -75 && lon <= -65) || // Chile central
      (lat > 30 && lon >= -10 && lon <= 40) || // Cuenca mediterránea
      (lat > 30 && lon >= -125 && lon <= -115); // California

    if (isMediterranean) {
      return {
        zone: "Mediterráneo",
        biome:
          lat < 0
            ? "Matorral chileno (matorral esclerófilo)"
            : lon >= -10 && lon <= 40
              ? "Matorral mediterráneo europeo (maquis / garrigue)"
              : "Chaparral californiano",
        emoji: "🫒",
        description:
          "Veranos secos y cálidos, inviernos lluviosos y suaves. Bioma de alta riqueza florística con plantas aromáticas y esclerófilas.",
        recommendedPlants:
          lat < 0
            ? [
                "Quillay (Quillaja saponaria)",
                "Boldo (Peumus boldus)",
                "Litre (Lithrea caustica)",
                "Puya",
                "Lavanda",
                "Rosmarino",
              ]
            : [
                "Olivo (Olea europaea)",
                "Lavanda (Lavandula)",
                "Romero (Salvia rosmarinus)",
                "Tomillo (Thymus)",
                "Adelfa (Nerium oleander)",
                "Buganvilla (Bougainvillea)",
              ],
        gardenTips: [
          "Plantá en otoño para que las raíces se establezcan con las lluvias",
          "El riego de verano debe ser profundo pero infrecuente",
          "Usá grava o piedra como cobertura del suelo para reducir evaporación",
          "Las plantas aromáticas mediterráneas requieren suelo bien drenado",
          "Elegí variedades tolerantes a la sequía estival",
        ],
      };
    }

    // Subtropical seco / árido (desiertos subtropicales)
    return {
      zone: "Subtropical Árido",
      biome:
        lon >= -20 && lon <= 55
          ? "Desierto del Sahara / Oriente Medio"
          : lon < 0
            ? "Desierto de Atacama / Monte argentino"
            : "Desierto subtropical",
      emoji: "🏜️",
      description:
        "Una de las zonas más áridas del planeta. Escasísimas precipitaciones y alta evapotranspiración. Solo prosperan plantas xerófitas muy especializadas.",
      recommendedPlants:
        lon >= -75 && lon <= -60
          ? [
              "Jarilla (Larrea divaricata)",
              "Retamo (Bulnesia retama)",
              "Chañar (Geoffroea decorticans)",
              "Cactus del monte (Opuntia)",
              "Algarrobo blanco (Prosopis alba)",
              "Piquillín (Condalia microphylla)",
            ]
          : [
              "Dátilero (Phoenix dactylifera)",
              "Acacia (Acacia tortilis)",
              "Tamarindo del desierto",
              "Aloe vera",
              "Cactus y suculentas",
              "Euphorbia candelabrum",
            ],
      gardenTips: [
        "El riego es artificial y obligatorio: priorizá riego por goteo profundo",
        "Usá sustratos arenosos con muy buen drenaje",
        "Plantá en otoño/invierno para evitar el estrés del verano",
        "Las cubiertas de grava blanca reflejan el calor y reducen el riego",
        "Los muros de tapia o adobe amortiguan las temperaturas extremas",
      ],
    };
  }

  // ── 5. ZONA TEMPLADA (35° – 55° latitud) ──────────────────────────────────
  if (absLat > 35 && absLat <= 55) {
    // Patagonia / Chile austral (sur de Sudamérica)
    if (lat < -38 && lon >= -76 && lon <= -60) {
      const isWet = lon < -68; // cordillera y canales = muy húmedo
      return {
        zone: isWet ? "Bosque Valdiviano" : "Estepa Patagónica",
        biome: isWet
          ? "Bosque templado lluvioso del sur (Bosque Valdiviano)"
          : "Estepa patagónica árida y fría",
        emoji: isWet ? "🌧️" : "💨",
        description: isWet
          ? "El bosque templado más austral del mundo. Lluvias abundantes, temperaturas frescas y suelos ácidos ricos en materia orgánica."
          : "Meseta fría y ventosa con escasas precipitaciones. Vegetación baja y resistente al viento constante del oeste.",
        recommendedPlants: isWet
          ? [
              "Alerce (Fitzroya cupressoides)",
              "Coihue (Nothofagus dombeyi)",
              "Arrayán (Luma apiculata)",
              "Fuchsia magellanica",
              "Nalca (Gunnera tinctoria)",
              "Helecho arbóreo (Blechnum)",
            ]
          : [
              "Mata negra (Junellia tridens)",
              "Coirón (Stipa speciosa)",
              "Neneo (Mulinum spinosum)",
              "Calafate (Berberis microphylla)",
              "Molle (Schinus johnstonii)",
              "Retamo patagónico",
            ],
        gardenTips: isWet
          ? [
              "Aprovechá la lluvia natural: rara vez necesitarás riego extra",
              "Usá especies del bosque valdiviano adaptadas a la sombra húmeda",
              "El suelo ácido favorece rododendros, azaleas y helechos",
              "Protegé las plantas nuevas de las heladas tardías de primavera",
              "Los helechos y musgos son excelentes para cubrir el suelo",
            ]
          : [
              "Los cortavientos son indispensables: plantá filas de arbustos bajos",
              "Usá únicamente plantas nativas de la estepa patagónica",
              "El riego debe ser profundo e infrecuente para estimular raíces largas",
              "Las plantas en cojín son ideales para resistir el viento",
              "Evitá plantas de hoja grande: el viento las deshidrata rápidamente",
            ],
      };
    }

    // Templado oceánico (Europa oeste, costa NW americana, Nueva Zelanda)
    const isOceanic =
      (lat > 0 && lon >= -12 && lon <= 20) || // Europa occidental
      (lat > 0 && lon >= -130 && lon <= -110) || // Costa oeste EE.UU.
      (lat < -35 && lon >= 165 && lon <= 180); // Nueva Zelanda

    if (isOceanic) {
      return {
        zone: "Templado Oceánico",
        biome:
          lat > 0 && lon >= -12 && lon <= 20
            ? "Bosque caducifolio europeo"
            : "Bosque templado oceánico",
        emoji: "🌳",
        description:
          "Lluvias frecuentes y distribuidas todo el año, temperaturas moderadas sin extremos. Ideal para jardines de gran diversidad y producción de hortalizas.",
        recommendedPlants:
          lat > 0 && lon >= -12 && lon <= 20
            ? [
                "Roble (Quercus robur)",
                "Haya (Fagus sylvatica)",
                "Rododendro",
                "Rosa inglesa",
                "Lavanda francesa",
                "Hortensia (Hydrangea)",
              ]
            : [
                "Podocarpus",
                "Hoheria",
                "Cordyline australis",
                "Rata (Metrosideros)",
                "Hebe",
                "Phormium tenax",
              ],
        gardenTips: [
          "Las lluvias frecuentes eliminan la necesidad de riego en invierno",
          "Mejorá el drenaje para evitar suelos encharcados",
          "La primavera y otoño son las mejores épocas de plantación",
          "Aprovechá las cuatro estaciones para diseñar con colores cambiantes",
          "El compost casero es muy eficiente con la humedad disponible",
        ],
      };
    }

    // Templado continental (interior de continentes: Rusia, Ucrania, Medio Oeste USA, Pampa seca)
    if (avgTemp >= 5 && avgPrecip >= 1.5) {
      return {
        zone: "Templado Continental Húmedo",
        biome:
          lon >= -105 && lon <= -75 && lat > 0
            ? "Pradera norteamericana (Great Plains)"
            : "Estepa póntica y bosque mixto continental",
        emoji: "🌾",
        description:
          "Veranos cálidos e inviernos fríos con nieve. Precipitaciones moderadas principalmente en primavera y verano. Suelos profundos y fértiles.",
        recommendedPlants:
          lon >= -105 && lon <= -75 && lat > 0
            ? [
                "Pradera de festuca",
                "Girasol (Helianthus annuus)",
                "Salvia azul (Salvia azurea)",
                "Coneflower (Echinacea)",
                "Switchgrass (Panicum virgatum)",
                "Redbud (Cercis canadensis)",
              ]
            : [
                "Tilo (Tilia cordata)",
                "Olmo (Ulmus minor)",
                "Lila (Syringa vulgaris)",
                "Peón (Paeonia)",
                "Iris de jardín",
                "Trigo ornamental",
              ],
        gardenTips: [
          "Protegé las plantas sensibles con mulch en invierno",
          "La nieve actúa como aislante: no retires el mulch demasiado pronto",
          "Plantá en primavera después de la última helada",
          "Los suelos profundos permiten árboles de raíz pivotante",
          "El verano caluroso es ideal para hortalizas de ciclo corto",
        ],
      };
    }

    // Templado seco / estepa fría
    return {
      zone: "Estepa Templada",
      biome:
        lat < 0
          ? "Puna y prepuna andina"
          : "Estepa continental seca",
      emoji: "🍂",
      description:
        "Clima seco con veranos cálidos e inviernos fríos. Baja humedad relativa y suelos poco desarrollados. Resistencia a la sequía es clave.",
      recommendedPlants:
        lat < 0
          ? [
              "Queñoa (Polylepis australis)",
              "Churqui (Prosopis ferox)",
              "Tola (Parastrephia lepidophylla)",
              "Suculentas andinas",
              "Gramíneas nativas",
              "Cactus de altura",
            ]
          : [
              "Artemisia",
              "Festuca (varios)",
              "Cebadilla criolla (Bromus)",
              "Retama (Retama sphaerocarpa)",
              "Espliego (Lavandula stoechas)",
              "Salvia (Salvia officinalis)",
            ],
      gardenTips: [
        "Priorizá plantas nativas de la estepa local",
        "El riego debe ser profundo pero espaciado (cada 10-15 días)",
        "Usá cortavientos de arbustos nativos para proteger plantas delicadas",
        "Los suelos compactados mejoran con aireación y materia orgánica",
        "Evitá regar en las horas de máximo calor para reducir la evaporación",
      ],
    };
  }

  // ── 6. ZONA SUBPOLAR TEMPLADA (55° – 60° latitud) ────────────────────────
  return {
    zone: "Boreal / Pre-Subpolar",
    biome: "Taiga y bosque boreal",
    emoji: "🌲",
    description:
      "Veranos frescos y cortos, inviernos muy fríos y prolongados. Dominio de coníferas y especies caducifolias resistentes al frío extremo.",
    recommendedPlants: [
      "Pino escocés (Pinus sylvestris)",
      "Abeto blanco (Picea glauca)",
      "Abedul plateado (Betula pendula)",
      "Alerce europeo (Larix decidua)",
      "Arándano (Vaccinium myrtillus)",
      "Sauce llorón (Salix alba)",
    ],
    gardenTips: [
      "La temporada de crecimiento es de solo 3-4 meses: aprovechá cada semana",
      "Usá variedades ultraprecoces de hortalizas",
      "Las coníferas ofrecen color y estructura todo el año",
      "El mulch profundo es esencial para proteger raíces en invierno",
      "Los invernaderos no calefaccionados extienden la temporada 6-8 semanas",
    ],
  };
}

// ─── Day names ────────────────────────────────────────────────────────────────

export function formatDayName(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoy";
  if (date.toDateString() === tomorrow.toDateString()) return "Mañana";

  return date.toLocaleDateString("es-AR", { weekday: "short" });
}
