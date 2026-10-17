import { SEED_PLOTS } from "@/lib/mockData";
import type { DailyObservation, Plot, PlantHealth } from "@/types";
import { getPlot, listObservationsForPlot, updatePlotPayload } from "@/lib/db";

export function healthFromObservation(values: Omit<DailyObservation, "id"> | DailyObservation): PlantHealth {
  const text = `${values.growthNotes} ${values.notes} ${values.pestDisease}`.toLowerCase();
  if (/layu|kering|mati|busuk|berpenyakit|rontok parah|hama parah/.test(text)) return "Perawatan";
  if (/kurang|lambat|pucat|kuning|kecil|hama|perlu perhatian/.test(text)) return "Perlu Perhatian";
  if (/segar|subur|hijau|baik|sehat|mekar|tumbuh|berkembang/.test(text)) return "Sehat";
  return values.plantHealth;
}

function healthScore(health: DailyObservation["plantHealth"]): number {
  return health === "Sehat" ? 92 : health === "Perlu Perhatian" ? 68 : health === "Perawatan" ? 62 : 45;
}

function applyObservationToPlot(plot: Plot, observation: DailyObservation): Plot {
  const date = observation.dateTime.slice(0, 10);
  const previous = plot.growthHistory.filter((record) => record.date < date).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const originalForDate = plot.growthHistory.find((record) => record.date === date && !record.sourceObservationId);
  const text = `${observation.growthNotes} ${observation.notes} ${observation.pestDisease}`.toLowerCase();
  let addedProgress = 0;
  if (/bertambah|tumbuh|berkembang|tinggi|muncul|berbuah|berbunga|meningkat|besar|lebat/.test(text)) {
    // Derive a stable value from the observation ID so server recalculation is repeatable.
    const hash = [...observation.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    addedProgress = 4 + (hash % 3);
  } else if (observation.plantHealth === "Sehat") {
    const hash = [...observation.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    addedProgress = 1 + (hash % 2);
  }
  const previousProgress = previous ? previous.progress : plot.progress;
  const progress = Math.min(100, previousProgress + addedProgress);
  const record = {
    date,
    heightCm: originalForDate?.heightCm ?? previous?.heightCm ?? plot.growthHistory.at(-1)?.heightCm ?? 8,
    leaves: originalForDate?.leaves ?? previous?.leaves ?? plot.growthHistory.at(-1)?.leaves ?? 4,
    healthScore: healthScore(observation.plantHealth),
    progress,
    sourceObservationId: observation.id,
  };
  const growthHistory = [
    ...plot.growthHistory.filter((item) => item.sourceObservationId !== observation.id && !(item.sourceObservationId && item.date === date)),
    record,
  ].sort((a, b) => a.date.localeCompare(b.date));
  return {
    ...plot,
    health: observation.plantHealth,
    progress,
    environment: {
      temperature: observation.temperature,
      humidity: observation.humidity,
      soilMoisture: observation.soilMoisture,
      rainfall: observation.rainfall,
      weather: observation.weather,
    },
    growthHistory,
  };
}

export async function reconcilePlotFromObservations(plotId: string): Promise<void> {
  const current = await getPlot(plotId);
  if (!current) return;
  const seed = SEED_PLOTS.find((item) => item.id === plotId);
  const baseline: Plot = seed
    ? {
        ...current,
        health: seed.health,
        progress: seed.progress,
        environment: structuredClone(seed.environment),
        growthHistory: structuredClone(seed.growthHistory),
      }
    : {
        ...current,
        health: "Belum Ada Data",
        progress: current.growthHistory[0]?.progress ?? 0,
        environment: { temperature: 28.5, humidity: 72, soilMoisture: null, rainfall: null, weather: "Berawan" },
        growthHistory: current.growthHistory.filter((record) => !record.sourceObservationId),
      };
  const observations = await listObservationsForPlot(plotId);
  const nextPlot = observations.reduce(applyObservationToPlot, baseline);
  await updatePlotPayload(nextPlot);
}
