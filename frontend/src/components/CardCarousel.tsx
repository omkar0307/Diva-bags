import React, { useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Bag } from '../types';
import { BagCard } from './BagCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardCarouselProps {
  bags: Bag[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  decisions: Record<string, 'liked' | 'disliked'>;
  onLike: (bagId: string) => void;
  onDislike: (bagId: string) => void;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  bags,
  currentIndex,
  onIndexChange,
  decisions,
  onLike,
  onDislike,
}) => {
  const dragX = useMotionValue(0);

  const handleNext = useCallback(() => {
    if (currentIndex < bags.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, bags.length, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  // Handle keyboard arrows for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 40;
    const velocityThreshold = 250;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  if (!bags || bags.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none overflow-hidden px-2 py-2">
      {/* 3D Perspective Card Stage */}
      <div
        className="relative w-full h-[530px] flex items-center justify-center"
        style={{ perspective: '1100px' }}
      >
        {bags.map((bag, i) => {
          const diff = i - currentIndex;
          // Only render cards within 2 steps for silky 60fps performance
          if (Math.abs(diff) > 2) return null;

          const isCurrent = diff === 0;
          const isNext = diff === 1;
          const isPrev = diff === -1;
          const isFarNext = diff === 2;
          const isFarPrev = diff === -2;

          // 3D cover flow positions matching reference image
          let xOffset = 0;
          let scale = 1;
          let rotateY = 0;
          let zIndex = 20;
          let opacity = 1;

          if (isPrev) {
            xOffset = -220;
            scale = 0.84;
            rotateY = 16;
            zIndex = 10;
            opacity = 0.65;
          } else if (isNext) {
            xOffset = 220;
            scale = 0.84;
            rotateY = -16;
            zIndex = 10;
            opacity = 0.65;
          } else if (isFarPrev) {
            xOffset = -330;
            scale = 0.72;
            rotateY = 24;
            zIndex = 5;
            opacity = 0.25;
          } else if (isFarNext) {
            xOffset = 330;
            scale = 0.72;
            rotateY = -24;
            zIndex = 5;
            opacity = 0.25;
          }

          return (
            <motion.div
              key={bag.id}
              className="absolute w-full max-w-[340px] flex items-center justify-center cursor-pointer"
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                x: xOffset,
                scale,
                rotateY,
                opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
                mass: 0.8,
              }}
              onClick={() => {
                if (!isCurrent) {
                  onIndexChange(i);
                }
              }}
              {...(isCurrent
                ? {
                    drag: 'x',
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.45,
                    onDragEnd: handleDragEnd,
                  }
                : {})}
            >
              <BagCard
                bag={bag}
                index={i}
                totalCandidates={bags.length}
                decision={decisions[bag.id]}
                onLike={() => onLike(bag.id)}
                onDislike={() => onDislike(bag.id)}
                isCurrent={isCurrent}
              />
            </motion.div>
          );
        })}

        {/* Left Navigation Chevron Button */}
        {currentIndex > 0 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-1 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-lg shadow-pink-200/50 flex items-center justify-center text-pink-600 cursor-pointer"
            aria-label="Previous bag card"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}

        {/* Right Navigation Chevron Button */}
        {currentIndex < bags.length - 1 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-1 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-lg shadow-pink-200/50 flex items-center justify-center text-pink-600 cursor-pointer"
            aria-label="Next bag card"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </div>

      {/* Mini Dot & Progress Strip for Quick Re-selection */}
      <div className="w-full max-w-xs mt-3 flex items-center justify-center gap-1.5 px-2 py-1.5 overflow-x-auto no-scrollbar">
        {bags.map((bag, i) => {
          const dec = decisions[bag.id];
          const isCur = i === currentIndex;

          return (
            <button
              key={bag.id}
              type="button"
              onClick={() => onIndexChange(i)}
              className={`transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer ${
                isCur
                  ? 'w-6 h-2.5 bg-pink-500 shadow-sm shadow-pink-300'
                  : dec === 'liked'
                  ? 'w-2.5 h-2.5 bg-pink-300 hover:bg-pink-400'
                  : dec === 'disliked'
                  ? 'w-2.5 h-2.5 bg-rose-300 hover:bg-rose-400'
                  : 'w-2 h-2 bg-pink-100/90 hover:bg-pink-200'
              }`}
              title={`Bag #${i + 1}${dec ? ` (${dec})` : ''}`}
              aria-label={`Jump to bag ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
