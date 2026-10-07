import { useEffect, useRef, useState } from 'react';

interface Asic3DProps {
  size?: number;
  className?: string;
}

export function Asic3DMiner({ size = 200, className = '' }: Asic3DProps) {
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let raf: number;
    let current = 0;
    const animate = () => {
      current += 0.3;
      setRotation(current);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, perspective: '800px' }}
    >
      <div
        className="relative w-full h-full preserve-3d transition-transform"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(-12deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(160deg, #232938, #161a23)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(247,179,43,0.15)',
            transform: 'translateZ(50px)',
          }}
        >
          {/* Vents */}
          <div className="absolute top-3 left-3 right-3 grid grid-cols-12 gap-0.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="h-0.5 bg-ink-950/60 rounded-full" />
            ))}
          </div>
          {/* Screen */}
          <div className="absolute top-12 left-4 right-4 h-20 rounded-lg bg-ink-950/80 flex flex-col items-center justify-center gap-1">
            <div className="text-gold-400 font-mono text-xs tracking-wider">ANTMINER</div>
            <div className="text-gold-300 font-mono text-2xl font-bold">S21</div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-blink" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-blink" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-blink" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
          {/* Status LED */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" style={{ boxShadow: '0 0 8px #10b981' }} />
            <span className="text-2xs font-mono text-success-400">ONLINE</span>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(160deg, #1c2130, #11141b)',
            transform: 'translateZ(-50px) rotateY(180deg)',
          }}
        >
          <div className="absolute top-4 left-4 right-4 bottom-4 rounded-lg bg-ink-950/60 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded bg-ink-700 border border-ink-600" />
              ))}
            </div>
          </div>
        </div>

        {/* Top face */}
        <div
          className="absolute inset-x-0 top-0 h-24 rounded-t-xl"
          style={{
            background: 'linear-gradient(180deg, #2d3548, #232938)',
            transform: 'rotateX(90deg) translateZ(50px) translateY(-24px)',
            transformOrigin: 'top',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full border-2 border-ink-600 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-ink-800 animate-spin-slow" style={{ backgroundImage: 'repeating-conic-gradient(#1c2130 0deg 30deg, #232938 30deg 60deg)' }} />
            </div>
          </div>
        </div>

        {/* Bottom face */}
        <div
          className="absolute inset-x-0 bottom-0 h-12 rounded-b-xl"
          style={{
            background: '#0d0f14',
            transform: 'rotateX(-90deg) translateZ(50px)',
            transformOrigin: 'bottom',
          }}
        >
          <div className="flex items-center justify-center h-full gap-2">
            <div className="w-8 h-1 rounded-full bg-ink-700" />
            <div className="w-8 h-1 rounded-full bg-ink-700" />
          </div>
        </div>

        {/* Left face */}
        <div
          className="absolute left-0 inset-y-0 w-24 rounded-l-xl"
          style={{
            background: 'linear-gradient(90deg, #11141b, #161a23)',
            transform: 'rotateY(-90deg) translateZ(50px)',
            transformOrigin: 'left',
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3 pt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-10 h-0.5 bg-ink-700 rounded" />
            ))}
          </div>
        </div>

        {/* Right face */}
        <div
          className="absolute right-0 inset-y-0 w-24 rounded-r-xl"
          style={{
            background: 'linear-gradient(-90deg, #11141b, #161a23)',
            transform: 'rotateY(90deg) translateZ(50px)',
            transformOrigin: 'right',
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3 pt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-10 h-0.5 bg-ink-700 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Glow underneath */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -10,
          width: '80%',
          height: 20,
          background: 'radial-gradient(ellipse, rgba(247,179,43,0.2), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Floating particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold-400/40 animate-float"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${5 + i}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrbitingMinersProps {
  className?: string;
}

export function OrbitingMiners({ className = '' }: OrbitingMinersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let raf: number;
    let current = 0;
    const animate = () => {
      current += 0.2;
      setRotation(current);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const orbits = [
    { radius: 90, speed: 1, count: 3, size: 24 },
    { radius: 150, speed: -0.7, count: 4, size: 18 },
    { radius: 210, speed: 0.5, count: 5, size: 14 },
  ];

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center ${className}`}>
      {/* Center */}
      <div className="absolute z-10">
        <div className="w-20 h-20 rounded-2xl clay-gold flex items-center justify-center animate-pulse-glow">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-ink-950" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8 12 11.5 4.5 8 12 4.5z" />
          </svg>
        </div>
      </div>

      {/* Orbit rings */}
      <div className="absolute w-[180px] h-[180px] rounded-full border border-ink-700/40" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-ink-700/30" />
      <div className="absolute w-[420px] h-[420px] rounded-full border border-ink-700/20" />

      {/* Orbiting miners */}
      {orbits.map((orbit, oi) =>
        Array.from({ length: orbit.count }).map((_, i) => {
          const angle = (rotation * orbit.speed * 0.01) + (i * (360 / orbit.count)) * (Math.PI / 180);
          const x = Math.cos(angle) * orbit.radius;
          const y = Math.sin(angle) * orbit.radius;
          return (
            <div
              key={`orbit-${oi}-${i}`}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'none',
              }}
            >
              <div
                className="rounded-lg"
                style={{
                  width: orbit.size,
                  height: orbit.size,
                  background: 'linear-gradient(145deg, #232938, #161a23)',
                  boxShadow: '2px 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 10px rgba(247,179,43,0.1)',
                }}
              >
                <div className="w-full h-full rounded-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-blink" />
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Connecting lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        {orbits.map((orbit, oi) =>
          Array.from({ length: orbit.count }).map((_, i) => {
            const angle = (rotation * orbit.speed * 0.01) + (i * (360 / orbit.count)) * (Math.PI / 180);
            const x = Math.cos(angle) * orbit.radius;
            const y = Math.sin(angle) * orbit.radius;
            return (
              <line
                key={`line-${oi}-${i}`}
                x1="0" y1="0" x2={x} y2={y}
                stroke="rgba(247,179,43,0.08)"
                strokeWidth="1"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

interface HashrateVisualizationProps {
  active?: boolean;
  className?: string;
}

export function HashrateVisualization({ active = true, className = '' }: HashrateVisualizationProps) {
  const [bars, setBars] = useState<number[]>(Array.from({ length: 40 }, () => Math.random() * 0.6 + 0.2));

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBars(prev => [...prev.slice(1), Math.random() * 0.7 + 0.3]);
    }, 200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className={`flex items-end gap-0.5 h-16 ${className}`}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-200"
          style={{
            height: `${h * 100}%`,
            background: `linear-gradient(to top, rgba(247,179,43,${0.2 + h * 0.5}), rgba(247,179,43,${0.5 + h * 0.5}))`,
          }}
        />
      ))}
    </div>
  );
}
