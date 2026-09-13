import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

interface EmptySelectionScreenProps {
  onRestart: () => void;
  loading?: boolean;
}

export const EmptySelectionScreen: React.FC<EmptySelectionScreenProps> = ({
  onRestart,
  loading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-[92vh] flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto text-center relative"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 -left-10 w-44 h-44 bg-pink-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-24 -right-10 w-44 h-44 bg-rose-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50/80 border border-rose-200/70 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-300" />
        <span>ZERO BAGS SURVIVED</span>
        <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-300" />
      </motion.div>

      {/* Main Comfort Card */}
      <div className="w-full my-auto flex flex-col items-center gap-4 py-2">
        {/* Animated Comfort Avatar */}
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
          className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 flex items-center justify-center shadow-xl shadow-rose-200/50 border-2 border-white text-5xl"
        >
          <span>🥺</span>
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm shadow-md border border-white"
          >
            💅
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']">
            Awwww Divaaa 😭💕
          </h1>
          <p className="text-sm font-bold text-rose-500">
            I'm really sorry on behalf of this useless prince 🤦‍♂️
          </p>
        </motion.div>

        {/* Humorous drama comfort message box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full glass-card p-5 rounded-[28px] text-xs sm:text-sm text-[#4A2040] font-medium leading-relaxed border border-pink-200/80 shadow-xl shadow-pink-100/50 space-y-3 text-left"
        >
          <p className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">🙅‍♀️</span>
            <span>
              I'll make sure he knows just how WRONG he was for choosing these bags...
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">😤</span>
            <span>
              because apparently none of them were worthy of you 😤🎀
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">🤨</span>
            <span>
              I'll be sure to notify him that his bag selection skills are officially under investigation 🤨💅
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">👀</span>
            <span>
              Because how dare he give Divaaa options that she doesn't even like 😤
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">🤭</span>
            <span>
              Clearly, we need to have a serious conversation with this man 🤭💕
            </span>
          </p>

          <div className="pt-2 border-t border-pink-100/80 text-center">
            <p className="font-extrabold text-sm sm:text-base text-pink-600 font-['Outfit']">
              You deserve better bags, Diva. ALWAYS. 💅💕
            </p>
          </div>
        </motion.div>
      </div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-xs pb-2"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={onRestart}
          disabled={loading}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-pink-300/60 border border-pink-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Heart className="w-4 h-4 fill-white flex-shrink-0" />
              <span>okay, tell that idiot 😭</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
