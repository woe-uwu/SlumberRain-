import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { RainType, ThemeConfig } from '../types';
import { THEMES } from '../theme/themes';

interface SoundscapeVisualizerProps {
  isPlaying: boolean;
  rainType: RainType;
  theme?: ThemeConfig;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const SoundscapeVisualizer: React.FC<SoundscapeVisualizerProps> = ({
  isPlaying,
  rainType,
  theme = THEMES.amber,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastDropTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 180);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Subtle dim gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(28, 30, 36, 0.4)');
      grad.addColorStop(1, 'rgba(24, 26, 31, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const energy = isPlaying ? soundEngine.getEnergy() : 0;

      // Spawn periodic gentle ripples if playing
      const dropInterval =
        rainType === 'heavy-downpour' ? 140 : rainType === 'light-drizzle' ? 450 : 260;
      if (isPlaying && time - lastDropTime.current > dropInterval) {
        lastDropTime.current = time;
        const count = rainType === 'heavy-downpour' ? 2 : 1;
        for (let i = 0; i < count; i++) {
          ripplesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 2,
            maxRadius: 35 + Math.random() * 45 + energy * 30,
            alpha: 0.35 + energy * 0.3,
            speed: 0.6 + Math.random() * 0.4,
          });
        }
      }

      // Update and draw ripples in soothing dim slate / current theme accent
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha -= 0.005;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = theme.glowRgba.replace('0.35', (r.alpha * 0.28).toFixed(3));
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner micro echo ring
        if (r.radius > 12) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(142, 149, 165, ${r.alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Subtle horizontal rainfall acoustic wave in center
      ctx.beginPath();
      const waveY = height * 0.75;
      ctx.moveTo(0, waveY);
      for (let x = 0; x < width; x += 8) {
        const freqOffset = x * 0.015 + time * 0.001;
        const amp = isPlaying ? 3 + energy * 12 : 1;
        const y = waveY + Math.sin(freqOffset) * amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isPlaying
        ? theme.glowRgba.replace('0.35', '0.22')
        : 'rgba(70, 75, 88, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, rainType, theme]);

  return (
    <div className="relative w-full h-32 md:h-36 rounded-2xl overflow-hidden border border-[#343844] shadow-inner bg-[#1a1c22]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] font-medium text-[#8e95a5] uppercase tracking-wider">
          Acoustic Resonance Field
        </span>
        <span className="text-[10px] text-[#636979]">
          · {isPlaying ? 'Active Soundscape' : 'Paused'}
        </span>
      </div>
      <div className="absolute bottom-3 right-4 text-[11px] text-[#717787] pointer-events-none font-mono">
        {isPlaying ? 'Continuous Procedural Synthesis' : 'Standby'}
      </div>
    </div>
  );
};
