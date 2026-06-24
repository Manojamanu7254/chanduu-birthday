import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface ConfettiRef {
  triggerBurst: (x: number, y: number, type?: 'confetti' | 'hearts' | 'stars', count?: number) => void;
  triggerRain: (durationMs?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'confetti' | 'heart' | 'star';
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
}

const COLORS = [
  "#FF69B4", "#FF1493", "#FFC0CB", // Pinks
  "#FFD700", "#FF8C00", "#FFA500", // Golds/Yellows
  "#DDA0DD", "#EE82EE", "#DA70D6", // Purples
  "#00FA9A", "#48D1CC", "#40E0D0", // Teals
  "#FF4500", "#FF6347"             // Reds
];

export const ConfettiEffect = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const rainingRef = useRef<boolean>(false);
  const rainTimerRef = useRef<number | null>(null);

  const createParticle = (x: number, y: number, type: 'confetti' | 'hearts' | 'stars'): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    const pType = type === 'hearts' ? 'heart' : type === 'stars' ? 'star' : 'confetti';
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward initial force
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      type: pType,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      gravity: 0.15,
      drag: 0.98
    };
  };

  const triggerBurst = (x: number, y: number, type: 'confetti' | 'hearts' | 'stars' = 'confetti', count = 40) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push(createParticle(x, y, type));
    }
    particlesRef.current.push(...newParticles);
  };

  const triggerRain = (durationMs = 3000) => {
    rainingRef.current = true;
    if (rainTimerRef.current) clearTimeout(rainTimerRef.current);
    
    rainTimerRef.current = window.setTimeout(() => {
      rainingRef.current = false;
    }, durationMs);
  };

  useImperativeHandle(ref, () => ({
    triggerBurst,
    triggerRain
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
      c.quadraticCurveTo(x, y + size * 2 / 3, x, y + size / 3);
      c.quadraticCurveTo(x, y, x, y + size / 4);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rain generator
      if (rainingRef.current && Math.random() < 0.3) {
        const rx = Math.random() * canvas.width;
        const ry = -20;
        const types: Array<'confetti' | 'hearts' | 'stars'> = ['confetti', 'hearts', 'stars'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const p = createParticle(rx, ry, chosenType);
        p.vy = Math.random() * 2 + 1; // gentle fall
        p.gravity = 0.08;
        particlesRef.current.push(p);
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        // Physics update
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > canvas.height + 20) {
          return false;
        }

        // Draw
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "heart") {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        } else if (p.type === "star") {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
        } else {
          // Default rectangular confetti
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        }

        ctx.restore();
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rainTimerRef.current) clearTimeout(rainTimerRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      id="confetti-canvas"
    />
  );
});

ConfettiEffect.displayName = "ConfettiEffect";
