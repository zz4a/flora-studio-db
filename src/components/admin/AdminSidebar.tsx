import Link from "next/link";
import { BarChart3, LayoutDashboard, Leaf, NotebookPen } from "lucide-react";
export function AdminSidebar({active}:{active:"overview"|"lahan"|"catatan"|"laporan"}){
 const links=[{id:"overview",label:"Overview",href:"/admin",icon:LayoutDashboard},{id:"lahan",label:"Manajemen lahan",href:"/admin/lahan",icon:Leaf},{id:"catatan",label:"Catatan",href:"/admin/catatan",icon:NotebookPen},{id:"laporan",label:"Laporan",href:"/admin/laporan",icon:BarChart3}];
 return <nav aria-label="Navigasi admin" className="m3-card flex flex-wrap gap-2 p-2">{links.map(({id,label,href,icon:Icon})=><Link key={id} href={href} className={`m3-focus inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${active===id?"bg-[var(--primary-container)] text-[var(--on-primary-container)]":"text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"}`}><Icon size={16}/>{label}</Link>)}</nav>
}
