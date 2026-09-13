import React from 'react';
import { motion } from 'framer-motion';

interface PhaseIndicatorProps {
  phaseNumber: number;
  totalCandidates: number;
  currentIndex: number;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  phaseNumber,
  totalCandidates,
  currentIndex,
}) => {
  const getPhaseTitle = (num: number) => {
    switch (num) {
      case 1:
        return 'Round 1 ✨ The First Impressions';
      case 2:
        return 'Round 2 💕 Getting Closer';
      case 3:
        return 'Round 3 💅 The Serious Contenders';
      case 4:
        return 'Round 4 👑 Almost Crowned';
      default:
        return `Round ${num} 💖 Perfection Round`;
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((currentIndex) / Math.max(1, totalCandidates)) * 100)
  );

  return (
    <div className="w-full max-w-sm mx-auto px-4 flex flex-col items-center gap-2">
      {/* Round pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-pink-700 shadow-sm border border-pink-100"
      >
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        <span>{getPhaseTitle(phaseNumber)}</span>
      </motion.div>

      {/* Progress pill & counter */}
      <div className="w-full flex items-center justify-between text-[11px] font-medium text-pink-500/80 px-1">
        <span>Bag {Math.min(currentIndex + 1, totalCandidates)} of {totalCandidates}</span>
        <span>{progressPercent}% reviewed</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-pink-100/70 rounded-full overflow-hidden p-[1px]">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
