import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { addActivity, ensureDatabase, insertPlot } from "@/lib/db";
import type { Plot } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Akses ditolak. Hanya admin yang dapat menambah lahan." }, { status: 403 });
    await ensureDatabase();
    const plot = await request.json() as Plot;
    if (!plot || typeof plot.id !== "string" || typeof plot.code !== "string" || typeof plot.name !== "string" || !plot.name.trim() || !plot.location || !plot.environment || !Array.isArray(plot.growthHistory)) {
      return NextResponse.json({ error: "Data lahan tidak valid." }, { status: 400 });
    }
    await insertPlot(plot);
    await addActivity(`Lahan ${plot.name} ditambahkan`, "plot");
    return NextResponse.json({ plot }, { status: 201 });
  } catch (error) {
    console.error("FloraStudio create plot failed:", error);
    return NextResponse.json({ error: "Lahan gagal disimpan. Pastikan kode lahan unik dan database tersedia." }, { status: 400 });
  }
}
