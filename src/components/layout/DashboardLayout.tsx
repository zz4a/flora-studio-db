"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, NotebookPen, Sprout, BarChart3, History, X } from "lucide-react";
import { TopNavbar } from "./TopNavbar";
import { BottomNav } from "./BottomNav";
import { ToastNotification } from "@/components/ui/ToastNotification";
import { usePlantation } from "@/context/PlantationContext";

export function DashboardLayout({children}:{children:React.ReactNode}){
 const [quickOpen,setQuickOpen]=useState(false);
 const { currentUser, hydrated } = usePlantation();
 const pathname = usePathname();
 const router = useRouter();

 useEffect(() => {
   if (hydrated && !currentUser && pathname !== "/login") {
     router.replace("/login");
     return;
   }
   if (hydrated && currentUser && currentUser.role !== "admin" && pathname.startsWith("/admin")) {
     router.replace("/dashboard");
   }
 }, [currentUser, hydrated, pathname, router]);

 if (!hydrated || (!currentUser && pathname !== "/login")) return null;

 if (pathname === "/login") return <>{children}<ToastNotification/></>;

 const actionLinks = [
   ...(currentUser?.role === "admin" ? [{href:"/lahan?new=1",label:"Tambah Lahan",icon:Sprout}] : []),
   {href:"/catatan?new=1",label:"Catat Kondisi",icon:NotebookPen},
   {href:"/catatan",label:"Lihat Riwayat",icon:History},
   {href:"/laporan",label:"Buka Laporan",icon:BarChart3}
 ];

 return <><TopNavbar/><main className="mx-auto min-h-screen max-w-[1440px] px-4 pb-32 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">{children}</main><BottomNav/>
  <div className="fixed bottom-[5.6rem] right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
   <AnimatePresence>{quickOpen&&<motion.div initial={{opacity:0,y:12,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.96}} className="w-60 rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface)] p-2 shadow-2xl">
     {actionLinks.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setQuickOpen(false)} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-bold hover:bg-[var(--surface-container)]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]"><Icon size={16}/></span>{label}</Link>)}
   </motion.div>}</AnimatePresence>
   <motion.button whileTap={{scale:.92}} whileHover={{scale:1.04}} onClick={()=>setQuickOpen(o=>!o)} aria-label={quickOpen?"Tutup tindakan cepat":"Buka tindakan cepat"} className="grid h-14 w-14 place-items-center rounded-full bg-[var(--primary)] text-[var(--on-primary)] shadow-[0_12px_28px_rgba(25,129,85,.33)] sm:h-16 sm:w-16">{quickOpen?<X size={24}/>:<Plus size={26}/>}</motion.button>
  </div><ToastNotification/></>
}
