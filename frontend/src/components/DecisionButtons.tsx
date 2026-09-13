import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';

interface DecisionButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
}

export const DecisionButtons: React.FC<DecisionButtonsProps> = ({
  onLike,
  onDislike,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-[340px] mx-auto flex items-center justify-center gap-5 px-4 pt-2">
      {/* DISLIKE BUTTON */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92, y: 2 }}
        whileHover={{ scale: 1.03, y: -2 }}
        onClick={onDislike}
        disabled={disabled}
        className="flex-1 py-3.5 px-4 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/90 shadow-md shadow-rose-100/50 flex items-center justify-center gap-2 text-rose-500 font-bold text-sm sm:text-base tracking-wide transition-colors hover:bg-rose-50/80 active:bg-rose-100/80 disabled:opacity-50 disabled:pointer-events-none"
      >
        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
        </div>
        <span>DISLIKE</span>
      </motion.button>

      {/* LIKE BUTTON */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92, y: 2 }}
        whileHover={{ scale: 1.03, y: -2 }}
        onClick={onLike}
        disabled={disabled}
        className="flex-1 py-3.5 px-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-[length:200%_auto] hover:bg-right shadow-lg shadow-pink-300/40 border border-pink-400/30 flex items-center justify-center gap-2 text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-white fill-white stroke-[2]" />
        </div>
        <span>LIKE</span>
      </motion.button>
    </div>
  );
};
