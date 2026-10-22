import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Heart,
  Plus,
  Check,
  Play,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SoundPreset, FavoritePreset, WeatherSettings, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface SoundscapePresetsProps {
  presets: SoundPreset[];
  favorites: FavoritePreset[];
  activePresetId: string | null;
  activeFavoriteId: string | null;
  currentSettings: WeatherSettings;
  theme?: ThemeConfig;
  onSelectPreset: (preset: SoundPreset) => void;
  onApplyFavorite: (favorite: FavoritePreset) => void;
  onSaveFavorite: (name: string) => void;
  onDeleteFavorite: (id: string) => void;
  onRenameFavorite: (id: string, newName: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const SoundscapePresets: React.FC<SoundscapePresetsProps> = ({
  presets,
  favorites,
  activePresetId,
  activeFavoriteId,
  currentSettings,
  theme = THEMES.amber,
  onSelectPreset,
  onApplyFavorite,
  onSaveFavorite,
  onDeleteFavorite,
  onRenameFavorite,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'presets' | 'favorites'>('presets');
  const [isAdding, setIsAdding] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const activePreset = presets.find((p) => p.id === activePresetId);
  const activeFav = favorites.find((f) => f.id === activeFavoriteId);

  const generateSuggestedName = () => {
    let rainName = 'Rain';
    if (currentSettings.rainType === 'light-drizzle') rainName = 'Gentle Drizzle';
    if (currentSettings.rainType === 'heavy-downpour') rainName = 'Heavy Downpour';
    if (currentSettings.rainType === 'city-rooftop') rainName = 'Rooftop Patter';
    if (currentSettings.rainType === 'windowpane') rainName = 'Windowpane Rain';

    const tags: string[] = [];
    if (currentSettings.thunderVolume > 0.25) tags.push('Thunder');
    if (currentSettings.subBassWarmth > 0.5) tags.push('Warm Bed');

    return tags.length > 0 ? `${rainName} & ${tags.join(' + ')}` : `${rainName} Sleep Mix`;
  };

  const handleOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNameInput(generateSuggestedName());
    setIsAdding(true);
    setActiveTab('favorites');
    if (!expanded && onToggleExpand) {
      onToggleExpand();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onSaveFavorite(nameInput.trim());
      setIsAdding(false);
      setNameInput('');
    }
  };

  const handleSaveEdit = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editNameInput.trim()) {
      onRenameFavorite(id, editNameInput.trim());
      setEditingId(null);
    }
  };

  return (
    <section className="bg-[#23262d] border border-[#343844] rounded-2xl shadow-sm transition-all overflow-hidden">
      {/* SECTION HEADER WITH INTEGRATED TABS */}
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
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">Soundscapes & Presets</h2>
              {!expanded && (
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium border truncate"
                  style={{
                    backgroundColor: theme.activeBg,
                    borderColor: theme.borderHex,
                    color: theme.colorHex,
                  }}
                >
                  Active: {activeFav?.name || activePreset?.name || 'Custom Mix'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Curated sleep profiles and your saved personal weather mixes'
                : 'Tap to switch sound presets or load saved favorites'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Quick Add Button */}
          {expanded && !isAdding && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="hidden sm:flex px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              style={{
                backgroundColor: theme.activeBg,
                borderColor: theme.borderHex,
                color: theme.colorHex,
              }}
              title="Save current weather mix to favorites"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Mix</span>
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

      {/* EXPANDED BODY WITH TAB NAVIGATION */}
      {expanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-4 border-t border-[#2e333e] pt-4">
          {/* Segmented Tab Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2b2f3a]">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#1c1e24] border border-[#303542]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('presets');
                  setIsAdding(false);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-[#292e39] text-[#dfe3eb] shadow-xs'
                    : 'text-[#828898] hover:text-[#c9ced8]'
                }`}
                style={activeTab === 'presets' ? { color: theme.colorHex } : undefined}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  <span className="hidden xs:inline">Curated </span>Presets ({presets.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-[#292e39] text-[#dfe3eb] shadow-xs'
                    : 'text-[#828898] hover:text-[#c9ced8]'
                }`}
                style={activeTab === 'favorites' ? { color: theme.colorHex } : undefined}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>
                  <span className="hidden xs:inline">My </span>Favorites ({favorites.length})
                </span>
              </button>
            </div>

            {/* Save Form or Trigger */}
            {!isAdding ? (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-xs font-medium flex items-center gap-1.5 hover:underline cursor-pointer self-start sm:self-auto"
                style={{ color: theme.colorHex }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save current settings to Favorites</span>
              </button>
            ) : (
              <form onSubmit={handleAddSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Mix name..."
                  className="px-2.5 py-1 text-xs bg-[#1a1c22] border border-[#3e4454] rounded-lg text-[#dfe3eb] focus:outline-none flex-1 sm:w-52"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg text-[#1a1c22] cursor-pointer"
                  style={{ backgroundColor: theme.colorHex }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1 text-xs text-[#8e95a5] hover:text-[#dfe3eb] cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* TAB 1: CURATED PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {presets.map((preset) => {
                const isSelected = activePresetId === preset.id && !activeFavoriteId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#2b2f38] shadow-xs'
                        : 'bg-[#1e2026] border-[#313541] hover:bg-[#252831] hover:border-[#3c4250]'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.colorHex : '#313541',
                    }}
                  >
                    <div>
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
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#2a2e38] text-[10px] text-[#6b7282] font-mono">
                      Rain {Math.round(preset.settings.rainVolume * 100)}% ·{' '}
                      {preset.settings.thunderVolume > 0 ? 'Thunder' : 'No thunder'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: MY FAVORITES */}
          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="bg-[#1b1d23] border border-dashed border-[#343846] rounded-xl p-6 text-center">
                  <Heart
                    className="w-6 h-6 mx-auto mb-2 opacity-60"
                    style={{ color: theme.colorHex }}
                  />
                  <p className="text-xs text-[#828898] mb-3">
                    No custom favorites saved yet. Adjust your ideal rain and thunder settings, then tap &quot;Save Mix&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer text-[#1a1c22]"
                    style={{ backgroundColor: theme.colorHex }}
                  >
                    Save Current Settings to Favorites
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {favorites.map((fav) => {
                    const isSelected = activeFavoriteId === fav.id;
                    const isEditing = editingId === fav.id;
                    const thunderInterval = fav.settings.thunderIntervalSeconds ?? 60;

                    return (
                      <div
                        key={fav.id}
                        className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between relative group ${
                          isSelected ? 'bg-[#282c35] shadow-xs' : 'bg-[#1e2026] hover:bg-[#252831]'
                        }`}
                        style={{
                          borderColor: isSelected ? theme.colorHex : '#323642',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            {isEditing ? (
                              <div className="flex items-center gap-1 w-full">
                                <input
                                  type="text"
                                  value={editNameInput}
                                  onChange={(e) => setEditNameInput(e.target.value)}
                                  className="px-2 py-0.5 text-xs bg-[#16181e] border border-[#3e4454] rounded text-[#dfe3eb] flex-1"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(fav.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => handleSaveEdit(fav.id, e)}
                                  className="p-1 text-[#8e95a5] hover:text-[#dfe3eb] cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <h4
                                  className={`text-xs font-semibold truncate ${
                                    isSelected ? 'text-[#dfe3eb]' : 'text-[#b7bcc9]'
                                  }`}
                                >
                                  {fav.name}
                                </h4>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingId(fav.id);
                                      setEditNameInput(fav.name);
                                    }}
                                    className="p-1 text-[#717787] hover:text-[#c9ced8] rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                    title="Rename favorite"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteFavorite(fav.id)}
                                    className="p-1 text-[#717787] hover:text-rose-400 rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                    title="Delete favorite"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-2.5 font-mono">
                            <div className="bg-[#181a20] px-1.5 py-0.5 rounded border border-[#2d313c] flex items-center justify-between">
                              <span className="text-[#787f91]">Rain</span>
                              <span className="text-[#c9ced8] font-semibold">
                                {Math.round(fav.settings.rainVolume * 100)}%
                              </span>
                            </div>
                            <div className="bg-[#181a20] px-1.5 py-0.5 rounded border border-[#2d313c] flex items-center justify-between">
                              <span className="text-[#787f91]">Thunder</span>
                              <span className="text-[#c9ced8] font-semibold">
                                {Math.round(fav.settings.thunderVolume * 100)}%
                              </span>
                            </div>
                            <div className="bg-[#181a20] px-1.5 py-0.5 rounded border border-[#2d313c] flex items-center justify-between">
                              <span className="text-[#787f91]">Timing</span>
                              <span className="text-[#c9ced8] font-semibold">
                                {thunderInterval === 0 ? 'Manual' : `${thunderInterval}s`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#2d313c] flex items-center justify-between">
                          <span className="text-[10px] text-[#6d7383]">
                            {new Date(fav.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => onApplyFavorite(fav)}
                            className="px-2.5 py-0.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            style={{
                              backgroundColor: isSelected ? theme.colorHex : '#282c36',
                              color: isSelected ? '#1a1c22' : '#c9ced8',
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Select</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
