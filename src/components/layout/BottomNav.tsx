"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, Leaf, NotebookPen } from "lucide-react";
const items=[{href:"/dashboard",label:"Dashboard",icon:LayoutDashboard},{href:"/lahan",label:"Lahan",icon:Leaf},{href:"/catatan",label:"Catatan",icon:NotebookPen},{href:"/laporan",label:"Laporan",icon:BarChart3}];
export function BottomNav(){const pathname=usePathname();return <nav aria-label="Navigasi utama seluler" className="fixed bottom-3 left-1/2 z-50 grid w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 grid-cols-4 rounded-full border border-[var(--outline-variant)] bg-[color:var(--surface)]/95 p-2 shadow-[0_10px_36px_rgba(33,45,31,.16)] backdrop-blur-xl sm:hidden">{items.map(({href,label,icon:Icon})=>{const selected=pathname===href|| (href!=="/dashboard"&&pathname.startsWith(`${href}/`));return <Link key={href} href={href} className={`m3-focus flex min-h-12 flex-col items-center justify-center gap-1 rounded-full text-[10px] font-bold ${selected?"bg-[var(--primary-container)] text-[var(--on-primary-container)]":"text-[var(--on-surface-variant)]"}`}><Icon size={18}/><span>{label}</span></Link>})}</nav>}
