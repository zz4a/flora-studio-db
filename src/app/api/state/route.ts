import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { readAppState } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sesi tidak valid. Silakan masuk kembali." }, { status: 401 });
    const state = await readAppState();
    return NextResponse.json({ user, ...state });
  } catch (error) {
    console.error("FloraStudio state read failed:", error);
    return NextResponse.json({ error: "Gagal membaca data MariaDB. Periksa konfigurasi database." }, { status: 503 });
  }
}
