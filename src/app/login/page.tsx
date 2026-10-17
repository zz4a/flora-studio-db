"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from "lucide-react";
import { usePlantation } from "@/context/PlantationContext";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const { login } = usePlantation();
  const router = useRouter();
  const [email, setEmail] = useState("user@florastudio.id");
  const [password, setPassword] = useState("user123");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "admin") { setEmail("admin@florastudio.id"); setPassword("admin123"); }
    else { setEmail("user@florastudio.id"); setPassword("user123"); }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--surface)] text-[var(--on-surface)]">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[var(--primary-container)] text-[var(--on-primary-container)]">
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/60 text-[var(--primary)] shadow-sm"><Sprout size={28} /></span>
          <span className="font-display text-3xl font-semibold tracking-tight">Flora<span className="text-[var(--primary)]">Studio</span></span>
        </div>
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">Sistem Manajemen Kebun Harian</span>
          <h1 className="font-display text-5xl font-medium leading-tight">Pantau Kebun, Kelola Tanaman, dan Catat Setiap Perkembangan.</h1>
          <p className="text-base leading-relaxed opacity-90">Akses platform dengan hak akses terpisah antara Operator Kebun (User Biasa) dan Administrator.</p>
        </div>
        <div className="relative z-10 text-xs opacity-75">© 2026 FloraStudio · Garden & Plantation Monitoring</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex lg:hidden items-center gap-2 mb-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><Sprout size={22} /></span><span className="font-display text-2xl font-semibold">Flora<span className="text-[var(--primary)]">Studio</span></span></div>
            <h2 className="font-display text-3xl font-semibold">Selamat Datang Kembali</h2>
            <p className="text-sm text-[var(--on-surface-variant)]">Pilih peran akun untuk melanjutkan ke dashboard.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-3xl bg-[var(--surface-container)]">
            <button type="button" onClick={() => handleSelectRole("user")} className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold transition ${selectedRole === "user" ? "bg-[var(--surface)] text-[var(--primary)] shadow-sm" : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"}`}><UserCheck size={16} /> User Biasa</button>
            <button type="button" onClick={() => handleSelectRole("admin")} className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold transition ${selectedRole === "admin" ? "bg-[var(--surface)] text-[var(--primary)] shadow-sm" : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"}`}><ShieldCheck size={16} /> Administrator</button>
          </div>
          <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2 text-[var(--primary)]">{selectedRole === "user" ? <UserCheck size={15} /> : <ShieldCheck size={15} />} Izin Akses {selectedRole === "user" ? "User Biasa" : "Admin"}:</div>
            {selectedRole === "user" ? <p className="text-[var(--on-surface-variant)] leading-relaxed">• <strong>Bisa</strong>: Menambah & menghapus catatan kondisi harian.<br />• <strong>Tidak Bisa</strong>: Membuat/mengubah/menghapus lahan dan tanaman.</p> : <p className="text-[var(--on-surface-variant)] leading-relaxed">• <strong>Bisa</strong>: Akses penuh untuk membuat, mengubah, dan menghapus seluruh data lahan, tanaman, serta catatan harian.</p>}
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--on-surface-variant)]">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="m3-focus min-h-12 w-full rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm outline-none focus:border-[var(--primary)]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--on-surface-variant)]">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" size={18} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="m3-focus min-h-12 w-full rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm outline-none focus:border-[var(--primary)]" />
              </div>
            </div>
            <button type="submit" className="m3-focus m3-ripple w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-[var(--on-primary)] shadow-md transition hover:opacity-95">Masuk sebagai {selectedRole === "admin" ? "Admin" : "User Biasa"} <ArrowRight size={17} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
