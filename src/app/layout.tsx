import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PlantationProvider } from "@/context/PlantationContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: { default: "FloraStudio — Garden & Plantation Monitoring", template: "%s | FloraStudio" },
  description: "Dashboard pemantauan kebun dengan delapan plot contoh, catatan harian, visualisasi pertumbuhan, dan laporan simulasi.",
  applicationName: "FloraStudio",
  icons: { icon: "/icons/florastudio-mark.svg", shortcut: "/icons/florastudio-mark.svg" },
  keywords: ["FloraStudio", "monitoring kebun", "pertumbuhan tanaman", "dashboard perkebunan"],
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id" suppressHydrationWarning><body><ThemeProvider><PlantationProvider><DashboardLayout>{children}</DashboardLayout></PlantationProvider></ThemeProvider></body></html>;
}
