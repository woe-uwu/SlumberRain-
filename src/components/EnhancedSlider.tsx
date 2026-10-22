import React, { useRef } from 'react';
import { Volume2, VolumeX, Minus, Plus } from 'lucide-react';
import { ThemeConfig } from '../types';

interface EnhancedSliderProps {
  label: string;
  sublabel?: string;
  value: number; // 0 to 1
  onChange: (val: number) => void;
  theme: ThemeConfig;
  min?: number;
  max?: number;
  step?: number;
  showMuteToggle?: boolean;
  showQuickPills?: boolean;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  theme,
  min = 0,
  max = 1,
  step = 0.01,
  showMuteToggle = true,
  showQuickPills = true,
  minLabel = 'Silent',
  maxLabel = 'Maximum',
}) => {
  const previousNonZero = useRef<number>(value > 0 ? value : 0.5);

  if (value > 0.02) {
    previousNonZero.current = value;
  }

  const handleToggleMute = () => {
    if (value > 0.01) {
      onChange(0);
    } else {
      onChange(previousNonZero.current || 0.5);
    }
  };

  const handleStep = (delta: number) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(next);
  };

  const isMuted = value <= 0.01;
  const percentage = Math.round(((value - min) / (max - min)) * 100);

  const trackStyle = {
    background: `linear-gradient(to right, ${theme.colorHex} 0%, ${theme.colorHex} ${percentage}%, #2b2f38 ${percentage}%, #2b2f38 100%)`,
  };

  const QUICK_JUMPS = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="bg-[#1c1e24] border border-[#2e333e] rounded-xl p-4 transition-colors">
      {/* Header with Title and Mute/Value Cluster */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[#dfe3eb] truncate">{label}</div>
          {sublabel && <div className="text-[11px] text-[#7d8495] truncate">{sublabel}</div>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showMuteToggle && (
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-[#252831] text-[#9ba2b3] border-[#373d4d] hover:text-[#dfe3eb]'
              }`}
              title={isMuted ? 'Unmute volume' : 'Mute volume'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <span
            className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#252832] border border-[#343947] tabular-nums min-w-[42px] text-center"
            style={{ color: isMuted ? '#787f91' : theme.colorHex }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Slider Row with Minus / Plus Step Buttons */}
      <div className="flex items-center gap-2.5 py-1">
        <button
          type="button"
          onClick={() => handleStep(-0.05)}
          disabled={value <= min}
          className="w-7 h-7 rounded-lg bg-[#252831] hover:bg-[#2e333f] active:bg-[#1a1c22] border border-[#353b49] text-[#989fb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Decrease 5%"
          aria-label="Decrease 5%"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={trackStyle}
            className="w-full cursor-pointer h-2"
            aria-label={label}
          />
        </div>

        <button
          type="button"
          onClick={() => handleStep(0.05)}
          disabled={value >= max}
          className="w-7 h-7 rounded-lg bg-[#252831] hover:bg-[#2e333f] active:bg-[#1a1c22] border border-[#353b49] text-[#989fb0] hover:text-[#dfe3eb] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Increase 5%"
          aria-label="Increase 5%"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer: Quick Jump Percentage Pills & Min/Max Hints */}
      <div className="mt-2 pt-2 border-t border-[#292d37] flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#717787] truncate">{minLabel}</span>

        {showQuickPills && (
          <div className="flex items-center gap-1 shrink-0">
            {QUICK_JUMPS.map((jumpVal) => {
              const jumpPct = Math.round(jumpVal * 100);
              const isActive = Math.abs(value - jumpVal) < 0.03;
              return (
                <button
                  key={jumpPct}
                  type="button"
                  onClick={() => onChange(jumpVal)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2f3442] text-[#dfe3eb] border border-[#444b5c]'
                      : 'text-[#6e7485] hover:text-[#b0b7c7] hover:bg-[#242730]'
                  }`}
                  style={isActive ? { color: theme.colorHex, borderColor: theme.borderHex } : undefined}
                >
                  {jumpPct === 0 ? 'Mute' : `${jumpPct}%`}
                </button>
              );
            })}
          </div>
        )}

        <span className="text-[10px] text-[#717787] truncate text-right">{maxLabel}</span>
      </div>
    </div>
  );
};
