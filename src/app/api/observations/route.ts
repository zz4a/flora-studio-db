import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { addActivity, ensureDatabase, getPlot, insertObservation } from "@/lib/db";
import { healthFromObservation, reconcilePlotFromObservations } from "@/lib/server-operations";
import type { DailyObservation } from "@/types";

export const runtime = "nodejs";

function validObservation(value: Partial<DailyObservation>): value is DailyObservation {
  return typeof value.id === "string" && value.id.length > 0 &&
    typeof value.plotId === "string" && value.plotId.length > 0 &&
    typeof value.dateTime === "string" && !Number.isNaN(Date.parse(value.dateTime)) &&
    typeof value.weather === "string" && ["Cerah", "Berawan", "Hujan", "Badai", "Lainnya"].includes(value.weather) &&
    typeof value.temperature === "number" && Number.isFinite(value.temperature) && value.temperature >= -30 && value.temperature <= 80 &&
    typeof value.humidity === "number" && Number.isFinite(value.humidity) && value.humidity >= 0 && value.humidity <= 100 &&
    (value.soilMoisture === null || (typeof value.soilMoisture === "number" && Number.isFinite(value.soilMoisture) && value.soilMoisture >= 0 && value.soilMoisture <= 100)) &&
    (value.rainfall === null || (typeof value.rainfall === "number" && Number.isFinite(value.rainfall) && value.rainfall >= 0)) &&
    typeof value.growthNotes === "string" && value.growthNotes.length <= 5000 &&
    typeof value.plantHealth === "string" && ["Sehat", "Perlu Perhatian", "Perawatan", "Belum Ada Data"].includes(value.plantHealth) &&
    typeof value.pestDisease === "string" && value.pestDisease.length <= 5000 &&
    typeof value.watering === "string" && value.watering.length <= 2000 &&
    typeof value.fertilizer === "string" && value.fertilizer.length <= 2000 &&
    typeof value.notes === "string" && value.notes.length <= 5000;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    await ensureDatabase();
    const incoming = await request.json() as Partial<DailyObservation>;
    if (!validObservation(incoming)) return NextResponse.json({ error: "Data catatan tidak valid." }, { status: 400 });
    const plot = await getPlot(incoming.plotId);
    if (!plot) return NextResponse.json({ error: "Lahan yang dipilih tidak ditemukan." }, { status: 400 });
    const observation: DailyObservation = { ...incoming, plantHealth: healthFromObservation(incoming) };
    await insertObservation(observation);
    await reconcilePlotFromObservations(observation.plotId);
    await addActivity(`Catatan baru untuk ${plot.name}`, "observation");
    return NextResponse.json({ observation }, { status: 201 });
  } catch (error) {
    console.error("FloraStudio create observation failed:", error);
    return NextResponse.json({ error: "Catatan gagal disimpan. Pastikan lahan tersedia dan database aktif." }, { status: 400 });
  }
}
