import React from 'react';

interface OrnamentProps {
  className?: string;
}

/**
 * Қошқар мүйіз орталық ою-өрнек медальоны.
 * Hero және Финал секцияларында скролл арқылы айналады және қайта жиналады.
 */
export const QoshqarMuizMedallion: React.FC<OrnamentProps> = ({ className = '' }) => {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="goldOrnamentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1D98A" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#FAF3E7" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Сыртқы сақина — Құс қанат жиегі */}
      <g className="ornament-outer origin-center" style={{ transformOrigin: '200px 200px' }}>
        <circle
          cx="200"
          cy="200"
          r="186"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1"
          strokeDasharray="6 6"
          opacity="0.45"
        />
        <circle
          cx="200"
          cy="200"
          r="172"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        {angles.map((deg) => (
          <g key={`outer-${deg}`} transform={`rotate(${deg} 200 200)`}>
            {/* Қошқар мүйіз бұйрасы */}
            <path
              d="M200 26 C214 26 226 36 224 50 C222 61 210 64 206 55 C203 48 210 42 215 46 M200 26 C186 26 174 36 176 50 C178 61 190 64 194 55 C197 48 190 42 185 46"
              stroke="url(#goldOrnamentGrad)"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            {/* Тұмар үшбұрышы */}
            <path
              d="M200 66 L207 78 L200 90 L193 78 Z"
              stroke="url(#goldOrnamentGrad)"
              strokeWidth="1.4"
              fill="rgba(212, 175, 55, 0.12)"
            />
          </g>
        ))}
      </g>

      {/* Ортаңғы ою қабаты */}
      <g className="ornament-mid origin-center" style={{ transformOrigin: '200px 200px' }}>
        <circle
          cx="200"
          cy="200"
          r="116"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1.2"
          opacity="0.55"
        />
        {[0, 90, 180, 270].map((deg) => (
          <g key={`mid-${deg}`} transform={`rotate(${deg} 200 200)`}>
            <path
              d="M200 92 C220 92 234 106 230 122 C226 135 212 136 208 126 C205 118 213 112 218 117 M200 92 C180 92 166 106 170 122 C174 135 188 136 192 126 C195 118 187 112 182 117"
              stroke="url(#goldOrnamentGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M200 138 Q214 152 200 164 Q186 152 200 138 Z"
              stroke="url(#goldOrnamentGrad)"
              strokeWidth="1.4"
              fill="rgba(241, 217, 138, 0.14)"
            />
          </g>
        ))}
      </g>

      {/* Ішкі Шаңырақ-тұмар өзегі */}
      <g className="ornament-core origin-center" style={{ transformOrigin: '200px 200px' }}>
        <circle
          cx="200"
          cy="200"
          r="52"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1.6"
          opacity="0.85"
        />
        <circle
          cx="200"
          cy="200"
          r="34"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1.1"
          opacity="0.65"
        />
        <path
          d="M200 148 L200 252 M148 200 L252 200 M163 163 L237 237 M237 163 L163 237"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        <polygon
          points="200,174 226,200 200,226 174,200"
          stroke="url(#goldOrnamentGrad)"
          strokeWidth="1.8"
          fill="rgba(212, 175, 55, 0.18)"
        />
        <circle cx="200" cy="200" r="6" fill="#F1D98A" />
      </g>
    </svg>
  );
};

/**
 * Қыз есімінің айналасындағы киіз үй күмбезі — Шаңырақ SVG рамкасы.
 */
