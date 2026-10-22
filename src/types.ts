export type RainType = 'light-drizzle' | 'heavy-downpour' | 'city-rooftop' | 'windowpane';

export interface WeatherSettings {
  rainType: RainType;
  rainVolume: number;              // 0 - 1
  thunderVolume: number;           // 0 - 1
  thunderIntervalSeconds: number;  // 0 (manual only) | 15 | 30 | 60 | 120 | 240 | 480 seconds
  thunderFrequency?: number;       // backwards compatibility helper
  dropletPatterVolume: number;     // 0 - 1 (crisp water splatter layer)
  subBassWarmth: number;           // 0 - 1 (cozy brown noise rumble bed)
  masterVolume: number;            // 0 - 1
}

export interface SoundPreset {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  rainType: RainType;
  settings: WeatherSettings;
  suggestedTimerMinutes: number;
  isCustom?: boolean;
}

export interface RainTypeConfig {
  id: RainType;
  title: string;
  description: string;
  frequencyProfile: string;
  recommendedUse: string;
}

export interface FavoritePreset {
  id: string;
  name: string;
  createdAt: number;
  settings: WeatherSettings;
  suggestedTimerMinutes?: number;
}

export type ThemeAccent = 'amber' | 'sage' | 'teal' | 'lavender' | 'coral';

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  label: string;
  colorHex: string;
  glowRgba: string;
  activeBg: string;
  borderHex: string;
}
