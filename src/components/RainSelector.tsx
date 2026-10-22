import React, { useState } from 'react';
import { CloudRain, CloudDrizzle, Building2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { RainType, ThemeConfig } from '../types';
import { RAIN_TYPES } from '../data/presets';
import { THEMES } from '../theme/themes';

interface RainSelectorProps {
  currentType: RainType;
  onSelect: (type: RainType) => void;
  theme?: ThemeConfig;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const RainSelector: React.FC<RainSelectorProps> = ({
  currentType,
  onSelect,
  theme = THEMES.amber,
  isExpanded = true,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);

  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded;
  const toggle = onToggleExpand || (() => setInternalExpanded(!internalExpanded));

  const currentConfig = RAIN_TYPES.find((r) => r.id === currentType);

  const getIcon = (type: RainType) => {
    switch (type) {
      case 'light-drizzle':
        return <CloudDrizzle className="w-5 h-5" />;
      case 'heavy-downpour':
        return <CloudRain className="w-5 h-5" />;
      case 'city-rooftop':
        return <Building2 className="w-5 h-5" />;
      case 'windowpane':
        return <Eye className="w-5 h-5" />;
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
            {getIcon(currentType)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#dfe3eb]">Rain Character & Recording Selection</h2>
              {!expanded && currentConfig && (
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium border truncate"
                  style={{
                    backgroundColor: theme.activeBg,
                    borderColor: theme.borderHex,
                    color: theme.colorHex,
                  }}
                >
                  Selected: {currentConfig.title}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8e95a5] truncate">
              {expanded
                ? 'Choose your authentic studio acoustic recording surface'
                : currentConfig?.description || 'Tap to switch rain recording style'}
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
        <div className="px-5 pb-6 md:px-6 md:pb-6 space-y-4 border-t border-[#2e333e] pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RAIN_TYPES.map((typeConfig) => {
              const isSelected = currentType === typeConfig.id;
              return (
                <button
                  key={typeConfig.id}
                  type="button"
                  onClick={() => onSelect(typeConfig.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-[#2b2f38] shadow-sm'
                      : 'bg-[#1e2026] border-[#323642] hover:bg-[#252831] hover:border-[#3f4554]'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.colorHex : '#323642',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border'
                            : 'bg-[#262933] text-[#8e95a5] group-hover:text-[#c9ced8]'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: theme.activeBg,
                                borderColor: theme.borderHex,
                                color: theme.colorHex,
                              }
                            : undefined
                        }
                      >
                        {getIcon(typeConfig.id)}
                      </div>
                      {isSelected && (
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: theme.activeBg,
                            color: theme.colorHex,
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-semibold mb-1 transition-colors ${
                        isSelected ? 'text-[#dfe3eb]' : 'text-[#b7bcc9]'
                      }`}
                    >
                      {typeConfig.title}
                    </h3>
                    <p className="text-xs text-[#828898] leading-relaxed line-clamp-3">
                      {typeConfig.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#2e333e]/80 text-[11px] text-[#6e7485] font-normal truncate">
                    Best for: {typeConfig.recommendedUse}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
