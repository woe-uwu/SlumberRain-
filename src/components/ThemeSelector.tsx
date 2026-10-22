import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Palette } from 'lucide-react';
import { ThemeAccent, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeAccent;
  onSelectTheme: (themeId: ThemeAccent) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeThemeConfig = THEMES[currentTheme];
  const themesList = Object.values(THEMES);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* COMPACT TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2 sm:px-2.5 rounded-lg bg-[#22252c] hover:bg-[#282d36] border border-[#333744] text-xs font-medium text-[#c9ced8] flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shadow-xs active:scale-98 select-none whitespace-nowrap shrink-0"
        title="Change theme accent"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs transition-transform"
          style={{
            backgroundColor: activeThemeConfig.colorHex,
            boxShadow: `0 0 6px ${activeThemeConfig.glowRgba}`,
          }}
        />
        <span className="hidden sm:inline text-xs text-[#d5d9e2]">
          {activeThemeConfig.name}
        </span>
        <span className="sm:hidden text-xs text-[#d5d9e2]">Theme</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#828898] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#dfe3eb]' : ''
          }`}
        />
      </button>

      {/* DROPDOWN MENU POPOVER */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 sm:w-64 max-w-[calc(100vw-2rem)] rounded-xl bg-[#20232b] border border-[#363c4a] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <div className="px-2.5 py-1.5 flex items-center gap-1.5 border-b border-[#2d323e] mb-1">
            <Palette className="w-3 h-3 text-[#787f91]" />
            <span className="text-[10px] font-semibold text-[#808796] uppercase tracking-wider">
              Nocturnal Theme Accent
            </span>
          </div>

          <div className="space-y-0.5">
            {themesList.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-[#282d38] text-[#dfe3eb]'
                      : 'hover:bg-[#262932] text-[#b4bac7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-black/20"
                      style={{
                        backgroundColor: t.colorHex,
                        boxShadow: isSelected ? `0 0 8px ${t.glowRgba}` : 'none',
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-xs truncate group-hover:text-[#dfe3eb]">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-[#717887] truncate leading-tight">
                        {t.label}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 shrink-0 ml-2"
                      style={{ color: t.colorHex }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
