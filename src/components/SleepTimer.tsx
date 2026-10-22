import React, { useState } from 'react';
import { Timer, Clock, Moon, Plus, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface SleepTimerProps {
  timerMinutes: number; // 0 = continuous/off
  remainingSeconds: number;
  isRunning: boolean;
  fadeDurationMinutes: number;
  isFadingOut: boolean;
  theme?: ThemeConfig;
  onSelectTimer: (minutes: number) => void;
  onSetFadeDuration: (minutes: number) => void;
  onExtendTimer: (additionalMinutes: number) => void;
  onCancelTimer: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const TIMER_PRESETS = [
  { label: 'Off', minutes: 0 },
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
  { label: '90m', minutes: 90 },
  { label: '2 hrs', minutes: 120 },
  { label: '8 hrs', minutes: 480 },
];

export const SleepTimer: React.FC<SleepTimerProps> = ({
  timerMinutes,
  remainingSeconds,
  isRunning,
  fadeDurationMinutes,
  isFadingOut,
  theme = THEMES.amber,
  onSelectTimer,
  onSetFadeDuration,
  onExtendTimer,
  onCancelTimer,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const formatTime = (totalSecs: number) => {
    if (totalSecs <= 0) return '00:00';
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimerSeconds = timerMinutes * 60;
  const progressRatio =
    totalTimerSeconds > 0 ? (totalTimerSeconds - remainingSeconds) / totalTimerSeconds : 0;

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
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer hover:bg-[#262a32] transition-colors select-none"
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
            <Timer className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">Sleep Timer & Gentle Fade-Out</h2>
              {!expanded && (
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#1c1e24] text-[#8e95a5] border border-[#313543] truncate">
                  {timerMinutes > 0 && isRunning
                    ? `Remaining: ${formatTime(remainingSeconds)}`
                    : timerMinutes > 0
                    ? `Set: ${timerMinutes}m`
                    : 'Continuous (No Timer)'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Drift off peacefully without jarring abrupt silences'
                : 'Tap to configure sleep timer countdown and fade duration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {timerMinutes > 0 && isRunning && (
            <div className="hidden sm:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onExtendTimer(15)}
                className="px-2.5 py-1 text-xs font-medium text-[#c9ced8] bg-[#1c1e24] hover:bg-[#282d38] border border-[#333744] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Add 15 minutes"
              >
                <Plus className="w-3 h-3" style={{ color: theme.colorHex }} />
                <span>+15m</span>
              </button>
            </div>
          )}

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
        <div className="px-5 pb-6 md:px-6 md:pb-6 space-y-4 border-t border-[#2e333e] pt-5">
          {/* TIMER PRESET BUTTONS */}
          <div>
            <label className="text-xs font-medium text-[#8e95a5] mb-2 block">
              Select Sleep Duration
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {TIMER_PRESETS.map((preset) => {
                const isSelected = timerMinutes === preset.minutes;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSelectTimer(preset.minutes)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer whitespace-nowrap text-center ${
                      isSelected
                        ? 'bg-[#2e333e] shadow-sm'
                        : 'bg-[#1e2026] text-[#9ba2b3] border-[#323642] hover:bg-[#262933] hover:text-[#dfe3eb]'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: theme.colorHex,
                            color: theme.colorHex,
                          }
                        : undefined
                    }
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE COUNTDOWN VISUALIZER CARD */}
          {timerMinutes > 0 && isRunning ? (
            <div className="bg-[#1c1e24] border border-[#343844] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular SVG Ring */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#2a2e38"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={isFadingOut ? '#e08b62' : theme.colorHex}
                      strokeWidth="4"
                      strokeDasharray="176"
                      strokeDashoffset={176 * (1 - Math.min(1, Math.max(0, progressRatio)))}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <Clock
                    className={`w-5 h-5 absolute ${isFadingOut ? 'text-[#e08b62] animate-pulse' : ''}`}
                    style={!isFadingOut ? { color: theme.colorHex } : undefined}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-[#dfe3eb] tabular-nums tracking-wide">
                      {formatTime(remainingSeconds)}
                    </span>
                    {isFadingOut && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#e08b62]/15 text-[#e08b62] border border-[#e08b62]/30 flex items-center gap-1">
                        <VolumeX className="w-3 h-3" /> Fading out
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8e95a5] mt-0.5">
                    Audio smoothly ramps to silent before auto-stopping
                  </p>
                </div>
              </div>

              {/* Action Buttons: Add 15m, Cancel, Fade Duration */}
              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#2e333e] pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onExtendTimer(15)}
                    className="px-2.5 py-1 text-xs font-medium text-[#c9ced8] bg-[#252831] hover:bg-[#303541] border border-[#353a47] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" style={{ color: theme.colorHex }} />
                    <span>+15m</span>
                  </button>
                  <button
                    type="button"
                    onClick={onCancelTimer}
                    className="px-2.5 py-1 text-xs font-medium text-[#8e95a5] hover:text-[#c9ced8] bg-[#252831] hover:bg-[#303541] border border-[#353a47] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Fade Out Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8e95a5]">Fade:</span>
                  <div className="flex items-center gap-1 bg-[#252831] p-1 rounded-lg border border-[#353a47]">
                    {[1, 2, 5].map((fadeMin) => (
                      <button
                        key={fadeMin}
                        type="button"
                        onClick={() => onSetFadeDuration(fadeMin)}
                        className="px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer"
                        style={
                          fadeDurationMinutes === fadeMin
                            ? {
                                backgroundColor: '#313642',
                                color: theme.colorHex,
                              }
                            : { color: '#828898' }
                        }
                      >
                        {fadeMin}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1c1e24] border border-[#2e333e] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#8e95a5]">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#8e95a5]" />
                <span>
                  {timerMinutes === 0
                    ? 'Playing continuously without automatic shutoff'
                    : `Timer configured for ${timerMinutes} minutes (starts when audio plays)`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#717787]">
                <span>Fade out: {fadeDurationMinutes}m</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
