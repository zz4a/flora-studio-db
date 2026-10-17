"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sprout, LayoutDashboard, Leaf, NotebookPen, BarChart3, ShieldCheck, Sun, Moon, Menu, X, Thermometer, Droplets, LogOut, UserCheck, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { usePlantation } from "@/context/PlantationContext";
import { average } from "@/lib/utils";

export function TopNavbar(){
 const pathname=usePathname(); const router=useRouter(); const [mobileOpen,setMobileOpen]=useState(false); const {theme,setTheme}=useTheme(); const {plots,currentUser,logout}=usePlantation();
 const temp=average(plots.map(p=>p.environment.temperature)) ?? 28.5; const humidity=average(plots.map(p=>p.environment.humidity)) ?? 72;
 const active=(href:string)=>pathname===href || (href!=="/dashboard"&&pathname.startsWith(`${href}/`));

 const handleLogout = () => { logout(); router.push("/login"); };

 const links = [
   {label:"Dashboard",href:"/dashboard",icon:LayoutDashboard},
   {label:"Lahan",href:"/lahan",icon:Leaf},
   {label:"Catatan",href:"/catatan",icon:NotebookPen},
   {label:"Laporan",href:"/laporan",icon:BarChart3},
   ...(currentUser?.role === "admin" ? [{label:"Admin",href:"/admin",icon:ShieldCheck}] : []),
 ];

 return <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.25rem)] max-w-[1320px] -translate-x-1/2">
  <div className="flex min-h-[68px] items-center gap-2 rounded-full border border-[var(--outline-variant)]/70 bg-[color:var(--surface)]/90 px-3 shadow-[0_10px_36px_rgba(33,45,31,.10)] backdrop-blur-sm sm:gap-4 sm:px-5">
    <Link href="/dashboard" className="m3-focus flex shrink-0 items-center gap-2 rounded-full px-1" aria-label="FloraStudio Dashboard"><span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><Sprout size={22}/></span><span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Flora<span className="text-[var(--primary)]">Studio</span></span></Link>
    <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Navigasi utama">
      {links.map(({label,href,icon:Icon})=><Link key={href} href={href} className={`m3-focus inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold transition ${active(href)?"bg-[var(--primary-container)] text-[var(--on-primary-container)]":"text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"}`}><Icon size={16}/>{label}</Link>)}
    </nav>
    <div className="ml-auto hidden items-center gap-3 rounded-full bg-[var(--surface-container)] px-4 py-2 lg:flex" aria-label="Ringkasan simulasi lingkungan"><span className="inline-flex items-center gap-1.5 text-xs font-bold"><Thermometer size={15} className="text-[var(--primary)]"/>{temp.toFixed(1)}°</span><span className="h-4 w-px bg-[var(--outline-variant)]"/><span className="inline-flex items-center gap-1.5 text-xs font-bold"><Droplets size={15} className="text-sky-600"/>{Math.round(humidity)}%</span><span className="h-4 w-px bg-[var(--outline-variant)]"/><span className="text-xs font-bold">{plots.filter(p=>p.cultivationStatus === "Aktif").length}/{plots.length} lahan aktif</span></div>
    
    {currentUser && (
      <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700/50' : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700/50'}`}>
        {currentUser.role === 'admin' ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
        {currentUser.role === 'admin' ? 'Admin' : 'User Biasa'}
      </span>
    )}
    
    <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Ganti tema terang atau gelap" className="m3-focus grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-[var(--surface-container)]">{theme==="dark"?<Sun size={19}/>:<Moon size={19}/>}</button>
    <button onClick={handleLogout} title="Keluar / Logout" className="m3-focus hidden h-10 w-10 shrink-0 place-items-center rounded-full text-rose-600 hover:bg-rose-50 sm:grid"><LogOut size={18}/></button>
    <button onClick={()=>setMobileOpen(o=>!o)} aria-label={mobileOpen?"Tutup menu":"Buka menu"} className="m3-focus grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-[var(--surface-container)] xl:hidden">{mobileOpen?<X size={19}/>:<Menu size={19}/>}</button>
  </div>
  <AnimatePresence>{mobileOpen&&<motion.nav initial={{opacity:0,y:-8,height:0}} animate={{opacity:1,y:0,height:"auto"}} exit={{opacity:0,y:-8,height:0}} className="mt-2 overflow-hidden rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface)]/95 p-2 shadow-xl backdrop-blur-xl xl:hidden"><div className="grid gap-1 sm:grid-cols-2">{links.map(({label,href,icon:Icon})=><Link key={href} onClick={()=>setMobileOpen(false)} href={href} className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 font-semibold ${active(href)?"bg-[var(--primary-container)] text-[var(--on-primary-container)]":"hover:bg-[var(--surface-container)]"}`}><Icon size={18}/>{label}</Link>)}<Link href="/settings" onClick={()=>setMobileOpen(false)} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 font-semibold hover:bg-[var(--surface-container)]"><Settings2 size={18}/>Pengaturan</Link><button onClick={handleLogout} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 font-semibold text-rose-600 hover:bg-rose-50"><LogOut size={18}/>Keluar</button></div></motion.nav>}</AnimatePresence>
 </header>
}
