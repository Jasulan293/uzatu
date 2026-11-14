import React, { useEffect, useState } from 'react';

interface BrideCalligraphyProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Ақ фонды тазалап, 3D алтын жазудың өзін ғана (ішкі жылтыр бөліктерін сақтап)
 * мөлдір PNG ретінде шығаратын компонент.
 */
export const BrideCalligraphy: React.FC<BrideCalligraphyProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!active) return;
      try {
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;
        if (!naturalW || !naturalH) {
          setFailed(true);
          return;
        }

        const scale = naturalW > 1240 ? 1240 / naturalW : 1;
        const w = Math.max(1, Math.round(naturalW * scale));
        const h = Math.max(1, Math.round(naturalH * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setFailed(true);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const total = w * h;

        const visited = new Uint8Array(total);
        const bgMask = new Uint8Array(total);
        const queue = new Int32Array(total);
        const component = new Int32Array(total);

        const isWhiteCandidate = (idx: number): boolean => {
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
          const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
          return min >= 224 && max - min <= 36;
        };

        // 1-қадам: сыртқы фон мен әріптердің ішкі ақ қуыстарын (ы, р, а) бөлектеу
        for (let i = 0; i < total; i++) {
          if (visited[i] || !isWhiteCandidate(i)) continue;

          let qHead = 0;
          let qTail = 0;
          let compLen = 0;
          let touchesBorder = false;

          visited[i] = 1;
          queue[qTail++] = i;

          while (qHead < qTail) {
            const curr = queue[qHead++];
            component[compLen++] = curr;

            const x = curr % w;
            const y = (curr - x) / w;
            if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
              touchesBorder = true;
            }

            if (x > 0) {
              const n = curr - 1;
              if (!visited[n] && isWhiteCandidate(n)) {
                visited[n] = 1;
                queue[qTail++] = n;
              }
            }
            if (x < w - 1) {
              const n = curr + 1;
              if (!visited[n] && isWhiteCandidate(n)) {
                visited[n] = 1;
                queue[qTail++] = n;
              }
            }
            if (y > 0) {
              const n = curr - w;
              if (!visited[n] && isWhiteCandidate(n)) {
                visited[n] = 1;
                queue[qTail++] = n;
              }
            }
            if (y < h - 1) {
              const n = curr + w;
              if (!visited[n] && isWhiteCandidate(n)) {
                visited[n] = 1;
                queue[qTail++] = n;
              }
            }
          }

          if (touchesBorder || compLen >= 80) {
            for (let k = 0; k < compLen; k++) {
              bgMask[component[k]] = 1;
            }
          }
        }

        // 2-қадам: фонды мөлдір ету және жиектердегі ақ ореолды жұмсарту
        for (let i = 0; i < total; i++) {
          const p = i * 4;
          if (bgMask[i]) {
            data[p + 3] = 0;
            continue;
          }

          const x = i % w;
          const y = (i - x) / w;
          let nearBg = false;

          for (let dy = -2; dy <= 2 && !nearBg; dy++) {
            const ny = y + dy;
            if (ny < 0 || ny >= h) continue;
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx;
              if (nx < 0 || nx >= w) continue;
              if (bgMask[ny * w + nx]) {
                nearBg = true;
                break;
              }
            }
          }

          if (nearBg) {
            const r = data[p];
            const g = data[p + 1];
            const b = data[p + 2];
            const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
            const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
            const chroma = max - min;

            if (min >= 185 && chroma <= 65) {
              const lightnessFactor = (min - 185) / 70;
              const chromaProtect = Math.min(1, chroma / 65);
              const alphaFloat = Math.max(0, Math.min(1, 1 - lightnessFactor * (1 - chromaProtect * 0.55)));
              const newAlpha = Math.round(alphaFloat * 255);
              if (alphaFloat > 0.06) {
                data[p] = Math.max(0, Math.min(255, Math.round((r - (1 - alphaFloat) * 255) / alphaFloat)));
                data[p + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - alphaFloat) * 255) / alphaFloat)));
                data[p + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - alphaFloat) * 255) / alphaFloat)));
              }
              data[p + 3] = newAlpha;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (!active) return;
          if (!blob) {
            setProcessedUrl(canvas.toDataURL('image/png'));
            return;
          }
          objectUrl = URL.createObjectURL(blob);
          setProcessedUrl(objectUrl);
        }, 'image/png');
      } catch {
        if (active) setFailed(true);
      }
    };

    img.onerror = () => {
      if (active) setFailed(true);
    };

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (failed) {
    return (
      <span
        className={`font-script font-normal tracking-normal text-7xl sm:text-[6.5rem] lg:text-[8.75rem] leading-[1.2] py-2 px-4 text-transparent bg-clip-text bg-gradient-to-b from-[#FAF3E7] via-[#F1D98A] to-[#D4AF37] inline-block ${className}`}
      >
        {alt}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {processedUrl ? (
        <img
          src={processedUrl}
          alt={alt}
          decoding="async"
          className="w-full max-w-[310px] sm:max-w-[500px] lg:max-w-[620px] h-auto object-contain select-none drop-shadow-[0_4px_10px_rgba(20,2,6,0.5)]"
        />
      ) : (
        <span className="font-script font-normal tracking-normal text-7xl sm:text-[6.5rem] lg:text-[8.75rem] leading-[1.2] py-2 px-4 text-[#F1D98A] opacity-80 inline-block">
          {alt}
        </span>
      )}
    </span>
  );
};
