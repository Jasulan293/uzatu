import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isPlaying, onToggleMusic }) => {
  return (
    <header className="fixed top-[3px] left-0 right-0 z-40 px-4 sm:px-8 pt-3 pointer-events-none">
      <div className="max-w-6xl mx-auto liquid-glass-subtle rounded-full px-5 sm:px-7 h-12 sm:h-14 flex items-center justify-between gap-4 sm:gap-8 pointer-events-auto">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#hero"
          className="font-serif-display text-lg sm:text-xl font-semibold tracking-wide text-[#FAF3E7] whitespace-nowrap shrink-0 hover:text-[#F1D98A] transition-colors"
        >
          Қыз ұзату
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Негізгі бөлімдер"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#FAF3E7]/85"
        >
          <a
            href="#bride"
            className="hover:text-[#F1D98A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Шырайлы
          </a>
          <a
            href="#details"
            className="hover:text-[#F1D98A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Мәлімет
          </a>
          <a
            href="#countdown"
            className="hover:text-[#F1D98A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Кері санақ
          </a>
          <a
            href="#location"
            className="hover:text-[#F1D98A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Мекенжай
          </a>
        </nav>

        {/* Zone 3: Single Primary Control — Music Toggle */}
        <div className="shrink-0">
          <button
            type="button"
            data-music-toggle="true"
            onClick={onToggleMusic}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Әуенді өшіру' : 'Әуенді қосу'}
            className={`min-h-[44px] sm:min-h-[40px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1D98A] ${
              isPlaying
                ? 'bg-[#D4AF37]/25 text-[#F1D98A] border border-[#F1D98A]/60'
                : 'bg-white/10 text-[#FAF3E7] border border-white/25 hover:bg-white/20'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{isPlaying ? 'Әуен қосулы' : 'Әуенді қосу'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
