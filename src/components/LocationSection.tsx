import React from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { CONFIG } from '../config';
import { KazakhDivider } from './KazakhOrnaments';

export const LocationSection: React.FC = () => {
  return (
    <section
      id="location"
      data-section="location"
      aria-labelledby="location-heading"
      className="scroll-mt-20 relative z-10 py-20 sm:py-28 px-4 sm:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-[#F1D98A] tracking-[0.2em]">
            Той өтетін мекенжай
          </p>
          <h2
            id="location-heading"
            className="mt-3 text-3xl sm:text-5xl font-semibold text-[#FAF3E7] tracking-tight"
          >
            Қонақтарды күтетін орда
          </h2>
          <KazakhDivider className="mt-5" />
        </div>

        <div className="liquid-glass rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Сол баған: Мекенжай мен 2GIS сілтемесі */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#F1D98A] text-sm font-medium">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Өтетін орны</span>
              </div>
              <h3 className="mt-2 font-serif-display text-2xl sm:text-3xl font-semibold text-[#FAF3E7]">
                {CONFIG.venueName}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#FAF3E7]/85 leading-relaxed">
                {CONFIG.city}
              </p>

              <div className="mt-6 pt-6 border-t border-white/20 space-y-2.5 text-sm text-[#FAF3E7]/85">
                <p>
                  <span className="text-[#F1D98A] font-medium">Той иелері:</span>{' '}
                  {CONFIG.parents}
                </p>
                <p>
                  <span className="text-[#F1D98A] font-medium">Уақыты:</span>{' '}
                  <span className="tabular-nums">{CONFIG.dateDisplay} · {CONFIG.timeDisplay}</span>
                </p>
              </div>
            </div>

            <div>
              <a
                href={CONFIG.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#FAF3E7] text-[#6B0F1A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#F1D98A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1D98A]"
              >
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>2GIS-тен ашу</span>
              </a>
            </div>
          </div>

          {/* Оң баған: Сәнді Liquid Glass карта-схема */}
          <div className="lg:col-span-7 min-h-[280px] sm:min-h-[340px] rounded-[22px] overflow-hidden border border-white/25 bg-gradient-to-br from-[#3E0711]/90 via-[#2A040A]/95 to-[#1B0206]/95 relative flex flex-col justify-between p-6">
            {/* Сәнді векторлық қала картасы торы */}
            <svg
              viewBox="0 0 600 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
              <path
                d="M170 -20 C190 90 140 180 185 280 C210 340 195 390 195 400"
                stroke="rgba(241, 217, 138, 0.22)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M-20 120 Q280 140 620 95"
                stroke="rgba(250, 243, 231, 0.2)"
                strokeWidth="2.2"
              />
              <path
                d="M-20 225 Q300 205 620 240"
                stroke="rgba(241, 217, 138, 0.45)"
                strokeWidth="4"
              />
              <path
                d="M-20 315 Q320 295 620 325"
                stroke="rgba(250, 243, 231, 0.14)"
                strokeWidth="1.5"
              />
              <path
                d="M110 -20 L135 400 M295 -20 L315 400 M465 -20 L445 400"
                stroke="rgba(250, 243, 231, 0.14)"
                strokeWidth="1.6"
              />
              <circle
                cx="306"
                cy="214"
                r="22"
                stroke="rgba(241, 217, 138, 0.55)"
                strokeWidth="2"
                fill="rgba(107, 15, 26, 0.8)"
              />
              <path
                d="M0 365 L120 320 L240 345 L380 300 L500 335 L600 295 L600 380 L0 380 Z"
                fill="rgba(179, 18, 43, 0.18)"
              />
            </svg>

            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-[#F1D98A]/90 tracking-wider uppercase">
                2GIS бағыт сызбасы
              </span>
              <span className="text-xs text-[#FAF3E7]/75 tabular-nums">
                {CONFIG.dateDisplay} · {CONFIG.timeDisplay}
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/25 border border-[#F1D98A] flex items-center justify-center shadow-lg shadow-[#D4AF37]/25">
                <Navigation className="w-6 h-6 text-[#F1D98A]" aria-hidden="true" />
              </div>
              <div className="mt-3 liquid-glass-subtle rounded-2xl px-4 py-2.5">
                <p className="text-xs text-[#F1D98A] mt-0.5">{CONFIG.city}</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-[#FAF3E7]/75">
              <span>{CONFIG.city}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
