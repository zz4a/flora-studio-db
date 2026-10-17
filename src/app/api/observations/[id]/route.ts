import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { addActivity, assertPlotExists, deleteObservationById, ensureDatabase, getObservation, updateObservationPayload } from "@/lib/db";
import { healthFromObservation, reconcilePlotFromObservations } from "@/lib/server-operations";
import type { DailyObservation } from "@/types";

export const runtime = "nodejs";
type Context = { params: { id: string } };

function validObservation(value: Partial<DailyObservation>, id: string): value is DailyObservation {
  return value.id === id && typeof value.plotId === "string" && value.plotId.length > 0 &&
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

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    await ensureDatabase();
    const previous = await getObservation(params.id);
    if (!previous) return NextResponse.json({ error: "Catatan tidak ditemukan." }, { status: 404 });
    const incoming = await request.json() as Partial<DailyObservation>;
    if (!validObservation(incoming, params.id)) return NextResponse.json({ error: "Data catatan tidak valid." }, { status: 400 });
    if (!(await assertPlotExists(incoming.plotId))) return NextResponse.json({ error: "Lahan yang dipilih tidak ditemukan." }, { status: 400 });
    const observation: DailyObservation = { ...incoming, plantHealth: healthFromObservation(incoming) };
    await updateObservationPayload(observation);
    await reconcilePlotFromObservations(previous.plotId);
    if (previous.plotId !== observation.plotId) await reconcilePlotFromObservations(observation.plotId);
    await addActivity("Catatan pemantauan diperbarui", "observation");
    return NextResponse.json({ observation });
  } catch (error) {
    console.error("FloraStudio update observation failed:", error);
    return NextResponse.json({ error: "Perubahan catatan gagal disimpan." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    await ensureDatabase();
    const existing = await getObservation(params.id);
    if (!existing) return NextResponse.json({ error: "Catatan tidak ditemukan." }, { status: 404 });
    await deleteObservationById(params.id);
    await reconcilePlotFromObservations(existing.plotId);
    await addActivity("Catatan pemantauan dihapus", "observation");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FloraStudio delete observation failed:", error);
    return NextResponse.json({ error: "Catatan gagal dihapus." }, { status: 400 });
  }
}
