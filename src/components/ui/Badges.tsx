import type { PlantHealth } from "@/types";
import { healthTone } from "@/lib/utils";
export function Badge({children,tone="neutral"}:{children:React.ReactNode;tone?:"green"|"rose"|"amber"|"neutral"|"plum"}){
 const styles={green:"bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",rose:"bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200",amber:"bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",neutral:"bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",plum:"bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200"};
 return <span className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-bold leading-5 ${styles[tone]}`}>{children}</span>;
}
export function HealthBadge({health}:{health:PlantHealth}){return <Badge tone={healthTone(health)}>{health}</Badge>}
