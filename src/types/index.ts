export type UserRole = "admin" | "user";
export interface User { id: string; name: string; email: string; role: UserRole; }

export type PlantHealth = "Sehat" | "Perlu Perhatian" | "Perawatan" | "Belum Ada Data";
export type WeatherCondition = "Cerah" | "Berawan" | "Hujan" | "Badai" | "Lainnya";
export type CultivationStatus = "Aktif" | "Persiapan" | "Panen";

export interface Plant {
  name: string;
  variety: string;
  description: string;
  primaryMetric: string;
}

export interface PlotLocation {
  province: string;
  regency: string;
  address: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

export interface EnvironmentRecord {
  temperature: number;
  humidity: number;
  soilMoisture: number | null;
  rainfall: number | null;
  weather: WeatherCondition;
}

export interface GrowthRecord {
  date: string;
  heightCm: number;
  leaves: number;
  healthScore: number;
  progress: number;
  sourceObservationId?: string;
}

export interface PlotImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Plot {
  id: string;
  code: string;
  name: string;
  crop: string;
  variety: string;
  area: number;
  areaUnit: "m²" | "ha";
  plantedAt: string;
  population: number;
  location: PlotLocation;
  description: string;
  health: PlantHealth;
  cultivationStatus: CultivationStatus;
  progress: number;
  image: string;
  imageAlt: string;
  images: PlotImage[];
  notes: string;
  environment: EnvironmentRecord;
  growthHistory: GrowthRecord[];
}

export interface DailyObservation {
  id: string;
  plotId: string;
  dateTime: string;
  weather: WeatherCondition;
  temperature: number;
  humidity: number;
  soilMoisture: number | null;
  rainfall: number | null;
  growthNotes: string;
  plantHealth: PlantHealth;
  pestDisease: string;
  watering: string;
  fertilizer: string;
  notes: string;
}

export interface AppActivity {
  id: string;
  message: string;
  dateTime: string;
  type: "plot" | "observation" | "settings";
}

export interface PlotFormValues {
  name: string;
  crop: string;
  variety: string;
  area: number;
  areaUnit: "m²" | "ha";
  plantedAt: string;
  population: number;
  province: string;
  regency: string;
  address: string;
  description: string;
  health: PlantHealth;
  cultivationStatus: CultivationStatus;
  progress: number;
  image: string;
  notes: string;
}

export type ObservationFormValues = Omit<DailyObservation, "id">;
