"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Droplets, MapPin, Thermometer, NotebookPen, Ruler } from "lucide-react";
import type { Plot } from "@/types";
import { Badge, HealthBadge } from "@/components/ui/Badges";
import { formatDate, formatNumber } from "@/lib/utils";

export function CropImage({src,alt,className="",priority=false}:{src:string;alt:string;className?:string;priority?:boolean}){
 const [failed,setFailed]=useState(false);
 return <img src={failed?"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85":src} alt={alt} loading={priority?"eager":"lazy"} onError={()=>setFailed(true)} className={className}/>
}
export function PlotCard({plot}:{plot:Plot}){
 return <motion.article layout whileHover={{y:-4}} className="m3-card group overflow-hidden rounded-[30px]">
  <Link href={`/lahan/${plot.id}`} className="m3-focus block rounded-[30px]">
   <div className="relative h-52 overflow-hidden sm:h-56"><CropImage src={plot.image} alt={plot.imageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5"/><div className="absolute left-4 top-4 flex flex-wrap gap-2"><Badge tone="neutral">{plot.code}</Badge></div><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white"><div><p className="text-xs font-bold tracking-wide text-white/80">{plot.crop}</p><h3 className="mt-1 font-display text-3xl font-medium leading-none">{plot.name}</h3></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur-md transition group-hover:bg-white group-hover:text-[var(--primary)]"><ArrowUpRight size={20}/></span></div></div>
   <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><HealthBadge health={plot.health}/><span className="text-xs font-semibold text-[var(--on-surface-variant)]">Ditanam {formatDate(plot.plantedAt)}</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[var(--surface-container)] p-3"><div className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]"><Ruler size={14}/>Luas lahan</div><p className="mt-1 font-bold">{formatNumber(plot.area)} {plot.areaUnit}</p></div><div className="rounded-2xl bg-[var(--surface-container)] p-3"><div className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]"><MapPin size={14}/>Lokasi</div><p className="mt-1 truncate font-bold">{plot.location.regency}, {plot.location.province}</p></div></div>
    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--on-surface-variant)]"><span className="inline-flex items-center gap-1.5"><Thermometer size={14}/>{plot.environment.temperature.toFixed(1)}°C</span><span className="inline-flex items-center gap-1.5"><Droplets size={14}/>{plot.environment.humidity}%</span><Badge tone="plum">{plot.cultivationStatus}</Badge></div>
    <div className="mt-4"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold">Progres pertumbuhan</span><strong>{plot.progress}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-[var(--surface-container-high)]"><div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{width:`${plot.progress}%`}}/></div></div>
   </div>
  </Link>
  <div className="flex gap-2 border-t border-[var(--outline-variant)]/70 px-5 py-3 sm:px-6"><Link href={`/lahan/${plot.id}`} className="m3-focus inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold hover:bg-[var(--surface-container)]">Lihat detail <ArrowUpRight size={14}/></Link><Link href={`/catatan?plot=${plot.id}&new=1`} className="m3-focus inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--secondary-container)] text-xs font-bold text-[var(--on-secondary-container)] hover:opacity-90"><NotebookPen size={14}/>Catat kondisi</Link></div>
 </motion.article>
}
