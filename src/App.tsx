/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minus,
  Plus,
  Moon,
  RotateCcw,
  Info,
  ShieldCheck,
  CloudRain,
  ChevronsUpDown,
  Smartphone,
} from 'lucide-react';

import { WeatherSettings, SoundPreset, RainType, FavoritePreset, ThemeAccent } from './types';
import { soundEngine } from './audio/soundEngine';
import { DEFAULT_PRESETS } from './data/presets';
import { THEMES } from './theme/themes';
import { SoundscapePresets } from './components/SoundscapePresets';
import { WeatherControls } from './components/WeatherControls';
import { SleepTimer } from './components/SleepTimer';
import { SoundscapeVisualizer } from './components/SoundscapeVisualizer';
import { BedsideMode } from './components/BedsideMode';
import { ThemeSelector } from './components/ThemeSelector';
import { SleepScienceModal } from './components/SleepScienceModal';
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { usePWAInstall } from './hooks/usePWAInstall';

const STORAGE_CUSTOM_PRESETS_KEY = 'slumberrain_custom_presets';
const STORAGE_LAST_SETTINGS_KEY = 'slumberrain_settings';
const STORAGE_FAVORITES_KEY = 'slumberrain_favorites';
const STORAGE_THEME_KEY = 'slumberrain_theme';
const STORAGE_EXPANDED_SECTIONS_KEY = 'slumberrain_expanded_sections';

interface ExpandedState {
  soundscapes: boolean;
  studio: boolean;
  timer: boolean;
}

