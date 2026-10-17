import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { addActivity, deletePlotById, ensureDatabase, getPlot, updatePlotPayload } from "@/lib/db";
import type { Plot } from "@/types";

export const runtime = "nodejs";
type Context = { params: { id: string } };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Akses ditolak. Hanya admin yang dapat mengubah lahan." }, { status: 403 });
    await ensureDatabase();
    const existing = await getPlot(params.id);
    if (!existing) return NextResponse.json({ error: "Lahan tidak ditemukan." }, { status: 404 });
    const plot = await request.json() as Plot;
    if (!plot || plot.id !== params.id || typeof plot.name !== "string" || !plot.name.trim() || !plot.location || !plot.environment || !Array.isArray(plot.growthHistory)) {
      return NextResponse.json({ error: "Data lahan tidak valid." }, { status: 400 });
    }
    await updatePlotPayload(plot);
    await addActivity(`Data lahan ${plot.name} diperbarui`, "plot");
    return NextResponse.json({ plot });
  } catch (error) {
    console.error("FloraStudio update plot failed:", error);
    return NextResponse.json({ error: "Perubahan lahan gagal disimpan. Pastikan kode lahan unik." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Akses ditolak. Hanya admin yang dapat menghapus lahan." }, { status: 403 });
    await ensureDatabase();
    const existing = await getPlot(params.id);
    if (!existing) return NextResponse.json({ error: "Lahan tidak ditemukan." }, { status: 404 });
    await deletePlotById(params.id);
    await addActivity(`Lahan ${existing.name} dihapus`, "plot");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FloraStudio delete plot failed:", error);
    return NextResponse.json({ error: "Lahan gagal dihapus." }, { status: 400 });
  }
}
