
import React, { useEffect, useRef } from 'react';

interface CelebrationEffectProps {
  color: string;
  active: boolean;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ color, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: { x: number; y: number; vx: number; vy: number; length: number; alpha: number }[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 15;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 20 + Math.random() * 100,
        alpha: 1
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      if (elapsed > 1500) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - (elapsed / 1500));

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = p.alpha * 0.4; // Max opacity 40% per PRD
        ctx.lineWidth = 2;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.stroke();
      });

      // Ripple effect
      const rippleSize = (elapsed / 1500) * Math.max(canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(centerX, centerY, rippleSize, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = (1 - (elapsed / 1500)) * 0.2;
      ctx.lineWidth = 3;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [active, color]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ opacity: 0.8 }}
    />
  );
};

export default CelebrationEffect;
