import React, { useState } from 'react';
import {
  CloudRain,
  CloudDrizzle,
  Building2,
  Eye,
  Zap,
  Droplets,
  Waves,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WeatherSettings, RainType, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';
import { RAIN_TYPES } from '../data/presets';
import { EnhancedSlider } from './EnhancedSlider';

interface WeatherControlsProps {
  settings: WeatherSettings;
  onChange: (newSettings: WeatherSettings) => void;
  onSelectRainType: (type: RainType) => void;
  onTriggerThunder: () => void;
  isPlaying: boolean;
  theme?: ThemeConfig;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const THUNDER_INTERVAL_PRESETS = [
  { label: 'Manual Only', seconds: 0, description: 'Only rolls when tapped' },
  { label: '15s Storm', seconds: 15, description: 'Intense stormy claps' },
  { label: '30s Active', seconds: 30, description: 'Active rolling storm' },
  { label: '1m Periodic', seconds: 60, description: 'Cozy steady rhythm' },
  { label: '2m Occasional', seconds: 120, description: 'Gentle night thunder' },
  { label: '4m Rare', seconds: 240, description: 'Rare bedtime rumble' },
  { label: '8m Distant', seconds: 480, description: 'Ultra-distant horizon' },
];

export const WeatherControls: React.FC<WeatherControlsProps> = ({
  settings,
  onChange,
  onSelectRainType,
  onTriggerThunder,
  isPlaying,
  theme = THEMES.amber,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [thunderRumbling, setThunderRumbling] = useState(false);

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const updateField = <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleTestThunder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTriggerThunder();
    setThunderRumbling(true);
    setTimeout(() => setThunderRumbling(false), 3000);
  };

  const currentIntervalSec = settings.thunderIntervalSeconds ?? 60;
  const currentRainConfig = RAIN_TYPES.find((r) => r.id === settings.rainType);

  const getRainIcon = (type: RainType) => {
    switch (type) {
      case 'light-drizzle': return <CloudDrizzle className="w-4 h-4" />;
      case 'heavy-downpour': return <CloudRain className="w-4 h-4" />;
      case 'city-rooftop': return <Building2 className="w-4 h-4" />;
      case 'windowpane': return <Eye className="w-4 h-4" />;
    }
  };

  const formatIntervalDisplay = (secs: number) => {
    if (secs <= 0) return 'Manual Only (Roll thunder button)';
    if (secs < 60) return `Every ~${secs}s (±12% acoustic jitter)`;
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    if (rem === 0) {
      return `Every ~${mins} min (±12% acoustic jitter)`;
    }
    return `Every ~${mins}m ${rem}s (±12% acoustic jitter)`;
  };

  return (
    <section className="bg-[#23262d] border border-[#343844] rounded-2xl shadow-sm transition-all overflow-hidden">
      {/* EXPANDABLE SECTION HEADER */}
      <div
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer hover:bg-[#262a32] transition-colors select-none"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors shrink-0"
            style={{
              backgroundColor: theme.activeBg,
              borderColor: theme.borderHex,
              color: theme.colorHex,
            }}
          >
            <CloudRain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">Rain & Thunder Studio</h2>
              {!expanded && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#1c1e24] text-[#8e95a5] border border-[#313543] truncate font-mono">
                  {currentRainConfig?.title || 'Rain'} · Rain: {Math.round(settings.rainVolume * 100)}% · Thunder: {Math.round(settings.thunderVolume * 100)}% ({currentIntervalSec === 0 ? 'Manual' : `${currentIntervalSec}s`})
                </span>
              )}
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Select acoustic rain surface, adjust rainfall volume, and configure real thunder rolls'
                : 'Tap to configure recording character, volume, and thunder timing'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className="p-1.5 rounded-lg text-[#8e95a5] hover:text-[#dfe3eb] bg-[#1c1e24] hover:bg-[#282d38] border border-[#323644] transition-colors cursor-pointer"
            aria-label={expanded ? 'Minimize section' : 'Expand section'}
            title={expanded ? 'Minimize section' : 'Expand section'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EXPANDED CONTENT BODY */}
      {expanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-6 border-t border-[#2e333e] pt-5">
          {/* 1. RAIN RECORDING SURFACE SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#dfe3eb]">
                1. Rain Recording Surface
              </span>
              <span className="text-[11px] text-[#717887]">
                Authentic field recording
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RAIN_TYPES.map((typeConfig) => {
                const isSelected = settings.rainType === typeConfig.id;
                return (
                  <button
                    key={typeConfig.id}
                    type="button"
                    onClick={() => onSelectRainType(typeConfig.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#2b2f38] shadow-xs'
                        : 'bg-[#181a20] border-[#2e323e] hover:bg-[#20232b] hover:border-[#383d4c]'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.colorHex : '#2e323e',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center border"
                        style={
                          isSelected
                            ? {
                                backgroundColor: theme.activeBg,
                                borderColor: theme.borderHex,
                                color: theme.colorHex,
                              }
                            : {
                                backgroundColor: '#20232b',
                                borderColor: '#2e323e',
                                color: '#7a8292',
                              }
                        }
                      >
                        {getRainIcon(typeConfig.id)}
                      </div>
                      {isSelected && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: theme.activeBg,
                            color: theme.colorHex,
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-[#dfe3eb]' : 'text-[#a2a9b8]'
                      }`}
                    >
                      {typeConfig.title}
                    </div>
                    <div className="text-[10px] text-[#6e7485] truncate mt-0.5">
                      {typeConfig.recommendedUse}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. RAINFALL VOLUME */}
          <div>
            <EnhancedSlider
              label="Rainfall Volume"
              sublabel="Sets the acoustic presence of the selected rain recording"
              value={settings.rainVolume}
              onChange={(val) => updateField('rainVolume', val)}
              theme={theme}
              minLabel="Gentle Shower"
              maxLabel="Torrential Downpour"
            />
          </div>

          {/* 3. REAL THUNDER & TIMING CONTROLS */}
          <div className="bg-[#1c1e24] border border-[#2e333e] rounded-xl p-4 sm:p-5 space-y-4">
            {/* Thunder Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2a2e38]">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                    thunderRumbling ? 'scale-110 shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: theme.activeBg,
                    borderColor: theme.borderHex,
                    color: theme.colorHex,
                  }}
                >
                  <Zap className={`w-4 h-4 ${thunderRumbling ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-[#dfe3eb]">Real Recorded Thunderclaps</h3>
                    {settings.thunderVolume > 0 && currentIntervalSec > 0 && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: theme.activeBg,
                          borderColor: theme.borderHex,
                          color: theme.colorHex,
                        }}
                      >
                        Periodic Active
                      </span>
                    )}
                    {thunderRumbling && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        Rumbling Now...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#828898]">
                    Authentic thunder recordings with deep room-filling decay
                  </p>
                </div>
              </div>

              {/* Instant Manual Trigger Button - ALWAYS ACTIVE */}
              <button
                type="button"
                onClick={handleTestThunder}
                title="Roll an authentic thunderclap right now"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-95 shadow-xs"
                style={{
                  backgroundColor: thunderRumbling ? theme.activeBg : '#242831',
                  borderColor: thunderRumbling ? theme.borderHex : '#383e4d',
                  color: thunderRumbling ? theme.colorHex : '#dfe3eb',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: theme.colorHex }} />
                <span>{thunderRumbling ? 'Rumble Triggered' : 'Roll Thunder Now'}</span>
              </button>
            </div>

            {/* Thunder Volume Slider */}
            <EnhancedSlider
              label="Thunderclap & Rumble Volume"
              sublabel="Acoustic loudness of rolling thunderclaps"
              value={settings.thunderVolume}
              onChange={(val) => updateField('thunderVolume', val)}
              theme={theme}
              minLabel="Silent"
              maxLabel="Heavy Thunder"
            />

            {/* Thunder Frequency & Interval Timing Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-xs font-semibold text-[#dfe3eb] block">
                    Thunder Frequency & Interval Timing
                  </span>
                  <span className="text-[11px] text-[#7d8495]">
                    How often thunder rolls through the bedroom
                  </span>
                </div>
                <span
                  className="font-mono text-xs font-medium tabular-nums"
                  style={{ color: theme.colorHex }}
                >
                  {formatIntervalDisplay(currentIntervalSec)}
                </span>
              </div>

              {/* Quick Frequency Timing Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                {THUNDER_INTERVAL_PRESETS.map((preset) => {
                  const isSelected = currentIntervalSec === preset.seconds;
                  return (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() => updateField('thunderIntervalSeconds', preset.seconds)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#292d38] shadow-xs'
                          : 'bg-[#181a20] border-[#2e323e] hover:bg-[#20232b] hover:border-[#3c4150]'
                      }`}
                      style={{
                        borderColor: isSelected ? theme.colorHex : '#2e323e',
                      }}
                    >
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-[#dfe3eb]' : 'text-[#a2a9b8]'
                        }`}
                        style={isSelected ? { color: theme.colorHex } : undefined}
                      >
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-[#6b7282] truncate mt-0.5">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Granular Timing Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] text-[#787f91] mb-1 font-mono">
                  <span>0s (Manual)</span>
                  <span>15s</span>
                  <span>1m</span>
                  <span>2m</span>
                  <span>4m</span>
                  <span>8m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="480"
                  step="15"
                  value={currentIntervalSec}
                  onChange={(e) => updateField('thunderIntervalSeconds', parseInt(e.target.value, 10))}
                  style={{
                    background: `linear-gradient(to right, ${theme.colorHex} 0%, ${theme.colorHex} ${
                      (currentIntervalSec / 480) * 100
                    }%, #2b2f38 ${(currentIntervalSec / 480) * 100}%, #2b2f38 100%)`,
                  }}
                  className="w-full cursor-pointer h-2"
                  aria-label="Thunder Interval Timing"
                />
              </div>
            </div>
          </div>

          {/* 4. ACOUSTIC DETAIL LAYERS (DROPLETS & SUB-BASS BED) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <EnhancedSlider
              label="Droplet Splatter & Texture"
              sublabel="Crisp tactile splatter of raindrops hitting surfaces"
              value={settings.dropletPatterVolume}
              onChange={(val) => updateField('dropletPatterVolume', val)}
              theme={theme}
              minLabel="Muted"
              maxLabel="Crisp Texture"
            />

            <EnhancedSlider
              label="Sub-Bass Warmth Bed"
              sublabel="Deep soothing low-frequency Brownian bed masking echoes"
              value={settings.subBassWarmth}
              onChange={(val) => updateField('subBassWarmth', val)}
              theme={theme}
              minLabel="Neutral"
              maxLabel="Deep Warmth"
            />
          </div>
        </div>
      )}
    </section>
  );
};
