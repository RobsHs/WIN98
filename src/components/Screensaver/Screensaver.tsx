import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export const Screensaver: React.FC = () => {
  const { settings } = useSettings();
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inactivity detection
  useEffect(() => {
    if (settings.screensaver === 'none') {
      setIsActive(false);
      return;
    }

    const resetTimer = () => {
      if (isActive) {
        setIsActive(false);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const timeoutMs = (settings.screensaverTimeoutMinutes || 5) * 60 * 1000;
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, timeoutMs);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousedown', resetTimer);

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
    };
  }, [settings.screensaver, settings.screensaverTimeoutMinutes, isActive]);

  // Screensaver animation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId: number;

    if (settings.screensaver === 'starfield') {
      const stars: { x: number; y: number; z: number }[] = [];
      const numStars = 400;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * canvas.width,
        });
      }

      const drawStars = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        stars.forEach((star) => {
          star.z -= 4;
          if (star.z <= 0) {
            star.z = canvas.width;
            star.x = (Math.random() - 0.5) * canvas.width * 2;
            star.y = (Math.random() - 0.5) * canvas.height * 2;
          }

          const k = 250 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            const size = Math.max(1, (1 - star.z / canvas.width) * 3);
            const brightness = Math.floor((1 - star.z / canvas.width) * 255);
            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
            ctx.fillRect(px, py, size, size);
          }
        });

        animId = requestAnimationFrame(drawStars);
      };
      drawStars();
    } else if (settings.screensaver === 'mystify') {
      const points = [
        { x: 100, y: 150, vx: 3, vy: 2 },
        { x: 250, y: 300, vx: -2, vy: 3 },
        { x: 400, y: 100, vx: 3, vy: -2 },
        { x: 300, y: 400, vx: -3, vy: -3 },
      ];
      let hue = 0;

      const drawMystify = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        points.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
          if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
        });

        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();

        hue = (hue + 1) % 360;
        animId = requestAnimationFrame(drawMystify);
      };
      drawMystify();
    } else if (settings.screensaver === '3dtext') {
      let textX = 100;
      let textY = 100;
      let vx = 3;
      let vy = 2;
      const text = 'Windows 98';

      const drawText = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        textX += vx;
        textY += vy;
        if (textX <= 20 || textX >= canvas.width - 240) vx *= -1;
        if (textY <= 50 || textY >= canvas.height - 40) vy *= -1;

        ctx.font = 'bold 36px "MS Sans Serif", sans-serif';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(text, textX + 4, textY + 4);
        ctx.fillStyle = '#000080';
        ctx.fillText(text, textX + 2, textY + 2);
        ctx.fillStyle = '#ffff00';
        ctx.fillText(text, textX, textY);

        animId = requestAnimationFrame(drawText);
      };
      drawText();
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isActive, settings.screensaver]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999999] cursor-none bg-black"
      onClick={() => setIsActive(false)}
    />
  );
};