export const ShanyraqFrame: React.FC<OrnamentProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 440 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="shanyraqGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF3E7" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F1D98A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Негізгі шеңберлер */}
      <circle
        className="shanyraq-stroke"
        cx="220"
        cy="220"
        r="206"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.6"
      />
      <circle
        className="shanyraq-stroke"
        cx="220"
        cy="220"
        r="192"
        stroke="url(#shanyraqGold)"
        strokeWidth="1"
        opacity="0.6"
      />
      <circle
        className="shanyraq-stroke"
        cx="220"
        cy="220"
        r="158"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.1"
        opacity="0.45"
      />

      {/* Күлдіреуіш доғалары — Шаңырақтың айқыш өзегі */}
      <path
        className="shanyraq-stroke"
        d="M115 80 Q220 140 325 80"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.3"
        opacity="0.45"
      />
      <path
        className="shanyraq-stroke"
        d="M115 360 Q220 300 325 360"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.3"
        opacity="0.45"
      />
      <path
        className="shanyraq-stroke"
        d="M80 115 Q140 220 80 325"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.3"
        opacity="0.45"
      />
      <path
        className="shanyraq-stroke"
        d="M360 115 Q300 220 360 325"
        stroke="url(#shanyraqGold)"
        strokeWidth="1.3"
        opacity="0.45"
      />

      {/* Төрт бұрыштағы Қошқар мүйіз акценттері */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={`shan-${deg}`} transform={`rotate(${deg} 220 220)`}>
          <path
            className="shanyraq-stroke"
            d="M220 16 C234 16 244 25 241 36 C239 45 229 47 226 39 M220 16 C206 16 196 25 199 36 C201 45 211 47 214 39"
            stroke="url(#shanyraqGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
};

/**
 * Секциялар арасындағы нәзік Омыртқа / Қошқар мүйіз бөлгіші.
 */
export const KazakhDivider: React.FC<OrnamentProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#F1D98A]/60" />
      <svg width="46" height="24" viewBox="0 0 46 24" fill="none">
        <path
          d="M23 4 C29 4 34 8 33 13 C32 18 27 19 25 15 C24 12 27 10 29 12 M23 4 C17 4 12 8 13 13 C14 18 19 19 21 15 C22 12 19 10 17 12"
          stroke="#F1D98A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="23" cy="19" r="2" fill="#D4AF37" />
      </svg>
      <span className="h-px w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#F1D98A]/60" />
    </div>
  );
};

/**
 * Горизонталь скролл астындағы параллакс ою өрнек жолағы.
 */
export const KazakhBorderRibbon: React.FC<OrnamentProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 960 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const x = i * 80 + 40;
        return (
          <g key={i} transform={`translate(${x}, 36)`}>
            <path
              d="M0 -22 C14 -22 24 -12 21 -2 C19 6 10 8 7 1 C5 -4 10 -8 14 -4 M0 -22 C-14 -22 -24 -12 -21 -2 C-19 6 -10 8 -7 1 C-5 -4 -10 -8 -14 -4"
              stroke="#F1D98A"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.55"
            />
            <polygon
              points="0,8 6,16 0,24 -6,16"
              stroke="#D4AF37"
              strokeWidth="1.1"
              opacity="0.45"
            />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Қыздың есімін ("Шырайлы") сәнді жиектеп тұратын кең қазақы ою-өрнек аркасы.
 */
export const KazakhBrideOrnamentFrame: React.FC<OrnamentProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 640 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="brideCrestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#F1D98A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Орталық Қошқар мүйіз тәжі */}
      <path
        className="shanyraq-stroke"
        d="M320 14 C338 14 352 26 348 40 C345 50 332 52 327 44 C324 38 331 32 336 36 M320 14 C302 14 288 26 292 40 C295 50 308 52 313 44 C316 38 309 32 304 36"
        stroke="url(#brideCrestGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <polygon
        className="shanyraq-stroke"
        points="320,56 330,68 320,80 310,68"
        stroke="#F1D98A"
        strokeWidth="1.6"
        fill="rgba(241, 217, 138, 0.18)"
      />

      {/* Сол жақ Құс қанат / Қошқар мүйіз қанаты */}
      <path
        className="shanyraq-stroke"
        d="M286 68 H168 C144 68 134 50 148 38 C158 29 174 35 170 48 C167 56 156 57 153 50 M168 68 C140 68 118 82 90 82 H32"
        stroke="url(#brideCrestGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="82" r="3" fill="#F1D98A" opacity="0.7" />

      {/* Оң жақ Құс қанат / Қошқар мүйіз қанаты */}
      <path
        className="shanyraq-stroke"
        d="M354 68 H472 C496 68 506 50 492 38 C482 29 466 35 470 48 C473 56 484 57 487 50 M472 68 C500 68 522 82 550 82 H608"
        stroke="url(#brideCrestGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="616" cy="82" r="3" fill="#F1D98A" opacity="0.7" />
    </svg>
  );
};

