import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bag } from '../types';
import { triggerConfetti } from '../components/ConfettiEffect';
import { Sparkles, Heart, Crown } from 'lucide-react';

interface FinalSelectionScreenProps {
  finalBag: Bag;
  onProceed: () => void;
}

export const FinalSelectionScreen: React.FC<FinalSelectionScreenProps> = ({
  finalBag,
  onProceed,
}) => {
  useEffect(() => {
    triggerConfetti();
    const timer = setTimeout(() => triggerConfetti(), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-[92vh] flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto text-center"
    >
      {/* Crown Pill Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50/70 border border-amber-200/70 shadow-sm"
      >
        <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
        <span>THE ULTIMATE WINNER</span>
      </motion.div>

      {/* Main Announcement & Winner Card */}
      <div className="w-full my-auto flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']">
            OKAYYYY DIVAAA 😭💕
          </h1>
          <p className="text-lg font-bold text-pink-600 tracking-wider">
            WE FOUND THE ONE.
          </p>
        </motion.div>

        {/* Final Bag Card with Glowing Crown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="relative w-full max-w-[300px] aspect-[4/5] glass-card rounded-[32px] p-4 flex flex-col justify-between shadow-2xl border-2 border-pink-300/80 overflow-hidden"
        >
          {/* Confetti & Glow Aura */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Floating Crown Badge */}
          <div className="absolute top-6 left-6 z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-white">
            <Crown className="w-5 h-5 text-white fill-white" />
          </div>

          <div className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-lg border-2 border-white">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          {/* Bag Image */}
          <div className="w-full h-[76%] rounded-[24px] overflow-hidden bg-white relative shadow-inner border border-pink-100 flex items-center justify-center">
            <img
              src={finalBag.image_url}
              alt={finalBag.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bag Name */}
          <div className="w-full pt-2 pb-1 text-center">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#4A2040]">
              {finalBag.name}
            </h3>
          </div>
        </motion.div>

        {/* Humorous drama king quote box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="w-full max-w-sm glass-pill p-4 rounded-2xl text-xs sm:text-sm text-pink-900/90 font-medium leading-relaxed border border-pink-200/70 mb-2 sm:mb-4 shadow-sm"
        >
          <p>
            okayy divaaa, i'm gonna send this to ur drama king that you liked and gonna threaten— i mean ask him nicely to get this for u 🤭
          </p>
          <p className="mt-1.5 font-bold text-pink-600">
            because you DESERVE THISS haha 💕
          </p>
        </motion.div>
      </div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full max-w-xs mt-6 sm:mt-8 pb-4"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={onProceed}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-extrabold text-lg shadow-xl shadow-pink-300/60 border border-pink-400/40 flex items-center justify-center gap-2"
        >
          <span>YEAHHHHH 😭</span>
          <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
