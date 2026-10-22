import React, { useState } from 'react';
import { Heart, Star, Plus, Trash2, Edit2, Check, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { FavoritePreset, WeatherSettings, ThemeConfig } from '../types';

interface FavoritesSectionProps {
  favorites: FavoritePreset[];
  activeFavoriteId: string | null;
  currentSettings: WeatherSettings;
  theme: ThemeConfig;
  onApplyFavorite: (favorite: FavoritePreset) => void;
  onSaveFavorite: (name: string) => void;
  onDeleteFavorite: (id: string) => void;
  onRenameFavorite: (id: string, newName: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  activeFavoriteId,
  currentSettings,
  theme,
  onApplyFavorite,
  onSaveFavorite,
  onDeleteFavorite,
  onRenameFavorite,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  // Generate a smart suggested name based on current settings
  const generateSuggestedName = () => {
    let rainName = 'Rain';
    if (currentSettings.rainType === 'light-drizzle') rainName = 'Gentle Drizzle';
    if (currentSettings.rainType === 'heavy-downpour') rainName = 'Heavy Downpour';
    if (currentSettings.rainType === 'city-rooftop') rainName = 'Rooftop Patter';
    if (currentSettings.rainType === 'windowpane') rainName = 'Windowpane Rain';

    const tags: string[] = [];
    if (currentSettings.thunderVolume > 0.25) tags.push('Thunder');
    if (currentSettings.subBassWarmth > 0.5) tags.push('Deep Rumble');

    if (tags.length > 0) {
      return `${rainName} & ${tags.join(' + ')}`;
    }
    return `${rainName} Sleep Mix`;
  };

  const handleOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNameInput(generateSuggestedName());
    setIsAdding(true);
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

  const handleStartEdit = (fav: FavoritePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(fav.id);
    setEditNameInput(fav.name);
  };

  const handleSaveEdit = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editNameInput.trim()) {
      onRenameFavorite(id, editNameInput.trim());
      setEditingId(null);
    }
  };

  const formatRainType = (type: string) => {
    switch (type) {
      case 'light-drizzle': return 'Light Drizzle';
      case 'heavy-downpour': return 'Heavy Downpour';
      case 'city-rooftop': return 'Tin Rooftop Patter';
      case 'windowpane': return 'Windowpane Stream';
      default: return type;
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
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors shrink-0"
            style={{
              backgroundColor: theme.activeBg,
              borderColor: theme.borderHex,
              color: theme.colorHex,
            }}
          >
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">My Favorite Weather Mixes</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#1c1e24] text-[#8e95a5] border border-[#313543] font-mono">
                {favorites.length} saved
              </span>
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Quick one-tap access to your custom bedside soundscapes'
                : 'Tap to view or apply your saved weather combinations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {!isAdding && expanded && (
            <button
              type="button"
              onClick={handleOpenAdd}
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
          {/* Action Row / Save Form */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2a2e38]">
            <span className="text-xs text-[#8e95a5]">
              Save your current mix with custom rain, thunder interval, and warmth settings
            </span>

            {!isAdding ? (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto active:scale-95"
                style={{
                  backgroundColor: theme.activeBg,
                  borderColor: theme.borderHex,
                  color: theme.colorHex,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current Weather Mix</span>
              </button>
            ) : (
              <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Mix name..."
                  className="px-3 py-1.5 text-xs bg-[#1a1c22] border border-[#3e4454] rounded-lg text-[#dfe3eb] focus:outline-none focus:border-[#d89f5e] w-48 sm:w-60"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#1a1c22] cursor-pointer"
                  style={{ backgroundColor: theme.colorHex }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1.5 text-xs text-[#8e95a5] hover:text-[#dfe3eb] cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="bg-[#1b1d23] border border-dashed border-[#343846] rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: theme.activeBg, color: theme.colorHex }}
              >
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#dfe3eb] mb-1">No Favorite Mixes Saved Yet</h3>
              <p className="text-xs text-[#828898] max-w-md mb-4 leading-relaxed">
                Tune the authentic rain recording, thunder intensity, and sub-bass rumble to your ideal sleep balance, then tap save to create a bedtime preset.
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 text-xs font-semibold rounded-lg transition-transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: theme.colorHex, color: '#1a1c22' }}
              >
                Save Current Mix to Favorites
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {favorites.map((fav) => {
                const isSelected = activeFavoriteId === fav.id;
                const isEditing = editingId === fav.id;

                const thunderInterval = fav.settings.thunderIntervalSeconds ?? 60;

                return (
                  <div
                    key={fav.id}
                    className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-[#282c35] shadow-sm'
                        : 'bg-[#1e2026] hover:bg-[#252831]'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.colorHex : '#323642',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
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
                              className={`text-sm font-semibold truncate ${
                                isSelected ? 'text-[#dfe3eb]' : 'text-[#b7bcc9]'
                              }`}
                            >
                              {fav.name}
                            </h4>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleStartEdit(fav, e)}
                                className="p-1 text-[#717787] hover:text-[#c9ced8] rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                title="Rename favorite"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteFavorite(fav.id);
                                }}
                                className="p-1 text-[#717787] hover:text-rose-400 rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                title="Delete favorite"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-[#8e95a5] mb-3">
                        {formatRainType(fav.settings.rainType)}
                      </div>

                      {/* Settings Breakdown Chips (Rain, Thunder, Warmth) */}
                      <div className="grid grid-cols-3 gap-1.5 text-[11px] mb-3 font-mono">
                        <div className="bg-[#181a20] px-2 py-1 rounded border border-[#2d313c] flex items-center justify-between">
                          <span className="text-[#787f91]">Rain</span>
                          <span className="text-[#c9ced8] font-semibold tabular-nums">
                            {Math.round(fav.settings.rainVolume * 100)}%
                          </span>
                        </div>
                        <div className="bg-[#181a20] px-2 py-1 rounded border border-[#2d313c] flex items-center justify-between">
                          <span className="text-[#787f91]">Thunder</span>
                          <span className="text-[#c9ced8] font-semibold tabular-nums">
                            {Math.round(fav.settings.thunderVolume * 100)}%
                          </span>
                        </div>
                        <div className="bg-[#181a20] px-2 py-1 rounded border border-[#2d313c] flex items-center justify-between">
                          <span className="text-[#787f91]">Timing</span>
                          <span className="text-[#c9ced8] font-semibold tabular-nums">
                            {thunderInterval === 0 ? 'Manual' : `${thunderInterval}s`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2d313c] flex items-center justify-between">
                      <span className="text-[10px] text-[#6d7383]">
                        {new Date(fav.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => onApplyFavorite(fav)}
                        className="px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? theme.colorHex : '#282c36',
                          color: isSelected ? '#1a1c22' : '#c9ced8',
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
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
    </section>
  );
};
