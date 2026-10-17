"use client";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {variant?:"primary"|"secondary"|"outline"|"ghost"|"danger";loading?:boolean;icon?:React.ReactNode;motionEnabled?:boolean};
export function Button({children,variant="primary",loading=false,icon,className="",motionEnabled=true,...props}:Props){
 const styles={primary:"bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90",secondary:"bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:opacity-90",outline:"border border-[var(--outline-variant)] bg-transparent hover:bg-[var(--surface-container)]",ghost:"bg-transparent hover:bg-[var(--surface-container)]",danger:"bg-[var(--error-container)] text-[var(--on-error-container)] hover:opacity-90"};
 const body=<>{loading?<LoaderCircle size={17} className="animate-spin"/>:icon}{children}</>;
 const cn=`m3-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition ${styles[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`;
 return motionEnabled ? <motion.button whileTap={{scale:.96}} whileHover={{scale:1.015}} className={cn} disabled={loading||props.disabled} {...(props as any)}>{body}</motion.button> : <button className={cn} disabled={loading||props.disabled} {...props}>{body}</button>;
}
