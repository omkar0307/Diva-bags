import React from 'react';
import { motion } from 'framer-motion';
import { Bag } from '../types';
import { HelpCircle, Trash2, RotateCcw } from 'lucide-react';

interface DislikeReviewScreenProps {
  dislikedBags: Bag[];
  onConfirmElimination: () => void;
  onReconsider: () => void;
  loading?: boolean;
}

export const DislikeReviewScreen: React.FC<DislikeReviewScreenProps> = ({
  dislikedBags,
  onConfirmElimination,
  onReconsider,
  loading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[92vh] flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto"
    >
      {/* Top Header */}
      <div className="w-full text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/60 text-xs font-bold text-rose-600 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Quick Sanity Check</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']">
          Waittt... are you sure about these? 👀
        </h2>

        <p className="text-xs sm:text-sm text-pink-600/80 font-medium">
          These cuties are on the verge of being eliminated forever!
        </p>
      </div>

      {/* Disliked Bags Horizontal / Grid Scroll */}
      <div className="w-full my-auto py-4">
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-2 snap-x snap-mandatory scrollbar-none">
          {dislikedBags.map((bag) => (
            <motion.div
              key={bag.id}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-36 glass-card rounded-2xl p-2.5 flex flex-col items-center gap-2 snap-center border border-rose-200/50 shadow-md"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden bg-pink-50 relative">
                <img
                  src={bag.image_url}
                  alt={bag.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500/80 backdrop-blur-sm flex items-center justify-center text-white text-[10px]">
                  ❌
                </div>
              </div>
              <p className="text-xs font-bold text-center text-[#4A2040] line-clamp-1">
                {bag.name}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-[11px] text-pink-400 font-medium">
          {dislikedBags.length} bag{dislikedBags.length === 1 ? '' : 's'} scheduled for elimination
        </p>
      </div>

      {/* Action Decision Buttons */}
      <div className="w-full space-y-3 pb-2">
        {/* Eliminate button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirmElimination}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-base shadow-lg shadow-rose-300/40 flex items-center justify-center gap-2 border border-rose-400/40"
        >
          <Trash2 className="w-4 h-4" />
          <span>YEAHHH 😭 (eliminate them)</span>
        </motion.button>

        {/* Reconsider button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReconsider}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-white/90 border border-pink-200 text-pink-600 font-bold text-base shadow-sm flex items-center justify-center gap-2 hover:bg-pink-50/50"
        >
          <RotateCcw className="w-4 h-4 text-pink-500" />
          <span>NOOO WAITT (let me reconsider)</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
