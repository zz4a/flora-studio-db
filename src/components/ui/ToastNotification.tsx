"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { usePlantation } from "@/context/PlantationContext";
export function ToastNotification(){
 const {toasts,dismissToast}=usePlantation();
 return <div aria-live="polite" className="pointer-events-none fixed right-4 top-24 z-[120] flex w-[min(92vw,360px)] flex-col gap-2"> <AnimatePresence>{toasts.map(t=>{const Icon=t.tone==="success"?CheckCircle2:t.tone==="error"?XCircle:Info;return <motion.div key={t.id} initial={{opacity:0,x:24,scale:.97}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:24}} className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface)] p-4 shadow-xl"><Icon size={20} className={t.tone==="success"?"text-emerald-600":t.tone==="error"?"text-rose-600":"text-[var(--primary)]"}/><p className="flex-1 text-sm font-medium leading-5">{t.message}</p><button onClick={()=>dismissToast(t.id)} aria-label="Tutup notifikasi" className="m3-focus rounded-full p-1"><X size={15}/></button></motion.div>})}</AnimatePresence></div>
}
