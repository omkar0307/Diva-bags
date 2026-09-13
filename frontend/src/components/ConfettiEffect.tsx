import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FFB3C6', '#FF8FAB', '#FB7185', '#F472B6', '#FDE047', '#E8D5F5'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#FFB3C6', '#FF8FAB', '#FB7185', '#F472B6', '#FDE047', '#E8D5F5'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

export const ConfettiEffect: React.FC = () => {
  useEffect(() => {
    triggerConfetti();
  }, []);

  return null;
};
