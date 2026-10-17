import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { ensureDatabase, resetDemoState } from "@/lib/db";

export const runtime = "nodejs";

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Hanya admin yang dapat memulihkan dataset." }, { status: 403 });
    await ensureDatabase();
    await resetDemoState();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FloraStudio reset failed:", error);
    return NextResponse.json({ error: "Dataset gagal dipulihkan." }, { status: 500 });
  }
}
