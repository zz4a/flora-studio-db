"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppActivity, DailyObservation, ObservationFormValues, Plot, PlotFormValues, User, PlantHealth } from "@/types";
import { getSeedCopy, SEED_PLOTS } from "@/lib/mockData";

interface ToastMessage { id: string; message: string; tone: "success" | "error" | "info" }
interface PlantationContextValue {
  currentUser: User | null; login: (email: string, password: string) => Promise<boolean>; logout: () => void;
  plots: Plot[]; observations: DailyObservation[]; activities: AppActivity[]; hydrated: boolean; toasts: ToastMessage[];
  notify: (message: string, tone?: ToastMessage["tone"]) => void; dismissToast: (id: string) => void;
  addPlot: (values: PlotFormValues) => Plot | null; updatePlot: (id: string, values: PlotFormValues) => boolean; deletePlot: (id: string) => boolean;
  addObservation: (values: ObservationFormValues) => DailyObservation; updateObservation: (id: string, values: ObservationFormValues) => void; deleteObservation: (id: string) => void;
  resetDemoData: () => void;
}
const PlantationContext = createContext<PlantationContextValue | null>(null);
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const now = () => new Date().toISOString();
const nextPlotCode = (plots: Plot[]) => {
  const used = new Set(plots.map(plot => plot.code));
  let serial = 1;
  while (used.has(`LHN-${String(serial).padStart(3, "0")}`)) serial += 1;
  return `LHN-${String(serial).padStart(3, "0")}`;
};
const observationHealthScore = (health: DailyObservation["plantHealth"]) =>
  health === "Sehat" ? 92 : health === "Perlu Perhatian" ? 68 : health === "Perawatan" ? 62 : 45;

const analyzeHealthFromNotes = (values: Omit<DailyObservation, "id">): PlantHealth => {
  const text = (values.growthNotes + " " + values.notes + " " + values.pestDisease).toLowerCase();
  
  // Prioritas tertinggi: Jika ada kata-kata krusial/kematian/penyakit parah
  if (text.match(/layu|kering|mati|busuk|berpenyakit|rontok parah|hama parah/)) return "Perawatan";
  
  // Prioritas kedua: Kekurangan nutrisi atau masalah ringan
  if (text.match(/kurang|lambat|pucat|kuning|kecil|hama|perlu perhatian/)) return "Perlu Perhatian";
  
  // Prioritas ketiga: Pertumbuhan baik
  if (text.match(/segar|subur|hijau|baik|sehat|mekar|tumbuh|berkembang/)) return "Sehat";
  
  return values.plantHealth; // Fallback ke yang dipilih manual
};

function applyObservationToPlot(plot: Plot, observation: DailyObservation): Plot {
  const date = observation.dateTime.slice(0, 10);
  const previous = plot.growthHistory.filter(record => record.date < date).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const originalForDate = plot.growthHistory.find(record => record.date === date && !record.sourceObservationId);
  
  const textToAnalyze = (observation.growthNotes + " " + observation.notes + " " + observation.pestDisease).toLowerCase();
  let addedProgress = 0;
  if (textToAnalyze.match(/bertambah|tumbuh|berkembang|tinggi|muncul|berbuah|berbunga|meningkat|besar|lebat/)) {
      addedProgress = Math.floor(Math.random() * 3) + 4; // Tambah 4% sampai 6%
  } else if (observation.plantHealth === "Sehat") {
      addedProgress = Math.floor(Math.random() * 2) + 1; // Passive growth 1% sampai 2%
  }
  
  const prevProgress = previous ? previous.progress : plot.progress;
  const newProgress = Math.min(100, prevProgress + addedProgress);

  const record = {
    date,
    heightCm: originalForDate?.heightCm ?? previous?.heightCm ?? plot.growthHistory.at(-1)?.heightCm ?? 8,
    leaves: originalForDate?.leaves ?? previous?.leaves ?? plot.growthHistory.at(-1)?.leaves ?? 4,
    healthScore: observationHealthScore(observation.plantHealth),
    progress: newProgress,
    sourceObservationId: observation.id,
  };
  
  const growthHistory = [...plot.growthHistory.filter(item => item.sourceObservationId !== observation.id && !(item.sourceObservationId && item.date === date)), record].sort((a, b) => a.date.localeCompare(b.date));
  return {
    ...plot, 
    health: observation.plantHealth,
    progress: newProgress,
    environment: { temperature: observation.temperature, humidity: observation.humidity, soilMoisture: observation.soilMoisture, rainfall: observation.rainfall, weather: observation.weather },
    growthHistory,
  };
}

