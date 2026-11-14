import React, { useEffect, useRef, useState } from 'react';
import { CONFIG, SectionKey } from '../config';
import { resolveSectionPhoto } from '../utils/invitation';

interface BackgroundSystemProps {
  activeSection: SectionKey;
  scrollProgress: number;
  confettiTrigger: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  vRot: number;
  hue: 'gold' | 'crimson' | 'champagne';
  life: number;
  maxLife: number;
}

const SECTION_PHOTO_INDEX: Record<SectionKey, number> = {
  hero: 0,
  bride: 1,
  photo: 1,
  details: 2,
  program: 3,
  countdown: 3,
  location: 2,
  rsvp: 4,
  finale: 4,
};

export const BackgroundSystem: React.FC<BackgroundSystemProps> = ({
  activeSection,
  scrollProgress,
  confettiTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const scrollVelRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const activeSectionRef = useRef<SectionKey>(activeSection);
  const confettiQueueRef = useRef(0);

  const [loadedPhotos, setLoadedPhotos] = useState<Record<string, boolean>>({});
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);

  activeSectionRef.current = activeSection;

  useEffect(() => {
    if (confettiTrigger > 0) {
      confettiQueueRef.current += 1;
    }
  }, [confettiTrigger]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mouse parallax (5-8px on desktop) & scroll velocity tracking
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 14;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      mouseOffsetRef.current = { x: nx, y: ny };
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;
      scrollVelRef.current = Math.min(25, delta * 0.25);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion]);

  // Ambient lightweight canvas particle & light-ray loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (reducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isMobile = width < 768;
    const maxAmbient = isMobile ? 22 : 34;

    const makeAmbientParticle = (randomY = true): Particle => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 16,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(0.25 + Math.random() * 0.55),
      size: 1.5 + Math.random() * 3.5,
      alpha: 0.25 + Math.random() * 0.55,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      hue: Math.random() > 0.35 ? 'gold' : 'champagne',
      life: 0,
      maxLife: 1,
    });

    const ambient: Particle[] = Array.from({ length: maxAmbient }, () => makeAmbientParticle(true));
    const confetti: Particle[] = [];

    let rayAngle = 0;
    let pulsePhase = 0;
    let rafId = 0;
    let lastProcessedConfetti = 0;
    let isHidden = document.hidden;

    const onVisibility = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const spawnConfettiBurst = () => {
      const burstCount = isMobile ? 26 : 48;
      const originX = width * 0.5;
      const originY = height * 0.42;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 6.5;
        confetti.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.4,
          size: 4 + Math.random() * 5,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.16,
          hue: i % 3 === 0 ? 'crimson' : i % 2 === 0 ? 'gold' : 'champagne',
          life: 0,
          maxLife: 110 + Math.random() * 40,
        });
      }
    };

    const draw = () => {
      rafId = window.requestAnimationFrame(draw);
      if (isHidden) return;

      ctx.clearRect(0, 0, width, height);

      const section = activeSectionRef.current;
      scrollVelRef.current *= 0.92;
      const boost = 1 + scrollVelRef.current * 0.12;

      if (confettiQueueRef.current > lastProcessedConfetti) {
        lastProcessedConfetti = confettiQueueRef.current;
        spawnConfettiBurst();
      }

      // 1. Bride section: subtle rotating Shanyraq golden light rays
      if (section === 'bride') {
        rayAngle += 0.002;
        ctx.save();
        ctx.translate(width / 2, height * 0.48);
        ctx.rotate(rayAngle);
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3);
          const grad = ctx.createLinearGradient(0, 0, 0, -Math.max(width, height) * 0.6);
          grad.addColorStop(0, 'rgba(241, 217, 138, 0.09)');
          grad.addColorStop(1, 'rgba(241, 217, 138, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(-24, 0);
          ctx.lineTo(24, 0);
          ctx.lineTo(90, -Math.max(width, height) * 0.6);
          ctx.lineTo(-90, -Math.max(width, height) * 0.6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Countdown section: calm breathing radial glow
      if (section === 'countdown') {
        pulsePhase += 0.025;
        const glowRadius = Math.min(width, height) * (0.36 + Math.sin(pulsePhase) * 0.04);
        const radial = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          glowRadius,
        );
        radial.addColorStop(0, 'rgba(212, 175, 55, 0.14)');
        radial.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Ambient particles tailored per active section
      const petalMode = section === 'details' || section === 'location';
      const bokehMode = section === 'photo';
      const petalLimit = isMobile ? 12 : 18;

      ambient.forEach((p, idx) => {
        if (petalMode && idx >= petalLimit) return;

        if (petalMode) {
          // Falling crimson & gold rose petals
          p.y += (0.55 + (idx % 3) * 0.2) * boost;
          p.x += Math.sin(p.y * 0.015 + idx) * 0.5;
          p.rotation += p.vRot;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle =
            idx % 2 === 0 ? `rgba(179, 18, 43, ${p.alpha * 0.72})` : `rgba(241, 217, 138, ${p.alpha * 0.55})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2.2, p.size * 1.15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (bokehMode) {
          // Soft bokeh orbs reacting to scroll
          p.y += p.vy * 0.55 * boost;
          p.x += p.vx * 0.6;
          if (p.y < -30) {
            p.y = height + 30;
            p.x = Math.random() * width;
          }
          const radius = p.size * 5.2;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          g.addColorStop(0, `rgba(241, 217, 138, ${p.alpha * 0.24})`);
          g.addColorStop(1, 'rgba(241, 217, 138, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rising golden sparkles
          p.y += p.vy * boost;
          p.x += p.vx;
          if (p.y < -16) {
            p.y = height + 16;
            p.x = Math.random() * width;
          }
          ctx.fillStyle =
            p.hue === 'gold'
              ? `rgba(241, 217, 138, ${p.alpha})`
              : `rgba(250, 243, 231, ${p.alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. RSVP Celebratory Gold Confetti
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.life += 1;
        c.vy += 0.08;
        c.vx *= 0.99;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.vRot;
        const fade = Math.max(0, 1 - c.life / c.maxLife);
        if (fade <= 0) {
          confetti.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle =
          c.hue === 'gold'
            ? `rgba(241, 217, 138, ${fade})`
            : c.hue === 'crimson'
              ? `rgba(179, 18, 43, ${fade})`
              : `rgba(250, 243, 231, ${fade})`;
        ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.65);
        ctx.restore();
      }
    };

    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  const activePhotoIdx = SECTION_PHOTO_INDEX[activeSection] ?? 0;
  const activePhoto = resolveSectionPhoto(CONFIG.photos, activePhotoIdx);

  // Deduplicate unique photo layers so each photo crossfades smoothly without flicker
  const uniquePhotos = CONFIG.photos.filter(
    (p, idx, arr) => arr.findIndex((other) => other.url === p.url) === idx,
  );

  const parallaxY = reducedMotion ? 0 : Math.round((scrollProgress - 0.5) * -36);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Баяу қозғалатын градиент орбалар (шыны астынан көрінеді) */}
      <div
        className="animate-orb-1 absolute -top-24 -left-24 w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full opacity-60 blur-[90px]"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 72%)' }}
      />
      <div
        className="animate-orb-2 absolute -bottom-32 -right-24 w-[60vw] h-[60vw] max-w-[740px] max-h-[740px] rounded-full opacity-55 blur-[110px]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      {/* Секцияға байланысты crossfade жасайтын фондық фотолар */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: reducedMotion
            ? undefined
            : `translate3d(${mouseOffsetRef.current.x * 0.4}px, ${parallaxY}px, 0) scale(1.06)`,
        }}
      >
        {uniquePhotos.map((photo) => {
          const isActive = activePhoto?.url === photo.url;
          const isLoaded = Boolean(loadedPhotos[photo.url]);
          const hasFailed = Boolean(failedPhotos[photo.url]);

          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {!hasFailed ? (
                <img
                  src={photo.url}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onLoad={() =>
                    setLoadedPhotos((prev) => (prev[photo.url] ? prev : { ...prev, [photo.url]: true }))
                  }
                  onError={() =>
                    setFailedPhotos((prev) => (prev[photo.url] ? prev : { ...prev, [photo.url]: true }))
                  }
                  className={`w-full h-full object-cover transition-[filter] duration-1000 ease-out ${
                    !reducedMotion ? 'animate-ken-burns' : ''
                  }`}
                  style={{
                    filter: isLoaded && isActive ? 'blur(0px)' : 'blur(18px)',
                  }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 25%, #B3122B 0%, #6B0F1A 48%, #2B040B 100%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Мәтін оқылуын қамтамасыз ететін қою бордо градиент қабаты */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(43,4,11,0.68) 0%, rgba(107,15,26,0.52) 45%, rgba(36,4,10,0.78) 100%)',
        }}
      />

      {/* Фондық мини-анимациялар канвасы */}
      <canvas
        ref={canvasRef}
        data-testid="ambient-canvas"
        className="absolute inset-0 w-full h-full"
      />

      {/* Экранның жоғарғы жағындағы скролл прогресс сызығы */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-white/10">
        <div
          className="h-full origin-left bg-gradient-to-r from-[#D4AF37] via-[#F1D98A] to-[#FAF3E7] transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${Math.max(0.02, Math.min(1, scrollProgress))})` }}
        />
      </div>
    </div>
  );
};
