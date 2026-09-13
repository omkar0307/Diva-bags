import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  loading?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, loading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-[85vh] flex flex-col justify-between items-center px-6 py-10 max-w-md mx-auto text-center"
    >
      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-pink-600 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-pink-300" />
        <span>A VIP experience made just for you</span>
      </motion.div>

      {/* Center Hero */}
      <div className="my-auto flex flex-col items-center gap-6">
        {/* Animated Icon Avatar */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-100 flex items-center justify-center shadow-xl shadow-pink-200/50 border-2 border-white relative"
        >
          <span className="text-5xl select-none">👜</span>
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-md"
          >
            <Heart className="w-4 h-4 fill-white" />
          </motion.div>
        </motion.div>

        {/* Headings */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl sm:text-4xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']"
          >
            Heyyyy Divaaaa 🥹
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base sm:text-lg text-pink-700/80 font-medium max-w-[280px] mx-auto leading-relaxed"
          >
            ready to glow up with shoulder bags? ✨
          </motion.p>
        </div>
      </div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-xs"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.94, y: 2 }}
          onClick={onStart}
          disabled={loading}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-[length:200%_auto] hover:bg-right shadow-xl shadow-pink-300/60 border border-pink-400/40 text-white font-extrabold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              <span>YEAHHHHH 😭</span>
              <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200" />
            </>
          )}
        </motion.button>
        <p className="text-[11px] text-pink-400 font-medium mt-3">
          (No "No" button allowed, obviously 💅)
        </p>
      </motion.div>
    </motion.div>
  );
};
