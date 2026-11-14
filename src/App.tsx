import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Calendar, Clock, MapPin } from 'lucide-react';
import { CONFIG, SectionKey } from './config';
import { BackgroundSystem } from './components/BackgroundSystem';
import { TopBar } from './components/TopBar';
import {
  KazakhBrideOrnamentFrame,
  KazakhDivider,
  QoshqarMuizMedallion,
} from './components/KazakhOrnaments';
import { CountdownSection } from './components/CountdownSection';
import { LocationSection } from './components/LocationSection';
import { BrideCalligraphy } from './components/BrideCalligraphy';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);
  const playInFlightRef = useRef(false);

  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  const tryStartMusic = async () => {
    const audio = audioRef.current;
    if (!audio || userPausedRef.current || !audio.paused || playInFlightRef.current) {
      return;
    }
    playInFlightRef.current = true;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Браузер алғашқы түртуді (touch/click) күтеді
    } finally {
      playInFlightRef.current = false;
    }
  };

  const handleToggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      userPausedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  // Сайт ашылғанда немесе экранды алғаш түрткенде музыка бірден ойнатылады
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.85;

    void tryStartMusic();

    const onFirstTouchOrClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-music-toggle="true"]')) {
        return;
      }
      if (userPausedRef.current || !audio.paused) {
        return;
      }
      void tryStartMusic();
    };

    const stopMusicOnExit = () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };

    // Қолданушы басқа қосымшаға/браузер қойындысына өткенде музыканы тоқтату
    const stopMusicWhenHidden = () => {
      if (document.visibilityState === 'hidden') {
        stopMusicOnExit();
      }
    };

    document.addEventListener('visibilitychange', stopMusicWhenHidden);
    window.addEventListener('pagehide', stopMusicOnExit);
    window.addEventListener('beforeunload', stopMusicOnExit);

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchstart', 'click', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, onFirstTouchOrClick, { capture: true, passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, onFirstTouchOrClick, { capture: true });
      });
      document.removeEventListener('visibilitychange', stopMusicWhenHidden);
      window.removeEventListener('pagehide', stopMusicOnExit);
      window.removeEventListener('beforeunload', stopMusicOnExit);
      audio.pause();
    };
  }, []);

  // Скролл прогресі мен белсенді секцияны анықтау
  useEffect(() => {
    let rafPending = false;
    const updateProgress = () => {
      rafPending = false;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const key = bestEntry.target.getAttribute('data-section') as SectionKey | null;
          if (key) setActiveSection(key);
        }
      },
      { threshold: [0.25, 0.55] },
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  // GSAP + ScrollTrigger скролл анимациялары (60fps, prefers-reduced-motion қолдауымен)
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero: скролл кезінде «Қыз ұзату» жазуы жеңіл масштабталып жоғары сырғиды
        gsap.to('.hero-title-wrap', {
          scale: 1.04,
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.35,
          },
        });

        // 2. Ою-өрнек сызықтарының stroke-dashoffset анимациясына дайындық
        const shanyraqStrokes = gsap.utils.toArray<SVGGeometryElement>('.shanyraq-stroke');
        shanyraqStrokes.forEach((el) => {
          const length = el.getTotalLength ? el.getTotalLength() : 600;
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        // 3. Фото секциясы: parallax + баяу zoom-out эффектісі
        gsap.fromTo(
          '.bride-portrait-img',
          { scale: 1.2, yPercent: -3 },
          {
            scale: 1.1,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: '#photo',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.35,
            },
          },
        );

        // 4. Той мәліметі: ықшамды біртұтас шыны панелінің шығуы
        gsap.from('.detail-card', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#details',
            start: 'top 82%',
            once: true,
          },
        });

        // Финал: ою-өрнектің қайта жиналуы
        gsap.fromTo(
          '.finale-medallion',
          { scale: 0.72, rotate: -75, opacity: 0.45 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#finale',
              start: 'top 85%',
              end: 'center center',
              scrub: 0.35,
            },
          },
        );
      });

      // Тек десктопқа арналған Pinned секция (>= 768px): скролл кезінде қыздың аты ашылады
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const brideTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#bride',
            start: 'top top',
            end: '+=115%',
            pin: true,
            scrub: 0.35,
          },
        });

        brideTl
          .to('#bride-tint', { opacity: 1, duration: 0.6 }, 0)
          .to(
            '.shanyraq-stroke',
            { strokeDashoffset: 0, duration: 0.9, stagger: 0.06, ease: 'power2.out' },
            0,
          )
          .fromTo(
            '.bride-letter',
            { y: 28, scale: 0.88, opacity: 0.08 },
            { y: 0, scale: 1, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out' },
            0.08,
          )
          .fromTo(
            '.bride-blessing',
            { y: 20, opacity: 0.2 },
            { y: 0, opacity: 1, duration: 0.45 },
            0.42,
          );
      });
    }, root);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen text-[#FAF3E7]">
      <audio
        ref={audioRef}
        src={CONFIG.musicUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <BackgroundSystem
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        confettiTrigger={0}
      />

      <TopBar isPlaying={isPlaying} onToggleMusic={handleToggleMusic} />

      <main className="relative z-10">
        {/* 1. HERO СЕКЦИЯСЫ — АРТЫНДАҒЫ АЙНАЛМА ОРНАМЕНТСІЗ, ТАЗА ОҚЫЛАТЫН «ҚЫЗ ҰЗАТУ» */}
        <section
          id="hero"
          data-section="hero"
          className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 pt-24 pb-16 overflow-hidden"
        >
          <div className="hero-title-wrap relative z-10 max-w-4xl mx-auto text-center">
            {/* Жоғарғы қазақы өрнекті тәж (жазудың үстінде, оқылуына кедергі келтірмейді) */}
            <div className="flex items-center justify-center mb-4" aria-hidden="true">
              <svg width="240" height="44" viewBox="0 0 240 44" fill="none">
                <path
                  d="M12 24 C36 24 44 10 62 12 C74 13 78 24 70 28 C64 31 58 26 62 21"
                  stroke="#F1D98A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M228 24 C204 24 196 10 178 12 C166 13 162 24 170 28 C176 31 182 26 178 21"
                  stroke="#F1D98A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M120 6 C128 6 135 12 133 19 C131 25 125 27 122 22 C120 18 124 15 127 18 M120 6 C112 6 105 12 107 19 C109 25 115 27 118 22 C120 18 116 15 113 18"
                  stroke="#F1D98A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <polygon
                  points="120,28 126,35 120,42 114,35"
                  stroke="#D4AF37"
                  strokeWidth="1.3"
                  fill="rgba(241, 217, 138, 0.2)"
                />
                <path d="M78 24 H102 M138 24 H162" stroke="rgba(241, 217, 138, 0.5)" strokeWidth="1" />
              </svg>
            </div>

            {/* Алғашқы беттегі басты жазу — қалыңдықтың аты */}
            <h1 className="mt-1 w-full bride-letter flex items-center justify-center">
              <BrideCalligraphy
                src={CONFIG.brideNameImage}
                alt={CONFIG.brideName}
                className="w-full [&>img]:!max-w-[min(92vw,760px)]"
              />
            </h1>

            <p className="mt-1 font-serif-display text-3xl sm:text-5xl lg:text-6xl font-semibold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FAF3E7] via-[#F1D98A] to-[#D4AF37] leading-tight drop-shadow-[0_8px_24px_rgba(24,2,6,0.7)]">
              {CONFIG.tagline}
            </p>

            {/* Төменгі өрнекті бөлгіш */}
            <KazakhDivider className="mt-6 mb-6" />

            <p className="text-sm sm:text-base text-[#FAF3E7]/95 tracking-wide drop-shadow-[0_2px_10px_rgba(24,2,6,0.7)] leading-relaxed">
              <span className="tabular-nums whitespace-nowrap">{CONFIG.dateDisplay}</span>{' '}
              <span aria-hidden="true">·</span>{' '}
              <span className="tabular-nums whitespace-nowrap">{CONFIG.timeDisplay}</span>{' '}
              <span aria-hidden="true">·</span>{' '}
              <span className="whitespace-nowrap">{CONFIG.city}</span>
            </p>

            <a
              href="#bride"
              className="mt-8 inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3 rounded-full liquid-glass text-sm sm:text-base font-medium text-[#FAF3E7] hover:text-[#F1D98A] hover:border-[#F1D98A]/60 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1D98A]"
            >
              <span>Шақыруды ашу</span>
              <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* 2. СКРОЛЛ КЕЗІНДЕ ҚАЗАҚИ ӘДЕМІ ОРНАМЕНТПЕН ҮЛКЕЙІП АШЫЛАТЫН «ШЫРАЙЛЫ» */}
        <section
          id="bride"
          data-section="bride"
          aria-labelledby="bride-heading"
          className="scroll-mt-20 relative min-h-[92vh] sm:min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 py-24 overflow-hidden"
        >
          {/* Скролл кезінде қызылдан қою бордоға өтетін нәзік қабат */}
          <div
            id="bride-tint"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-b from-[#6B0F1A]/75 via-[#4A0812]/70 to-[#2B040B]/80"
          />

          <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
            {/* Үлкен қазақы өрнекті жоғарғы тәж */}
            <KazakhBrideOrnamentFrame className="w-full max-w-[540px] h-auto mb-2" />

            <p className="text-xs sm:text-sm font-medium text-[#F1D98A] tracking-[0.26em] uppercase">
              {CONFIG.blessing}
            </p>

            {/* Үлкен қолжазба (рукописный) «Шырайлы» жазуы — екі жағында қазақы ою жиегі */}
            <div className="mt-3 flex items-center justify-center gap-3 sm:gap-6 w-full">
              <svg
                className="hidden sm:block w-14 h-14 shrink-0 text-[#F1D98A]/80"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="shanyraq-stroke"
                  d="M56 32 H26 C14 32 10 20 18 14 C24 9 33 13 31 22 C29 28 22 29 20 24 M26 32 C14 32 10 44 18 50 C24 55 33 51 31 42 C29 36 22 35 20 40"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <h2
                id="bride-heading"
                aria-label={CONFIG.brideName}
                className="bride-letter inline-flex items-center justify-center py-2 px-2"
              >
                <BrideCalligraphy src={CONFIG.brideNameImage} alt={CONFIG.brideName} />
              </h2>

              <svg
                className="hidden sm:block w-14 h-14 shrink-0 text-[#F1D98A]/80 scale-x-[-1]"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="shanyraq-stroke"
                  d="M56 32 H26 C14 32 10 20 18 14 C24 9 33 13 31 22 C29 28 22 29 20 24 M26 32 C14 32 10 44 18 50 C24 55 33 51 31 42 C29 36 22 35 20 40"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Төменгі симметриялы қазақы ою жиегі */}
            <KazakhBrideOrnamentFrame className="w-full max-w-[460px] h-auto mt-2 rotate-180 opacity-85" />

            <div className="bride-blessing mt-8 liquid-glass rounded-[28px] p-6 sm:p-9 max-w-2xl">
              <p className="text-base sm:text-lg text-[#FAF3E7]/95 leading-relaxed">
                {CONFIG.wishesText}
              </p>
              <p className="mt-4 text-sm sm:text-base font-medium text-[#F1D98A]">
                Құрметпен, той иелері {CONFIG.parents}
              </p>
            </div>
          </div>
        </section>

        {/* 3. ФОТО СЕКЦИЯ — LIQUID GLASS ПОРТРЕТ */}
        <section
          id="photo"
          data-section="photo"
          aria-labelledby="photo-heading"
          className="scroll-mt-20 relative z-10 py-24 sm:py-32 px-4 sm:px-8"
        >
          <div className="max-w-5xl mx-auto liquid-glass rounded-[32px] p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 rounded-[24px] overflow-hidden border border-white/25 bg-[#2B040B]/50 aspect-[3/4] max-h-[560px] w-full">
              {!portraitFailed ? (
                <img
                  src={CONFIG.portraitPhoto.url}
                  alt={CONFIG.portraitPhoto.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitFailed(true)}
                  className="bride-portrait-img w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#B3122B]/50 to-[#2B040B]">
                  <QoshqarMuizMedallion className="w-32 h-32 opacity-70" />
                  <p className="mt-4 font-serif-display text-2xl text-[#FAF3E7]">
                    {CONFIG.brideName}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center text-left py-2 sm:px-4">
              <p className="text-xs sm:text-sm font-medium text-[#F1D98A] tracking-[0.2em]">
                Әулет мақтанышы
              </p>
              <h2
                id="photo-heading"
                className="mt-3 font-serif-display text-3xl sm:text-5xl font-semibold text-[#FAF3E7] leading-tight"
              >
                {CONFIG.portraitPhoto.caption}
              </h2>
              <KazakhDivider className="mt-6 mb-6 !justify-start" />
              <p className="text-base sm:text-lg text-[#FAF3E7]/85 leading-relaxed">
                Қызымыз {CONFIG.brideName} жаңа өмір белесіне қадам басып, ақ босаға аттағалы отыр. Ағайын-туыс пен жақын жандардың ақ батасы — жас өмірдің ең үлкен берекесі.
              </p>
              <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#F1D98A]">
                <span>Той иелері: {CONFIG.parents}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{CONFIG.dateDisplay}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ТОЙ МӘЛІМЕТІ — ЫҚШАМДЫ БІРТҰТАС ШЫНЫ ПАНЕЛІ */}
        <section
          id="details"
          data-section="details"
          aria-labelledby="details-heading"
          className="scroll-mt-20 relative z-10 py-16 sm:py-24 px-4 sm:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-xs sm:text-sm font-medium text-[#F1D98A] tracking-[0.2em]">
                Салтанатты кездесу
              </p>
              <h2
                id="details-heading"
                className="mt-2.5 text-3xl sm:text-5xl font-semibold text-[#FAF3E7] tracking-tight"
              >
                Той туралы мәлімет
              </h2>
              <KazakhDivider className="mt-4" />
            </div>

            <div className="detail-card liquid-glass rounded-[28px] px-5 py-2 sm:px-8 sm:py-6">
              <div className="grid grid-cols-1 md:grid-cols-[0.88fr_0.92fr_1.35fr] divide-y md:divide-y-0 md:divide-x divide-white/15">
                <div className="flex items-start gap-3.5 py-4 md:py-2 md:pr-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-5 h-5 text-[#F1D98A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#F1D98A]/90 tracking-[0.14em] uppercase">
                      Күні
                    </p>
                    <h3 className="mt-1 font-serif-display text-2xl sm:text-[1.45rem] font-semibold text-[#FAF3E7] tabular-nums leading-snug">
                      {CONFIG.dateDisplay}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#FAF3E7]/80">
                      {CONFIG.weekdayDisplay}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 py-4 md:py-2 md:px-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#F1D98A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#F1D98A]/90 tracking-[0.14em] uppercase">
                      Уақыты
                    </p>
                    <h3 className="mt-1 font-serif-display text-2xl sm:text-[1.45rem] font-semibold text-[#FAF3E7] tabular-nums leading-snug">
                      {CONFIG.timeDisplay}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#FAF3E7]/80">
                      Қонақтарды қарсы алу
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 py-4 md:py-2 md:pl-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#F1D98A]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#F1D98A]/90 tracking-[0.14em] uppercase">
                      Өтетін орны
                    </p>
                    <h3 className="mt-1 font-serif-display text-xl sm:text-[1.45rem] font-semibold text-[#FAF3E7] leading-snug">
                      Мекенжай
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#FAF3E7]/80">
                      {CONFIG.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. КЕРІ САНАҚ (COUNTDOWN) */}
        <CountdownSection />

        {/* 6. КАРТА ЖӘНЕ МЕКЕНЖАЙ */}
        <LocationSection />

        {/* 7. ФИНАЛ */}
        <footer
          id="finale"
          data-section="finale"
          className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 text-center"
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="finale-medallion w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center">
              <QoshqarMuizMedallion className="w-full h-full" />
            </div>

            <h2 className="animate-gentle-shimmer mt-8 font-serif-display text-4xl sm:text-6xl font-semibold text-[#F1D98A]">
              Сіздерді күтеміз!
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#FAF3E7]/85">
              Ізгі ниетпен, той иелері {CONFIG.parents} <span aria-hidden="true">·</span>{' '}
              <span className="tabular-nums">{CONFIG.dateDisplay}</span>
            </p>

            <KazakhDivider className="mt-8" />
          </div>
        </footer>
      </main>
    </div>
  );
}
