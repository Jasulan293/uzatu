import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { computeCountdown, CountdownState, formatTwoDigits } from '../utils/invitation';
import { KazakhDivider } from './KazakhOrnaments';

interface UnitSlotProps {
  label: string;
  value: string;
}

const UnitSlot: React.FC<UnitSlotProps> = ({ label, value }) => {
  const prevRef = useRef(value);
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setFlipKey((k) => k + 1);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center px-2 sm:px-6 py-3 sm:py-4 relative">
      <span
        key={`num-${flipKey}`}
        className="animate-digit-flip font-serif-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#FAF3E7] tabular-nums tracking-tight leading-none"
      >
        {value}
      </span>
      <span className="mt-2 sm:mt-3 text-[11px] sm:text-sm font-medium text-[#F1D98A] tracking-[0.14em] uppercase">
        {label}
      </span>
    </div>
  );
};

export const CountdownSection: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownState>(() =>
    computeCountdown(CONFIG.eventDateISO),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(computeCountdown(CONFIG.eventDateISO));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    { label: 'Күн', value: formatTwoDigits(countdown.days) },
    { label: 'Сағат', value: formatTwoDigits(countdown.hours) },
    { label: 'Минут', value: formatTwoDigits(countdown.minutes) },
    { label: 'Секунд', value: formatTwoDigits(countdown.seconds) },
  ];

  return (
    <section
      id="countdown"
      data-section="countdown"
      aria-labelledby="countdown-heading"
      className="scroll-mt-20 relative z-10 py-24 sm:py-32 px-4 sm:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs sm:text-sm font-medium text-[#F1D98A] tracking-[0.2em]">
          Ақжолтай күнге дейін
        </p>
        <h2
          id="countdown-heading"
          className="mt-3 text-3xl sm:text-5xl font-semibold text-[#FAF3E7] tracking-tight"
        >
          Тойға қалған уақыт
        </h2>
        <KazakhDivider className="mt-5 mb-10 sm:mb-12" />

        {countdown.isPast ? (
          <div className="liquid-glass rounded-[32px] p-8 sm:p-10 max-w-xl mx-auto">
            <p className="font-serif-display text-2xl sm:text-3xl text-[#F1D98A]">
              Ақ тілек пен қуаныш күні келді!
            </p>
            <p className="mt-2 text-sm sm:text-base text-[#FAF3E7]/85">
{CONFIG.dateDisplay}
            </p>
          </div>
        ) : (
          <div
            aria-label="Тойға дейінгі кері санақ"
            className="liquid-glass rounded-[32px] p-6 sm:p-10 relative overflow-hidden"
          >
            {/* Жоғарғы сәнді күн-сағат белдеуі — біркелкі біртұтас жол */}
            <p className="text-[12px] sm:text-sm font-medium tracking-[0.04em] text-[#F1D98A] pb-5 sm:pb-7 border-b border-white/15 text-center leading-relaxed">
              <span className="tabular-nums whitespace-nowrap">{CONFIG.dateDisplay}</span>
              <span className="mx-2 text-[#F1D98A]/60" aria-hidden="true">·</span>
              <span className="tabular-nums whitespace-nowrap">{CONFIG.timeDisplay}</span>
              <span className="mx-2 text-[#F1D98A]/60" aria-hidden="true">·</span>
            </p>

            {/* Біртұтас 4 бөлікті уақыт панорамасы (бөлек карточкасыз) */}
            <div className="grid grid-cols-4 divide-x divide-white/15 py-5 sm:py-8">
              {units.map((u) => (
                <UnitSlot key={u.label} label={u.label} value={u.value} />
              ))}
            </div>

            {/* Төменгі сәнді қорытынды жол */}
            <div className="pt-5 sm:pt-6 border-t border-white/15 flex items-center justify-center gap-3 text-xs sm:text-sm text-[#FAF3E7]/80">
              <span>Ақ жол мен қуанышты кездесуге санаулы сәттер қалды</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
