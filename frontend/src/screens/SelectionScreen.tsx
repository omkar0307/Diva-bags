import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bag } from '../types';
import { PhaseIndicator } from '../components/PhaseIndicator';
import { CardCarousel } from '../components/CardCarousel';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SelectionScreenProps {
  phaseNumber: number;
  candidateBags: Bag[];
  currentIndex: number;
  totalCandidates: number;
  decisions: Record<string, 'liked' | 'disliked'>;
  onIndexChange: (newIndex: number) => void;
  onLike: (bagId: string) => void;
  onDislike: (bagId: string) => void;
  onProceedToReview: () => void;
  isSubmitting?: boolean;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({
  phaseNumber,
  candidateBags,
  currentIndex,
  totalCandidates,
  decisions,
  onIndexChange,
  onLike,
  onDislike,
  onProceedToReview,
  isSubmitting = false,
}) => {
  const decidedCount = candidateBags.filter((b) => decisions[b.id]).length;
  const allDecided = decidedCount === totalCandidates && totalCandidates > 0;
  const dislikedCount = candidateBags.filter((b) => decisions[b.id] === 'disliked').length;

  return (
    <div className="w-full min-h-[92vh] flex flex-col justify-between items-center py-3 px-2 max-w-md mx-auto">
      {/* 1. Phase Progress Indicator */}
      <div className="w-full pt-1">
        <PhaseIndicator
          phaseNumber={phaseNumber}
          totalCandidates={totalCandidates}
          currentIndex={currentIndex}
        />
      </div>

      {/* 2. 3D Swipeable Card Stack / Cover Flow Carousel */}
      <div className="w-full my-auto flex items-center justify-center">
        <CardCarousel
          bags={candidateBags}
          currentIndex={currentIndex}
          onIndexChange={onIndexChange}
          decisions={decisions}
          onLike={onLike}
          onDislike={onDislike}
        />
      </div>

      {/* 3. Bottom Status & Reversibility Action Bar */}
      <div className="w-full flex flex-col items-center pb-2 px-4">
        <AnimatePresence mode="wait">
          {allDecided ? (
            <motion.button
              key="proceed-btn"
              type="button"
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onProceedToReview}
              disabled={isSubmitting}
              className="w-full max-w-xs py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-300/60 flex items-center justify-center gap-2 border border-pink-300/40 cursor-pointer animate-pulse"
            >
              <Sparkles className="w-4 h-4 fill-yellow-200 text-yellow-200" />
              <span>
                {dislikedCount > 0
                  ? `Review Dislikes (${dislikedCount}) 👀`
                  : 'All Liked! Proceed 💖'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          ) : (
            <motion.div
              key="status-pill"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-semibold text-pink-600 glass-pill px-4 py-2 rounded-full shadow-sm"
            >
              <span>
                ✨ {decidedCount} of {totalCandidates} decided
              </span>
              <span className="text-pink-300">•</span>
              <span className="text-pink-500/80">slide cards to browse & re-choose</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
