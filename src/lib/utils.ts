import type { DailyObservation, PlantHealth, Plot } from "@/types";

export const HEALTH_OPTIONS: PlantHealth[] = ["Sehat","Perlu Perhatian","Perawatan","Belum Ada Data"];
export const WEATHER_OPTIONS = ["Cerah","Berawan","Hujan","Badai","Lainnya"] as const;
export function formatDate(value: string, options: Intl.DateTimeFormatOptions = {day:"numeric",month:"short",year:"numeric"}) {
  if (!value) return "—";
  const d = new Date(value.length===10 ? `${value}T12:00:00` : value);
  return Number.isNaN(d.getTime()) ? "—" : new Intl.DateTimeFormat("id-ID",options).format(d);
}
export function formatNumber(value: number, digits = 0) { return new Intl.NumberFormat("id-ID",{maximumFractionDigits:digits,minimumFractionDigits:digits}).format(value); }
export function plotArea(plot: Plot) { return plot.areaUnit === "ha" ? plot.area * 10000 : plot.area; }
export function getPlotObservations(plotId: string, observations: DailyObservation[]) { return observations.filter(item=>item.plotId===plotId).sort((a,b)=>b.dateTime.localeCompare(a.dateTime)); }
export function average(values: Array<number | null | undefined>) { const valid=values.filter((v):v is number=>typeof v==="number" && Number.isFinite(v)); return valid.length ? valid.reduce((a,b)=>a+b,0)/valid.length : null; }
export function healthTone(health: PlantHealth) {
  switch(health){case "Sehat":return "green";case "Perlu Perhatian":return "rose";case "Perawatan":return "amber";default:return "neutral";}
}
export function toCsv(rows: Record<string, string | number | null | undefined>[]) {
  if(!rows.length) return "";
  const keys=Object.keys(rows[0]); const cell=(v: unknown)=>`"${String(v??"").replace(/"/g,'""')}"`;
  return [keys.map(cell).join(","),...rows.map(row=>keys.map(key=>cell(row[key])).join(","))].join("\r\n");
}
export function downloadCsv(filename: string, rows: Record<string,string|number|null|undefined>[]) {
  const csv = `\uFEFF${toCsv(rows)}`; const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"})); const a=document.createElement("a"); a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
}
