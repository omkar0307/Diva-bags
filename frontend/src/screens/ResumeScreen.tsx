import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface ResumeScreenProps {
  phaseNumber: number;
  bagIndex: number;
  onResume: () => void;
  onRestart?: () => void;
}

export const ResumeScreen: React.FC<ResumeScreenProps> = ({
  phaseNumber,
  bagIndex,
  onResume,
  onRestart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[85vh] flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto text-center"
    >
      {/* Top Tag */}
      <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>Welcome Back Princess</span>
      </div>

      {/* Main Hero */}
      <div className="my-auto flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 flex items-center justify-center shadow-xl shadow-pink-200/50 border-2 border-white text-5xl"
        >
          <span>👀</span>
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']">
            Hey cutie u left me on seen 😭
          </h2>
          <p className="text-sm sm:text-base text-pink-700/80 font-medium max-w-xs mx-auto leading-relaxed">
            would u like to continue choosing your perfect bag?
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-xs font-bold text-pink-600">
            Paused at Round {phaseNumber || 1} • Bag {bagIndex + 1}
          </div>
        </div>
      </div>

      {/* Resume Buttons */}
      <div className="w-full space-y-3 pb-4 max-w-xs">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResume}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-lg shadow-xl shadow-pink-300/50 flex items-center justify-center gap-2 border border-pink-400/40"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>YEAHHH 🥹</span>
        </motion.button>

        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="w-full text-xs text-pink-400 hover:text-pink-600 font-medium py-1 transition-colors"
          >
            or start fresh from the beginning
          </button>
        )}
      </div>
    </motion.div>
  );
};
