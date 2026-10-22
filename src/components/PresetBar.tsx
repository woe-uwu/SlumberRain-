import React, { useState } from 'react';
import { Plus, Trash2, Check, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { SoundPreset, WeatherSettings, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface PresetBarProps {
  presets: SoundPreset[];
  activePresetId: string | null;
  currentSettings: WeatherSettings;
  theme?: ThemeConfig;
  onSelectPreset: (preset: SoundPreset) => void;
  onSaveCustomPreset: (name: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  presets,
  activePresetId,
  theme = THEMES.amber,
  onSelectPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customName, setCustomName] = useState('');

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const activePreset = presets.find((p) => p.id === activePresetId);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onSaveCustomPreset(customName.trim());
      setCustomName('');
      setIsSaving(false);
    }
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
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">Curated Soundscape Presets</h2>
              {!expanded && activePreset && (
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium border truncate"
                  style={{
                    backgroundColor: theme.activeBg,
                    borderColor: theme.borderHex,
                    color: theme.colorHex,
                  }}
                >
                  Active: {activePreset.name}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Pre-balanced weather profiles crafted for deep relaxation and restorative sleep'
                : 'Tap to view preset sound balances'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {!isSaving && expanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSaving(true);
              }}
              className="hidden sm:flex px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              style={{
                backgroundColor: theme.activeBg,
                borderColor: theme.borderHex,
                color: theme.colorHex,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Current</span>
            </button>
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
          {/* Custom Preset Save Row */}
          {isSaving && (
            <form onSubmit={handleSaveSubmit} className="flex items-center gap-2 pb-3 border-b border-[#2a2e38]">
              <input
                type="text"
                placeholder="Preset name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[#1a1c22] border border-[#3f4555] rounded-lg text-[#dfe3eb] focus:outline-none w-48 sm:w-64"
                style={{ borderColor: theme.borderHex }}
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer text-[#1a1c22]"
                style={{ backgroundColor: theme.colorHex }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="px-2 py-1 text-xs text-[#8e95a5] hover:text-[#c9ced8] cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {presets.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`p-3 rounded-xl border transition-all text-left relative flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#2b2f38] shadow-sm'
                      : 'bg-[#1e2026] border-[#313541] hover:bg-[#252831] hover:border-[#3c4250]'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.colorHex : '#313541',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-[#dfe3eb]' : 'text-[#b0b6c5]'
                        }`}
                      >
                        {preset.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: theme.colorHex }} />
                      )}
                    </div>
                    <p className="text-[11px] text-[#787f91] line-clamp-2 leading-relaxed">
                      {preset.subtitle}
                    </p>
                  </button>

                  {preset.isCustom && (
                    <div className="mt-2 pt-2 border-t border-[#2e333e] flex items-center justify-between">
                      <span className="text-[10px] font-medium" style={{ color: theme.colorHex }}>
                        Custom
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomPreset(preset.id);
                        }}
                        className="p-1 text-[#787f91] hover:text-rose-400 rounded transition-colors cursor-pointer"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
