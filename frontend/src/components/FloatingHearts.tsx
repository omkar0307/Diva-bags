import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color?: string;
}

export const FloatingHearts: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    // Inspired by reference image: soft plus symbols (+), hearts, sparkles, stars, dots
    const items = [
      { s: '✦', c: '#FFAEC0' },
      { s: '+', c: '#FF7597' },
      { s: '💖', c: undefined },
      { s: '+', c: '#F472B6' },
      { s: '✨', c: undefined },
      { s: '•', c: '#FFB6C1' },
      { s: '💕', c: undefined },
      { s: '+', c: '#FB7185' },
      { s: '🌸', c: undefined },
      { s: '✦', c: '#F43F5E' },
      { s: '🤍', c: undefined },
      { s: '+', c: '#FDA4AF' },
    ];

    return Array.from({ length: 22 }).map((_, i) => {
      const item = items[i % items.length];
      return {
        id: i,
        symbol: item.s,
        color: item.c,
        x: Math.random() * 96 + 2,
        y: Math.random() * 96 + 2,
        size: item.s === '+' || item.s === '✦' || item.s === '•' ? Math.random() * 10 + 12 : Math.random() * 12 + 14,
        duration: Math.random() * 6 + 8,
        delay: Math.random() * 5,
        opacity: item.s === '+' ? Math.random() * 0.35 + 0.25 : Math.random() * 0.3 + 0.15,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none font-bold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: ['0px', '-28px', '0px'],
            x: ['0px', `${(p.id % 2 === 0 ? 1 : -1) * 12}px`, '0px'],
            rotate: [0, p.id % 2 === 0 ? 15 : -15, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
