import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Sun, Moon, Volume2, VolumeX, Minus, Plus, Timer, Zap, CloudRain } from 'lucide-react';
import { WeatherSettings, RainType, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface BedsideModeProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  settings: WeatherSettings;
  onUpdateVolume: (volume: number) => void;
  timerMinutes: number;
  remainingSeconds: number;
  isFadingOut: boolean;
  theme?: ThemeConfig;
  onExit: () => void;
  onTriggerThunder: () => void;
}

export const BedsideMode: React.FC<BedsideModeProps> = ({
  isPlaying,
  onTogglePlay,
  settings,
  onUpdateVolume,
  timerMinutes,
  remainingSeconds,
  isFadingOut,
  theme = THEMES.amber,
  onExit,
  onTriggerThunder,
}) => {
  const [time12h, setTime12h] = useState({ timeStr: '12:00', period: 'PM' });
  const [currentDate, setCurrentDate] = useState('');
  const [screenDimLevel, setScreenDimLevel] = useState(0.20);
  const [thunderTriggered, setThunderTriggered] = useState(false);
  const [is12Hour, setIs12Hour] = useState(true);
  const previousVolume = useRef(settings.masterVolume > 0 ? settings.masterVolume : 0.8);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      if (is12Hour) {
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // '0' becomes '12'
        setTime12h({
          timeStr: `${hours}:${minutes}`,
          period,
        });
      } else {
        setTime12h({
          timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          period: '',
        });
      }

      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [is12Hour]);

  const formatTimer = (totalSecs: number) => {
    if (totalSecs <= 0) return 'Continuous';
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRainLabel = (type: RainType) => {
    switch (type) {
      case 'light-drizzle': return 'Gentle Drizzle';
      case 'heavy-downpour': return 'Heavy Downpour';
      case 'city-rooftop': return 'Tin Rooftop Patter';
      case 'windowpane': return 'Windowpane Stream';
    }
  };

  const handleStepVolume = (delta: number) => {
    const next = Math.min(1, Math.max(0, Math.round((settings.masterVolume + delta) * 100) / 100));
    onUpdateVolume(next);
  };

  const handleToggleMute = () => {
    if (settings.masterVolume > 0.01) {
      previousVolume.current = settings.masterVolume;
      onUpdateVolume(0);
    } else {
      onUpdateVolume(previousVolume.current || 0.8);
    }
  };

  const handleManualThunder = () => {
    onTriggerThunder();
    setThunderTriggered(true);
    setTimeout(() => setThunderTriggered(false), 3000);
  };

  const isMuted = settings.masterVolume <= 0.01;
  const volPct = Math.round(settings.masterVolume * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 transition-colors duration-500 select-none overflow-hidden"
      style={{
        backgroundColor: '#16181d',
      }}
    >
      {/* Dynamic Nightstand Dimming Filter Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: '#000000',
          opacity: screenDimLevel,
        }}
      />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors"
            style={{
              backgroundColor: theme.activeBg,
              borderColor: theme.borderHex,
              color: theme.colorHex,
            }}
          >
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#b8bdca] block">
              {getRainLabel(settings.rainType)}
            </span>
            <span className="text-xs text-[#717787] flex items-center gap-1.5">
              <span>{isPlaying ? 'Soundscape active' : 'Paused'}</span>
              <span>·</span>
              <span>Volume: {volPct}%</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 12h / 24h Toggle */}
          <button
            type="button"
            onClick={() => setIs12Hour(!is12Hour)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#252832] hover:bg-[#313644] border border-[#353a47] text-[#9ba2b3] hover:text-[#dfe3eb] transition-colors cursor-pointer"
            title="Toggle 12h / 24h format"
          >
            {is12Hour ? '12 HR' : '24 HR'}
          </button>

          {/* Screen Dimmer Controls */}
          <div className="hidden sm:flex items-center gap-2 bg-[#252832] px-3 py-1.5 rounded-xl border border-[#353a47]">
            <Sun className="w-3.5 h-3.5 text-[#8e95a5]" />
            <input
              type="range"
              min="0"
              max="0.80"
              step="0.05"
              value={screenDimLevel}
              onChange={(e) => setScreenDimLevel(parseFloat(e.target.value))}
              className="w-20 cursor-pointer"
              title="Bedside screen dimming"
            />
            <Moon className="w-3.5 h-3.5" style={{ color: theme.colorHex }} />
          </div>

          <button
            type="button"
            onClick={onExit}
            className="p-2.5 rounded-xl bg-[#252832] hover:bg-[#313644] border border-[#353a47] text-[#9ba2b3] hover:text-[#dfe3eb] transition-colors cursor-pointer"
            title="Exit Bedside Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CENTER CLOCK & SLEEP STATUS (12-HOUR FORMAT) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        <div className="text-xs md:text-sm font-medium text-[#7d8495] tracking-widest uppercase mb-2">
          {currentDate}
        </div>

        {/* 12-Hour Bedside Time Display with Period Badge */}
        <div className="flex items-baseline justify-center gap-2 md:gap-4 font-mono font-light text-[#cfd4e0] drop-shadow-sm select-none">
          <span className="text-7xl md:text-9xl tracking-tight tabular-nums">
            {time12h.timeStr}
          </span>
          {time12h.period && (
            <span
              className="text-2xl md:text-4xl font-semibold tracking-wider self-start mt-2 md:mt-4 opacity-80"
              style={{ color: theme.colorHex }}
            >
              {time12h.period}
            </span>
          )}
        </div>

        {/* Timer readout */}
        <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#242833]/80 border border-[#343a49] text-xs text-[#959cb0]">
          <Timer
            className={`w-3.5 h-3.5 ${isFadingOut ? 'text-[#e08b62] animate-pulse' : ''}`}
            style={!isFadingOut ? { color: theme.colorHex } : undefined}
          />
          <span>
            {timerMinutes > 0 && isPlaying
              ? `Sleep timer: ${formatTimer(remainingSeconds)} ${isFadingOut ? '(Fading out)' : ''}`
              : 'Sleep timer: Continuous (no auto-stop)'}
          </span>
        </div>

        {/* Thunder Roll Audition Button */}
        <button
          type="button"
          onClick={handleManualThunder}
          className="mt-4 px-3.5 py-1.5 text-xs text-[#a4abbb] hover:text-[#dfe3eb] bg-[#22252e] hover:bg-[#2c313d] border border-[#323744] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          style={thunderTriggered ? { borderColor: theme.colorHex, color: theme.colorHex } : undefined}
        >
          <Zap className={`w-3.5 h-3.5 ${thunderTriggered ? 'animate-bounce' : ''}`} style={{ color: theme.colorHex }} />
          <span>{thunderTriggered ? 'Thunder Rumbling...' : 'Roll Thunder Now'}</span>
        </button>
      </div>

      {/* BOTTOM CONTROLS WITH TACTILE BUTTONS */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 max-w-xl mx-auto w-full pt-4 border-t border-[#292d37]">
        {/* Play/Pause Button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all transform active:scale-95 cursor-pointer shadow-lg"
            style={
              isPlaying
                ? {
                    backgroundColor: theme.colorHex,
                    color: '#1a1c22',
                  }
                : {
                    backgroundColor: '#2a2e38',
                    color: '#dfe3eb',
                    border: '1px solid #3f4657',
                  }
            }
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
          <div>
            <div className="text-sm font-semibold text-[#dfe3eb]">
              {isPlaying ? 'Rain Playing' : 'Playback Paused'}
            </div>
            <div className="text-xs text-[#717787]">
              {isPlaying ? 'Infinite seamless audio' : 'Press to start sleep rain'}
            </div>
          </div>
        </div>

        {/* Tactile Volume Controls */}
        <div className="flex items-center gap-2 w-full sm:w-64">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-[#252831] border border-[#353a47] text-[#959cb0] hover:text-[#dfe3eb] cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleStepVolume(-0.05)}
            disabled={settings.masterVolume <= 0}
            className="w-6 h-6 rounded-md bg-[#252831] border border-[#353a47] text-[#959cb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shrink-0"
            title="Decrease 5%"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.masterVolume}
            onChange={(e) => onUpdateVolume(parseFloat(e.target.value))}
            style={{
              background: `linear-gradient(to right, ${theme.colorHex} 0%, ${theme.colorHex} ${volPct}%, #2b2f38 ${volPct}%, #2b2f38 100%)`,
            }}
            className="w-full cursor-pointer h-2"
            aria-label="Master volume"
          />

          <button
            type="button"
            onClick={() => handleStepVolume(0.05)}
            disabled={settings.masterVolume >= 1}
            className="w-6 h-6 rounded-md bg-[#252831] border border-[#353a47] text-[#959cb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shrink-0"
            title="Increase 5%"
          >
            <Plus className="w-3 h-3" />
          </button>

          <span
            className="font-mono text-xs tabular-nums min-w-[36px] text-right"
            style={{ color: isMuted ? '#717787' : theme.colorHex }}
          >
            {volPct}%
          </span>
        </div>
      </div>
    </div>
  );
};