export default function App() {
  const { isInstalled } = usePWAInstall();

  // Theme state
  const [themeId, setThemeId] = useState<ThemeAccent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved && saved in THEMES) return saved as ThemeAccent;
    } catch {
      // ignore
    }
    return 'amber';
  });

  const theme = THEMES[themeId];

  // Weather settings state
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LAST_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PRESETS[0].settings;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(DEFAULT_PRESETS[0].id);
  const [activeFavoriteId, setActiveFavoriteId] = useState<string | null>(null);

  // Streamlined 3-section expandable state
  const [expandedSections, setExpandedSections] = useState<ExpandedState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXPANDED_SECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      soundscapes: true,
      studio: true,
      timer: true,
    };
  });

  const toggleSection = (key: keyof ExpandedState) => {
    setExpandedSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_EXPANDED_SECTIONS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleAllSections = () => {
    setExpandedSections((prev) => {
      const allOpen = Object.values(prev).every(Boolean);
      const next = {
        soundscapes: !allOpen,
        studio: !allOpen,
        timer: !allOpen,
      };
      try {
        localStorage.setItem(STORAGE_EXPANDED_SECTIONS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Curated presets
  const [presets, setPresets] = useState<SoundPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_PRESETS_KEY);
      if (saved) {
        const custom = JSON.parse(saved);
        return [...DEFAULT_PRESETS, ...custom];
      }
    } catch {
      // ignore
    }
    return DEFAULT_PRESETS;
  });

  // Favorites state without wind
  const [favorites, setFavorites] = useState<FavoritePreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'fav-midnight-storm',
        name: 'Cozy Midnight Downpour',
        createdAt: Date.now() - 86400000,
        settings: {
          rainType: 'heavy-downpour',
          rainVolume: 0.85,
          thunderVolume: 0.60,
          thunderIntervalSeconds: 30,
          dropletPatterVolume: 0.50,
          subBassWarmth: 0.65,
          masterVolume: 0.80,
        },
        suggestedTimerMinutes: 45,
      },
      {
        id: 'fav-gentle-tin-roof',
        name: 'Rooftop Rain & Soft Thunder',
        createdAt: Date.now() - 43200000,
        settings: {
          rainType: 'city-rooftop',
          rainVolume: 0.80,
          thunderVolume: 0.35,
          thunderIntervalSeconds: 60,
          dropletPatterVolume: 0.70,
          subBassWarmth: 0.45,
          masterVolume: 0.80,
        },
        suggestedTimerMinutes: 60,
      },
    ];
  });

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(45);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45 * 60);
  const [fadeDurationMinutes, setFadeDurationMinutes] = useState<number>(2);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Bedside Nightstand Mode (12-hour clock)
  const [isBedsideMode, setIsBedsideMode] = useState<boolean>(false);

  // Informational Sleep Modal
  const [showSleepScience, setShowSleepScience] = useState<boolean>(false);
  // Android APK & WebAPK Download Modal
  const [showAndroidDownload, setShowAndroidDownload] = useState<boolean>(false);

  // Volume mute memory
  const previousMasterVolume = useRef<number>(settings.masterVolume > 0 ? settings.masterVolume : 0.8);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LAST_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, themeId);
    } catch {
      // ignore
    }
  }, [themeId]);

  // Audio Engine updates when settings change
  useEffect(() => {
    if (isPlaying) {
      soundEngine.updateSettings(settings);
    }
  }, [settings, isPlaying]);

  // Handle Play/Pause
  const handleTogglePlay = async () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setIsFadingOut(false);
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } else {
      await soundEngine.start(settings);
      setIsPlaying(true);
      if (timerMinutes > 0 && remainingSeconds <= 0) {
        setRemainingSeconds(timerMinutes * 60);
      }
    }
  };

  // Timer Tick Engine
  useEffect(() => {
    if (isPlaying && timerMinutes > 0) {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              window.clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            soundEngine.stop();
            setIsPlaying(false);
            setIsFadingOut(false);
            return 0;
          }

          const fadeSecs = fadeDurationMinutes * 60;
          if (prev <= fadeSecs && !isFadingOut) {
            setIsFadingOut(true);
            soundEngine.startFadeOut(prev);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPlaying, timerMinutes, fadeDurationMinutes, isFadingOut]);

  // Timer Controls
  const handleSelectTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsFadingOut(false);
    soundEngine.cancelFadeOut();
  };

  const handleExtendTimer = (additionalMinutes: number) => {
    setRemainingSeconds((prev) => prev + additionalMinutes * 60);
    if (isFadingOut) {
      setIsFadingOut(false);
      soundEngine.cancelFadeOut();
    }
  };

  const handleCancelTimer = () => {
    setTimerMinutes(0);
    setRemainingSeconds(0);
    setIsFadingOut(false);
    soundEngine.cancelFadeOut();
  };

  // Weather Settings updates
  const handleWeatherChange = (newSettings: WeatherSettings) => {
    setSettings(newSettings);
    setActivePresetId(null);
    setActiveFavoriteId(null);
  };

  const handleRainTypeSelect = (type: RainType) => {
    const updated = { ...settings, rainType: type };
    setSettings(updated);
    setActivePresetId(null);
    setActiveFavoriteId(null);
  };

  const handleTriggerThunder = () => {
    soundEngine.triggerThunder(true);
  };

  // Master Volume Controls
  const handleMasterStep = (delta: number) => {
    const next = Math.min(1, Math.max(0, Math.round((settings.masterVolume + delta) * 100) / 100));
    setSettings((prev) => ({ ...prev, masterVolume: next }));
  };

  const handleToggleMasterMute = () => {
    if (settings.masterVolume > 0.01) {
      previousMasterVolume.current = settings.masterVolume;
      setSettings((prev) => ({ ...prev, masterVolume: 0 }));
    } else {
      setSettings((prev) => ({
        ...prev,
        masterVolume: previousMasterVolume.current || 0.8,
      }));
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: SoundPreset) => {
    setActivePresetId(preset.id);
    setActiveFavoriteId(null);
    setSettings({ ...preset.settings });
    if (preset.suggestedTimerMinutes) {
      setTimerMinutes(preset.suggestedTimerMinutes);
      setRemainingSeconds(preset.suggestedTimerMinutes * 60);
    }
    if (isFadingOut) {
      setIsFadingOut(false);
      soundEngine.cancelFadeOut();
    }
  };

  // Favorites Handlers
  const handleApplyFavorite = (favorite: FavoritePreset) => {
    setActiveFavoriteId(favorite.id);
    setActivePresetId(null);
    setSettings({ ...favorite.settings });
    if (favorite.suggestedTimerMinutes) {
      setTimerMinutes(favorite.suggestedTimerMinutes);
      setRemainingSeconds(favorite.suggestedTimerMinutes * 60);
    }
    if (isFadingOut) {
      setIsFadingOut(false);
      soundEngine.cancelFadeOut();
    }
  };

  const handleSaveFavorite = (name: string) => {
    const newFav: FavoritePreset = {
      id: `fav-${Date.now()}`,
      name,
      createdAt: Date.now(),
      settings: { ...settings },
      suggestedTimerMinutes: timerMinutes,
    };
    setFavorites([newFav, ...favorites]);
    setActiveFavoriteId(newFav.id);
  };

  const handleDeleteFavorite = (id: string) => {
    setFavorites(favorites.filter((f) => f.id !== id));
    if (activeFavoriteId === id) {
      setActiveFavoriteId(null);
    }
  };

  const handleRenameFavorite = (id: string, newName: string) => {
    setFavorites(
      favorites.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };

  const handleResetDefaults = () => {
    const defaultSetting = DEFAULT_PRESETS[0].settings;
    setSettings(defaultSetting);
    setActivePresetId(DEFAULT_PRESETS[0].id);
    setActiveFavoriteId(null);
    setTimerMinutes(45);
    setRemainingSeconds(45 * 60);
    if (isPlaying) {
      soundEngine.updateSettings(defaultSetting);
    }
  };

  const handleApplySciencePreset = (partial: Partial<WeatherSettings>, timerMins?: number) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      if (isPlaying) {
        soundEngine.updateSettings(updated);
      }
      return updated;
    });
    if (timerMins) {
      setTimerMinutes(timerMins);
      setRemainingSeconds(timerMins * 60);
    }
  };

  const isMasterMuted = settings.masterVolume <= 0.01;
  const masterPct = Math.round(settings.masterVolume * 100);

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#1c1e22] text-[#c9ced8] flex flex-col font-sans"
      style={{
        ['--accent-color' as string]: theme.colorHex,
        ['--accent-glow' as string]: theme.glowRgba,
      }}
    >
      {/* FULLSCREEN BEDSIDE NIGHTSTAND VIEW (12-HOUR CLOCK) */}
      {isBedsideMode && (
        <BedsideMode
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          settings={settings}
          onUpdateVolume={(vol) => setSettings((prev) => ({ ...prev, masterVolume: vol }))}
          timerMinutes={timerMinutes}
          remainingSeconds={remainingSeconds}
          isFadingOut={isFadingOut}
          theme={theme}
          onExit={() => setIsBedsideMode(false)}
          onTriggerThunder={handleTriggerThunder}
        />
      )}

      {/* STREAMLINED NON-REPETITIVE TOP BAR (NO SIDE SCROLL & GUARANTEED FIT) */}
      <header className="sticky top-0 z-30 bg-[#1c1e22]/95 backdrop-blur-md border-b border-[#2d313b] px-3 sm:px-6 pt-[max(env(safe-area-inset-top,0px),0.5rem)] pb-2 overflow-x-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <div
              className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors shadow-xs shrink-0"
              style={{
                backgroundColor: theme.activeBg,
                borderColor: theme.borderHex,
                color: theme.colorHex,
              }}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#dfe3eb]">
              SlumberRain
            </span>
          </div>

          {/* Clean Nav Links (Desktop & Tablet only to protect mobile Play button) */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-[#8e95a5]">
            <button
              type="button"
              onClick={() => setShowSleepScience(true)}
              className="flex px-2.5 py-1.5 rounded-lg hover:bg-[#252831] hover:text-[#dfe3eb] transition-colors items-center gap-1.5 cursor-pointer"
              title="Sleep science and acoustic research"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Sleep Science</span>
            </button>
            {/* HIDE ANDROID APK BUTTON IF ALREADY INSTALLED */}
            {!isInstalled && (
              <button
                type="button"
                onClick={() => setShowAndroidDownload(true)}
                className="flex px-2.5 py-1.5 rounded-lg bg-[#222630] hover:bg-[#2a2f3c] border border-[#353b49] text-[#dfe3eb] hover:text-white transition-colors items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Download Android APK or install standalone app"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android APK</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleAllSections}
              className="hidden lg:flex px-2.5 py-1.5 rounded-lg hover:bg-[#252831] hover:text-[#dfe3eb] transition-colors items-center gap-1.5 cursor-pointer"
              title="Expand / minimize sections"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>Toggle Layout</span>
            </button>
          </nav>

          {/* Action Cluster: Moon Icon Button + Theme Dropdown + Play Button (Shrink-0 & Always Visible) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {/* Moon Icon Button (No text) */}
            <button
              type="button"
              onClick={() => setIsBedsideMode(true)}
              className="w-8 h-8 rounded-lg bg-[#22252c] hover:bg-[#282d36] border border-[#333744] flex items-center justify-center text-[#959cb0] hover:text-[#dfe3eb] transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Bedside Clock"
              aria-label="Open Bedside Clock"
            >
              <Moon className="w-4 h-4" style={{ color: theme.colorHex }} />
            </button>

            <ThemeSelector currentTheme={themeId} onSelectTheme={setThemeId} />

            {/* Master Play / Pause Button - HIGH PRIORITY, GUARANTEED VISIBLE & NEVER PUSHED OFF */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className="h-8 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-95 select-none shrink-0"
              style={
                isPlaying
                  ? {
                      backgroundColor: theme.colorHex,
                      color: '#16181d',
                    }
                  : {
                      backgroundColor: '#242730',
                      color: '#dfe3eb',
                      border: '1px solid #363c4a',
                    }
              }
              title={isPlaying ? 'Pause rain soundscape' : 'Play rain soundscape'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Pause</span>
                  <span className="flex items-end gap-0.5 h-2.5 ml-0.5" aria-hidden="true">
                    <span className="w-0.5 h-2.5 bg-[#16181d] rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-[#16181d] rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#16181d] rounded-full animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* HERO SECTION / QUICK STATUS BAR WITH MASTER VOLUME */}
        <section className="bg-[#23262d] border border-[#343844] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs text-[#8e95a5] flex-wrap">
              <span>Dim Nocturnal Palette</span>
              <span aria-hidden="true">·</span>
              <span>Authentic Field Recordings</span>
              <span aria-hidden="true">·</span>
              <span>100% Seamless Looping</span>
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-[#dfe3eb] tracking-tight">
              Drift to sleep accompanied by genuine recorded rainfall.
            </h1>
            <p className="text-xs text-[#8a91a1] leading-relaxed">
              Authentic acoustic rain recordings, real rolling thunder with precision interval timing, and a gentle fade-out timer.
            </p>

            {/* Quick Action Bar placed convenient & clean just below */}
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1e24] hover:bg-[#282d37] border border-[#343846] text-xs font-medium text-[#9da4b6] hover:text-[#dfe3eb] transition-all cursor-pointer shadow-xs active:scale-98"
                title="Reset all rain, thunder, and master volume levels to default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#8890a2]" />
                <span>Reset Mix</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSleepScience(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1e24] hover:bg-[#282d37] border border-[#343846] text-xs font-medium text-[#9da4b6] hover:text-[#dfe3eb] transition-all cursor-pointer shadow-xs active:scale-98"
                title="Learn how acoustic masking and pink noise improve slow-wave sleep"
              >
                <Info className="w-3.5 h-3.5 text-[#8890a2]" />
                <span>Sleep Science</span>
              </button>

              {!isInstalled && (
                <button
                  type="button"
                  onClick={() => setShowAndroidDownload(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1e24] hover:bg-[#282d37] border border-[#343846] text-xs font-medium text-emerald-400/90 hover:text-emerald-300 transition-all cursor-pointer shadow-xs active:scale-98"
                  title="Download APK package or install on Android phone"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Get Android APK</span>
                </button>
              )}
            </div>
          </div>

          {/* Master Volume Cluster with Step Buttons, Jump Presets & Fast Reset */}
          <div className="bg-[#1c1e24] border border-[#313542] rounded-xl p-3.5 flex flex-col gap-2 w-full md:w-auto md:min-w-[270px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a6adbc] font-medium flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" style={{ color: theme.colorHex }} />
                <span>Master Volume</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMasterMute}
                  className={`p-1 rounded-md border transition-colors cursor-pointer ${
                    isMasterMuted
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-[#252831] text-[#9ba2b3] border-[#373d4d] hover:text-[#dfe3eb]'
                  }`}
                  title={isMasterMuted ? 'Unmute master volume' : 'Mute master volume'}
                >
                  {isMasterMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#252832] border border-[#343947] tabular-nums min-w-[42px] text-center"
                  style={{ color: isMasterMuted ? '#787f91' : theme.colorHex }}
                >
                  {masterPct}%
                </span>
              </div>
            </div>

            {/* Slider with -5% / +5% fine adjustments */}
            <div className="flex items-center gap-2 py-0.5">
              <button
                type="button"
                onClick={() => handleMasterStep(-0.05)}
                disabled={settings.masterVolume <= 0}
                className="w-6 h-6 rounded-md bg-[#252831] hover:bg-[#2e333f] border border-[#353b49] text-[#989fb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Decrease master volume 5%"
              >
                <Minus className="w-3 h-3" />
              </button>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.masterVolume}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, masterVolume: parseFloat(e.target.value) }))
                  }
                  style={{
                    background: `linear-gradient(to right, ${theme.colorHex} 0%, ${theme.colorHex} ${masterPct}%, #2b2f38 ${masterPct}%, #2b2f38 100%)`,
                  }}
                  className="w-full cursor-pointer h-2"
                  aria-label="Master volume"
                />
              </div>

              <button
                type="button"
                onClick={() => handleMasterStep(0.05)}
                disabled={settings.masterVolume >= 1}
                className="w-6 h-6 rounded-md bg-[#252831] hover:bg-[#2e333f] border border-[#353b49] text-[#989fb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Increase master volume 5%"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Jumps & Fast Reset */}
            <div className="flex items-center justify-between pt-1 border-t border-[#292d37] text-[10px] text-[#717787]">
              <span>Quick:</span>
              <div className="flex items-center gap-1 font-mono">
                {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
                  const p = Math.round(v * 100);
                  const isCur = Math.abs(settings.masterVolume - v) < 0.03;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, masterVolume: v }))}
                      className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-[#2f3442] text-[#dfe3eb] font-semibold'
                          : 'hover:text-[#c9ced8] hover:bg-[#242730]'
                      }`}
                      style={isCur ? { color: theme.colorHex } : undefined}
                    >
                      {p === 0 ? 'Mute' : `${p}%`}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1 text-[10px] text-[#8e95a5] hover:text-[#dfe3eb] px-1.5 py-0.5 rounded hover:bg-[#252831] border border-transparent hover:border-[#353a48] transition-colors cursor-pointer"
                title="Reset to default soundscape mix"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </section>

        {/* CALM VISUALIZER CANVAS */}
        <SoundscapeVisualizer isPlaying={isPlaying} rainType={settings.rainType} theme={theme} />

        {/* 1. SOUNDSCAPES & PRESETS (UNIFIED PRESETS & FAVORITES TABBED CARD) */}
        <SoundscapePresets
          presets={presets}
          favorites={favorites}
          activePresetId={activePresetId}
          activeFavoriteId={activeFavoriteId}
          currentSettings={settings}
          theme={theme}
          onSelectPreset={handleSelectPreset}
          onApplyFavorite={handleApplyFavorite}
          onSaveFavorite={handleSaveFavorite}
          onDeleteFavorite={handleDeleteFavorite}
          onRenameFavorite={handleRenameFavorite}
          isExpanded={expandedSections.soundscapes}
          onToggleExpand={() => toggleSection('soundscapes')}
        />

        {/* 2. RAIN & THUNDER STUDIO (UNIFIED RECORDING SURFACE, RAINFALL VOLUME, THUNDER & TIMING, TEXTURE) */}
        <WeatherControls
          settings={settings}
          onChange={handleWeatherChange}
          onSelectRainType={handleRainTypeSelect}
          onTriggerThunder={handleTriggerThunder}
          isPlaying={isPlaying}
          theme={theme}
          isExpanded={expandedSections.studio}
          onToggleExpand={() => toggleSection('studio')}
        />

        {/* 3. SLEEP TIMER & GENTLE FADE OUT */}
        <SleepTimer
          timerMinutes={timerMinutes}
          remainingSeconds={remainingSeconds}
          isRunning={isPlaying}
          fadeDurationMinutes={fadeDurationMinutes}
          isFadingOut={isFadingOut}
          theme={theme}
          onSelectTimer={handleSelectTimer}
          onSetFadeDuration={setFadeDurationMinutes}
          onExtendTimer={handleExtendTimer}
          onCancelTimer={handleCancelTimer}
          isExpanded={expandedSections.timer}
          onToggleExpand={() => toggleSection('timer')}
        />

      </main>

      {/* SLEEP SCIENCE MODAL WITH RICH RESEARCH & PRESET TRIGGER */}
      <SleepScienceModal
        isOpen={showSleepScience}
        onClose={() => setShowSleepScience(false)}
        theme={theme}
        onApplyPreset={handleApplySciencePreset}
      />

      {/* ANDROID APK DOWNLOAD & INSTALL MODAL */}
      <AndroidDownloadModal
        isOpen={showAndroidDownload}
        onClose={() => setShowAndroidDownload(false)}
        theme={theme}
      />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#292d37] py-5 px-4 sm:px-6 text-center text-xs text-[#717787]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SlumberRain. Real field recordings &amp; seamless procedural audio for restorative sleep.</p>
          <div className="flex items-center gap-3 text-[#8a91a1]">
            <button
              type="button"
              onClick={() => setIsBedsideMode(true)}
              className="hover:text-[#dfe3eb] transition-colors cursor-pointer"
            >
              Bedside Clock (12h)
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowSleepScience(true)}
              className="hover:text-[#dfe3eb] transition-colors cursor-pointer"
            >
              Sleep Science
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowAndroidDownload(true)}
              className="hover:text-emerald-400 text-emerald-400/90 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Android App (Installed)' : 'Android APK'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
