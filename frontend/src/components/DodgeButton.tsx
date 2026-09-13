import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Playful cartoon sound synthesis via Web Audio API
const playBoingSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);
    gain.setValueAtTime(0.25, now);
    gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // Audio context may be restricted by browser policy
  }
};

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export const DodgeButton: React.FC = () => {
  const [hasStartedTrolling, setHasStartedTrolling] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const initialPosRef = useRef<{ left: number; top: number } | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const lastTriggerRef = useRef(0);

  const funnyMessages = [
    'nice try diva 😂',
    "u can't say no 💅",
    'nopeee 🏃‍♀️💨',
    'why u pressing no?! 😤',
    'hehe catch me 🤪',
    'error 404: "no" not found 🚫',
    'u know u wanna send it 💕',
    'too slow babe 😏',
    'NEVERRR 🙅‍♀️',
    'literally impossible 😜',
    'just click YEAHHH already 🥹',
    'ahahaha try again 🤭',
    "u can't escape love 💘",
  ];

  const trollEmojis = ['💨', '💅', '🤪', '🏃‍♀️', '🤭', '🚫', '✨', '💖'];

  // Record initial resting position on mount
  useEffect(() => {
    if (buttonRef.current && !initialPosRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      initialPosRef.current = { left: rect.left, top: rect.top };
    }
  }, []);

  const getInitialPos = useCallback(() => {
    if (initialPosRef.current) return initialPosRef.current;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      initialPosRef.current = {
        left: rect.left - positionRef.current.x,
        top: rect.top - positionRef.current.y,
      };
      return initialPosRef.current;
    }
    return {
      left: window.innerWidth / 2 - 75,
      top: window.innerHeight * 0.75,
    };
  }, []);

  const handleTroll = useCallback(() => {
    const now = Date.now();
    // Debounce duplicate events within 120ms (e.g. pointerdown followed by click)
    if (now - lastTriggerRef.current < 120) return;
    lastTriggerRef.current = now;

    // Play cartoon boing sound
    playBoingSound();

    // Haptic feedback if available on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([30, 40, 40]);
      } catch {
        // Ignore haptics error
      }
    }

    const init = getInitialPos();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnW = buttonRef.current?.offsetWidth || 150;
    const btnH = buttonRef.current?.offsetHeight || 44;
    const margin = 20;

    // Safe boundaries within the visible viewport
    const minX = margin;
    const maxX = Math.max(margin, vw - margin - btnW);
    const minY = margin + 50;
    const maxY = Math.max(minY, vh - margin - btnH - 30);

    const currentAbsoluteX = init.left + positionRef.current.x;
    const currentAbsoluteY = init.top + positionRef.current.y;

    // Calculate a target guaranteed to be at least 180px away from the current position
    let targetX = currentAbsoluteX;
    let targetY = currentAbsoluteY;
    let attempts = 0;
    const minDistance = Math.min(200, Math.max(120, vw * 0.35));

    while (
      Math.hypot(targetX - currentAbsoluteX, targetY - currentAbsoluteY) < minDistance &&
      attempts < 25
    ) {
      targetX = minX + Math.random() * (maxX - minX);
      targetY = minY + Math.random() * (maxY - minY);
      attempts++;
    }

    // Fallback jump if screen is very compact
    if (Math.hypot(targetX - currentAbsoluteX, targetY - currentAbsoluteY) < 100) {
      targetX = currentAbsoluteX > vw / 2 ? minX + 20 : maxX - 20;
      targetY = currentAbsoluteY > vh / 2 ? minY + 30 : maxY - 30;
    }

    const deltaX = targetX - init.left;
    const deltaY = targetY - init.top;

    // Update synchronous ref and state
    positionRef.current = { x: deltaX, y: deltaY };
    setPosition({ x: deltaX, y: deltaY });
    setHasStartedTrolling(true);
    setDodgeCount((prev) => prev + 1);

    // Random dynamic tilt and pop scale
    const randomAngle = (Math.random() - 0.5) * 28;
    setRotation(randomAngle);
    setScale(1.15);
    setTimeout(() => setScale(1), 200);

    // Spawn floating troll particle
    const randomEmoji = trollEmojis[Math.floor(Math.random() * trollEmojis.length)];
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      emoji: randomEmoji,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
    };
    setParticles((prev) => [...prev.slice(-4), newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 900);
  }, [getInitialPos]);

  // Current display text: starts with "eww noo 🥺", then cycles troll quotes on press
  const label = !hasStartedTrolling
    ? 'eww noo 🥺'
    : funnyMessages[(dodgeCount - 1) % funnyMessages.length];

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.button
        ref={buttonRef}
        type="button"
        animate={{
          x: position.x,
          y: position.y,
          rotate: rotation,
          scale: scale,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 24,
          mass: 0.6,
        }}
        whileHover={{ scale: 1.05 }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleTroll();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleTroll();
        }}
        className={`relative z-30 py-3 px-6 rounded-full border font-semibold text-sm shadow-md transition-colors cursor-pointer select-none whitespace-nowrap active:scale-95 ${
          hasStartedTrolling
            ? 'bg-rose-50/95 border-rose-300 text-rose-600 shadow-rose-200/50 hover:bg-rose-100 hover:border-rose-400'
            : 'bg-white/85 backdrop-blur-md border-pink-200/80 text-gray-500 hover:border-pink-300 hover:text-pink-600 hover:bg-white'
        }`}
        aria-label="Playful button that starts trolling when pressed"
      >
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 3, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="inline-block"
        >
          {label}
        </motion.span>
      </motion.button>

      {/* Floating Troll Reaction Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, x: position.x + p.x, y: position.y + p.y }}
            animate={{
              opacity: 0,
              scale: 1.4,
              x: position.x + p.x + (Math.random() - 0.5) * 40,
              y: position.y + p.y - 65,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute pointer-events-none text-2xl z-40"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
