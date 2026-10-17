import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureDatabase, findUserByEmail } from "@/lib/db";
import { setSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await ensureDatabase();
    const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!email || !password || password.length > 200) return NextResponse.json({ error: "Email dan kata sandi wajib diisi." }, { status: 400 });
    const user = await findUserByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    setSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("FloraStudio login failed:", error);
    return NextResponse.json({ error: "Backend tidak dapat terhubung ke database. Periksa konfigurasi MariaDB di .env.local." }, { status: 503 });
  }
}
