import type { DailyObservation, Plot } from "@/types";
import { plotArea } from "@/lib/utils";

export interface ReportSummary {
  plotCount: number;
  totalAreaM2: number;
  cropCount: number;
  observationCount: number;
  averageHumidity: number | null;
  averageTemperature: number | null;
  attentionCount: number;
}

export function summarizeReport(plots: Plot[], observations: DailyObservation[]): ReportSummary {
  const measured = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  return {
    plotCount: plots.length,
    totalAreaM2: plots.reduce((sum, plot) => sum + plotArea(plot), 0),
    cropCount: new Set(plots.map(plot => plot.crop)).size,
    observationCount: observations.length,
    averageHumidity: measured(observations.map(item => item.humidity).filter(Number.isFinite)),
    averageTemperature: measured(observations.map(item => item.temperature).filter(Number.isFinite)),
    attentionCount: plots.filter(plot => plot.health === "Perlu Perhatian" || plot.health === "Perawatan").length,
  };
}

export function plotReportRows(plots: Plot[]) {
  return plots.map(plot => ({
    kode: plot.code, nama: plot.name, tanaman: plot.crop, varietas: plot.variety,
    luas: plot.area, satuan: plot.areaUnit, lokasi: plot.location.regency,
    provinsi: plot.location.province, tanggal_tanam: plot.plantedAt,
    kesehatan: plot.health, progres: plot.progress,
    suhu_simulasi: plot.environment.temperature, kelembapan_simulasi: plot.environment.humidity,
  }));
}

export function observationReportRows(observations: DailyObservation[], plots: Plot[]) {
  const byId = new Map(plots.map(plot => [plot.id, plot]));
  return observations.map(item => {
    const plot = byId.get(item.plotId);
    return {
      tanggal: item.dateTime, lahan: plot?.name ?? "", tanaman: plot?.crop ?? "",
      cuaca: item.weather, suhu: item.temperature, kelembapan: item.humidity,
      kelembapan_tanah: item.soilMoisture, curah_hujan: item.rainfall,
      kesehatan: item.plantHealth, pertumbuhan: item.growthNotes, hama: item.pestDisease,
      penyiraman: item.watering, pemupukan: item.fertilizer, catatan: item.notes,
    };
  });
}