const cropImageMap: Record<string,string> = {
  "Cabai Merah":"https://images.unsplash.com/photo-1760627823649-3b353622c16e?auto=format&fit=crop&w=1200&q=85",
  "Tomat":"https://images.unsplash.com/photo-1692039743891-fc44365e09cb?auto=format&fit=crop&w=1200&q=85",
  "Terong Ungu":"https://images.unsplash.com/photo-1560951812-58e6bce53149?auto=format&fit=crop&w=1200&q=85",
  "Kangkung":"https://images.unsplash.com/photo-1569185835836-a9683f3c72a4?auto=format&fit=crop&w=1200&q=85",
  "Bayam Hijau":"https://images.unsplash.com/photo-1784043436675-dbe53cbcec88?auto=format&fit=crop&w=1200&q=85",
  "Jagung Manis":"https://images.unsplash.com/photo-1744726008519-5f9698b729f9?auto=format&fit=crop&w=1200&q=85",
  "Mentimun":"https://images.unsplash.com/photo-1725369865690-5a1a09f87e56?auto=format&fit=crop&w=1200&q=85",
  "Pakcoy":"https://images.unsplash.com/photo-1725369865403-82ca4f17bb5b?auto=format&fit=crop&w=1200&q=85",
};

export function PlantationProvider({ children }: { children: React.ReactNode }) {
  const initial = getSeedCopy();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plots, setPlots] = useState<Plot[]>(initial.plots);
  const [observations, setObservations] = useState<DailyObservation[]>(initial.observations);
  const [activities, setActivities] = useState<AppActivity[]>([
    { id: "activity-start-1", message: "FloraStudio siap digunakan", dateTime: now(), type: "settings" },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const notify = useCallback((message: string, tone: ToastMessage["tone"] = "success") => {
    const id = makeId("toast");
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const refreshState = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/state", { method: "GET", cache: "no-store" });
      if (!response.ok) return false;
      const result = await response.json() as {
        user: User; plots: Plot[]; observations: DailyObservation[]; activities: AppActivity[];
      };
      setCurrentUser(result.user);
      setPlots(result.plots);
      setObservations(result.observations);
      setActivities(result.activities);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const loaded = await refreshState();
      if (active && !loaded) setCurrentUser(null);
      if (active) setHydrated(true);
    })();
    return () => { active = false; };
  }, [refreshState]);

  const persistMutation = useCallback(async (url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown, successMessage = "Perubahan berhasil disimpan ke database.") => {
    try {
      const response = await fetch(url, {
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        await refreshState();
        notify(result.error || "Perubahan gagal disimpan ke server.", "error");
        return false;
      }
      const reloaded = await refreshState();
      if (!reloaded) notify("Data tersimpan, tetapi daftar data terbaru gagal dimuat. Muat ulang halaman.", "error");
      else notify(successMessage, "success");
      return reloaded;
    } catch {
      await refreshState();
      notify("Tidak dapat menjangkau backend FloraStudio. Periksa koneksi dan server.", "error");
      return false;
    }
  }, [refreshState, notify]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({})) as { user?: User; error?: string };
      if (!response.ok || !result.user) {
        notify(result.error || "Login gagal. Periksa email dan kata sandi.", "error");
        return false;
      }
      setCurrentUser(result.user);
      const loaded = await refreshState();
      if (!loaded) {
        setCurrentUser(null);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
        notify("Akun terverifikasi, tetapi data backend gagal dimuat. Periksa konfigurasi MariaDB.", "error");
        return false;
      }
      return true;
    } catch {
      notify("Backend tidak dapat dijangkau. Periksa server Next.js dan konfigurasi MariaDB.", "error");
      return false;
    }
  }, [notify, refreshState]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    void fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
  }, []);

  const recordActivity = useCallback((message: string, type: AppActivity["type"]) => {
    setActivities((current) => [{ id: makeId("activity"), message, dateTime: now(), type }, ...current].slice(0, 12));
  }, []);

  const addPlot = useCallback((values: PlotFormValues) => {
    if (currentUser?.role !== "admin") {
      notify("Akses ditolak. User Biasa hanya dapat mencatat observasi.", "error");
      return null;
    }
    const image = values.image.trim() || cropImageMap[values.crop] || cropImageMap["Bayam Hijau"];
    const id = makeId("plot");
    const plot: Plot = {
      id, code: nextPlotCode(plots), name: values.name.trim(), crop: values.crop,
      variety: values.variety.trim() || "Varietas belum ditentukan", area: Number(values.area), areaUnit: values.areaUnit,
      plantedAt: values.plantedAt, population: Number(values.population),
      location: {
        province: values.province.trim() || "Riau", regency: values.regency.trim() || "Lokasi contoh",
        address: values.address.trim() || `Area contoh, ${values.regency || "Riau"}`,
        description: "Lokasi ilustratif untuk demonstrasi.",
      },
      description: values.description.trim() || `Catatan demonstrasi untuk tanaman ${values.crop}.`,
      health: values.health, cultivationStatus: values.cultivationStatus, progress: Number(values.progress),
      image, imageAlt: `Foto ${values.crop}`, images: [{ src: image, alt: `Foto ${values.crop}`, caption: values.crop }],
      notes: values.notes.trim(),
      environment: { temperature: 28.5, humidity: 72, soilMoisture: null, rainfall: null, weather: "Berawan" },
      growthHistory: [{ date: values.plantedAt, heightCm: 1, leaves: 2, healthScore: values.health === "Sehat" ? 90 : 70, progress: Math.min(15, Number(values.progress)) }],
    };
    setPlots((current) => [...current, plot]);
    recordActivity(`Lahan ${plot.name} ditambahkan`, "plot");
    void persistMutation("/api/plots", "POST", plot, "Lahan berhasil ditambahkan.");
    return plot;
  }, [currentUser, plots, notify, recordActivity, persistMutation]);

  const updatePlot = useCallback((id: string, values: PlotFormValues) => {
    if (currentUser?.role !== "admin") {
      notify("Akses ditolak. Hanya Admin yang dapat mengedit lahan.", "error");
      return false;
    }
    const existing = plots.find((plot) => plot.id === id);
    if (!existing) { notify("Lahan tidak ditemukan.", "error"); return false; }
    const updatedPlot: Plot = {
      ...existing,
      name: values.name.trim(), crop: values.crop, variety: values.variety.trim(), area: Number(values.area),
      areaUnit: values.areaUnit, plantedAt: values.plantedAt, population: Number(values.population),
      location: {
        ...existing.location, province: values.province.trim() || "Riau", regency: values.regency.trim(),
        address: values.address.trim(), description: existing.location.description,
      },
      description: values.description.trim(), health: values.health, cultivationStatus: values.cultivationStatus,
      progress: Number(values.progress), image: values.image.trim() || existing.image, notes: values.notes.trim(),
    };
    setPlots((current) => current.map((plot) => plot.id === id ? updatedPlot : plot));
    recordActivity(`Data lahan ${values.name} diperbarui`, "plot");
    void persistMutation(`/api/plots/${encodeURIComponent(id)}`, "PATCH", updatedPlot, "Perubahan lahan berhasil disimpan.");
    return true;
  }, [currentUser, plots, notify, recordActivity, persistMutation]);

  const deletePlot = useCallback((id: string) => {
    if (currentUser?.role !== "admin") {
      notify("Akses ditolak. User biasa tidak dapat menghapus lahan.", "error");
      return false;
    }
    const plot = plots.find((item) => item.id === id);
    if (!plot) return false;
    setPlots((current) => current.filter((item) => item.id !== id));
    setObservations((current) => current.filter((item) => item.plotId !== id));
    recordActivity(`Lahan ${plot.name} dihapus`, "plot");
    void persistMutation(`/api/plots/${encodeURIComponent(id)}`, "DELETE", undefined, "Lahan dan catatan terkait berhasil dihapus.");
    return true;
  }, [currentUser, plots, notify, recordActivity, persistMutation]);

  const reconcilePlotObservations = useCallback((plotId: string, records: DailyObservation[]) => {
    setPlots((current) => current.map((plot) => {
      if (plot.id !== plotId) return plot;
      const seed = SEED_PLOTS.find((item) => item.id === plotId);
      const baseline: Plot = seed
        ? { ...plot, health: seed.health, progress: seed.progress, environment: structuredClone(seed.environment), growthHistory: structuredClone(seed.growthHistory) }
        : { ...plot, health: "Belum Ada Data", progress: plot.growthHistory[0]?.progress ?? 0,
            environment: { temperature: 28.5, humidity: 72, soilMoisture: null, rainfall: null, weather: "Berawan" },
            growthHistory: plot.growthHistory.filter((record) => !record.sourceObservationId) };
      return records.filter((item) => item.plotId === plotId).slice().sort((a, b) => a.dateTime.localeCompare(b.dateTime)).reduce(applyObservationToPlot, baseline);
    }));
  }, []);

  const addObservation = useCallback((values: ObservationFormValues) => {
    if (!currentUser) { notify("Silakan masuk terlebih dahulu.", "error"); return null as unknown as DailyObservation; }
    const derivedHealth = analyzeHealthFromNotes(values);
    const observation: DailyObservation = { ...values, plantHealth: derivedHealth, id: makeId("obs") };
    const nextObservations = [observation, ...observations].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    setObservations(nextObservations);
    reconcilePlotObservations(observation.plotId, nextObservations);
    recordActivity(`Catatan baru untuk ${plots.find((plot) => plot.id === observation.plotId)?.name ?? "lahan"}`, "observation");
    void persistMutation("/api/observations", "POST", observation, "Catatan kondisi berhasil disimpan.");
    if (derivedHealth !== values.plantHealth) notify(`Kondisi otomatis diubah ke "${derivedHealth}" berdasarkan catatan Anda.`, "info");
    return observation;
  }, [currentUser, observations, plots, reconcilePlotObservations, notify, recordActivity, persistMutation]);

  const updateObservation = useCallback((id: string, values: ObservationFormValues) => {
    if (!currentUser) { notify("Silakan masuk terlebih dahulu.", "error"); return; }
    const previous = observations.find((item) => item.id === id);
    const derivedHealth = analyzeHealthFromNotes(values);
    const observation: DailyObservation = { ...values, plantHealth: derivedHealth, id };
    const nextObservations = observations.map((item) => item.id === id ? observation : item).sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    setObservations(nextObservations);
    if (previous && previous.plotId !== observation.plotId) reconcilePlotObservations(previous.plotId, nextObservations);
    reconcilePlotObservations(observation.plotId, nextObservations);
    recordActivity("Catatan pemantauan diperbarui", "observation");
    void persistMutation(`/api/observations/${encodeURIComponent(id)}`, "PATCH", observation, "Catatan berhasil diperbarui.");
    if (derivedHealth !== values.plantHealth) notify(`Status otomatis diubah ke "${derivedHealth}" berdasarkan catatan Anda.`, "info");
  }, [currentUser, observations, reconcilePlotObservations, notify, recordActivity, persistMutation]);

  const deleteObservation = useCallback((id: string) => {
    if (!currentUser) { notify("Silakan masuk terlebih dahulu.", "error"); return; }
    const removed = observations.find((item) => item.id === id);
    const nextObservations = observations.filter((item) => item.id !== id);
    setObservations(nextObservations);
    if (removed) reconcilePlotObservations(removed.plotId, nextObservations);
    recordActivity("Catatan pemantauan dihapus", "observation");
    void persistMutation(`/api/observations/${encodeURIComponent(id)}`, "DELETE", undefined, "Catatan berhasil dihapus.");
  }, [currentUser, observations, reconcilePlotObservations, notify, recordActivity, persistMutation]);

  const resetDemoData = useCallback(() => {
    if (currentUser?.role !== "admin") {
      notify("Hanya Admin yang dapat memulihkan seluruh dataset.", "error");
      return;
    }
    const seed = getSeedCopy();
    setPlots(seed.plots);
    setObservations(seed.observations);
    setActivities([{ id: makeId("activity"), message: "Data awal dipulihkan", dateTime: now(), type: "settings" }]);
    void persistMutation("/api/reset", "POST", undefined, "Dataset awal berhasil dipulihkan.");
  }, [currentUser, notify, persistMutation]);

  const value = useMemo(() => ({
    currentUser, login, logout, plots, observations, activities, hydrated, toasts,
    notify, dismissToast, addPlot, updatePlot, deletePlot,
    addObservation, updateObservation, deleteObservation, resetDemoData,
  }), [currentUser, login, logout, plots, observations, activities, hydrated, toasts, notify, dismissToast, addPlot, updatePlot, deletePlot, addObservation, updateObservation, deleteObservation, resetDemoData]);

  return <PlantationContext.Provider value={value}>{children}</PlantationContext.Provider>;
}
export function usePlantation() { const context = useContext(PlantationContext); if(!context) throw new Error("usePlantation harus digunakan di dalam PlantationProvider"); return context; }
