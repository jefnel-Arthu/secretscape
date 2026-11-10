import React, { useEffect, useRef } from 'react';

const COLORS = ['#FFD600', '#FFB300', '#FFFFFF', '#F3EEE8', '#FF8A00', '#5EEAD4', '#F472B6'];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
};

type Burst = {
  at: number;
  x: number;
  y: number;
  color: string;
  fired: boolean;
};

interface FireworksOverlayProps {
  duration?: number;
}

export const FireworksOverlay: React.FC<FireworksOverlayProps> = ({ duration = 3400 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const schedule = [0, 260, 520, 800, 1080, 1420, 1780];
    const bursts: Burst[] = schedule.map((delay, index) => ({
      at: delay,
      x: width * (0.12 + Math.random() * 0.76),
      y: height * (0.12 + Math.random() * 0.5),
      color: COLORS[index % COLORS.length],
      fired: false,
    }));

    const spawnBurst = (burst: Burst) => {
      const count = 56 + Math.floor(Math.random() * 28);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.4 + 1.2;
        particles.push({
          x: burst.x,
          y: burst.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.008 + Math.random() * 0.012,
          color: burst.color,
          size: 1.4 + Math.random() * 1.8,
        });
      }

      // Éclat central plus lumineux.
      for (let i = 0; i < 14; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 0.4;
        particles.push({
          x: burst.x,
          y: burst.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          color: '#FFFFFF',
          size: 1 + Math.random() * 1.4,
        });
      }
    };

    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      const elapsed = now - start;
      const dt = Math.min(34, Math.max(8, now - last)) / 16.667;
      last = now;

      // Estompe l'image précédente tout en gardant le fond transparent.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, width, height);

      for (const burst of bursts) {
        if (!burst.fired && elapsed >= burst.at) {
          burst.fired = true;
          spawnBurst(burst);
        }
      }

      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.vy += 0.038 * dt;
        particle.vx *= Math.pow(0.985, dt);
        particle.vy *= Math.pow(0.985, dt);
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.alpha -= particle.decay * dt;

        if (particle.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, particle.alpha));
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[850]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
