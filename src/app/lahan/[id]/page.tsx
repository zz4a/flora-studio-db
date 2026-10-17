"use client";
import { useParams } from "next/navigation";
import { usePlantation } from "@/context/PlantationContext";
import { PlotDetail } from "@/components/lahan/PlotDetail";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Buttons";

export default function LahanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { plots, hydrated } = usePlantation();

  if (!hydrated) return <div className="p-8 text-center text-sm text-[var(--on-surface-variant)]">Memuat data...</div>;

  const plot = plots.find((p) => p.id === id);

  if (!plot) {
    return (
      <div className="m3-card p-12 text-center mt-12">
        <Search className="mx-auto text-[var(--primary)]" size={34} />
        <h3 className="mt-4 font-display text-3xl">Lahan tidak ditemukan</h3>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Data kebun ini mungkin telah dihapus atau ID tidak valid.</p>
        <Link href="/lahan" className="inline-block mt-6">
          <Button>Kembali ke daftar lahan</Button>
        </Link>
      </div>
    );
  }

  return <PlotDetail plot={plot} />;
}
