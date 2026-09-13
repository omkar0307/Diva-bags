import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bag, BoyfriendMessage } from '../types';
import { triggerConfetti } from '../components/ConfettiEffect';
import { CheckCircle2, Heart, Sparkles, RotateCcw } from 'lucide-react';

interface CompletedScreenProps {
  finalBag: Bag;
  message: BoyfriendMessage | null;
  onStartOver: () => void;
  loading?: boolean;
}

export const CompletedScreen: React.FC<CompletedScreenProps> = ({
  finalBag,
  message,
  onStartOver,
  loading = false,
}) => {
  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-[92vh] flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto text-center"
    >
      {/* Top Status Pill */}
      <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-200/60 shadow-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>Bag successfully chosen 💕</span>
      </div>

      {/* Main Content Area */}
      <div className="w-full my-auto flex flex-col items-center gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2040] font-['Outfit'] leading-snug">
            Okayyyy cutiepie, i'm sure ur dumb boyfriend will like your message and will be sending him what u choose 🤭
          </h2>
        </div>

        {/* Selected Final Bag Card */}
        <div className="w-full max-w-[280px] glass-card rounded-3xl p-3.5 flex flex-col items-center shadow-xl border border-pink-200/80">
          <div className="w-full h-48 rounded-2xl overflow-hidden bg-pink-50 relative mb-2.5 shadow-inner">
            <img
              src={finalBag.image_url}
              alt={finalBag.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-base font-extrabold text-[#4A2040] text-center">{finalBag.name}</h3>
          <span className="text-[11px] font-semibold text-pink-500 mt-0.5">Your Official Winner 👑</span>
        </div>

        {/* User's Message Card */}
        {message && (
          <div className="w-full max-w-xs glass-pill rounded-2xl p-4 text-left border border-pink-200/70 shadow-sm relative">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 mb-1">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>Your message for him:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A2040] italic font-medium leading-relaxed">
              "{message.message_text}"
            </p>
          </div>
        )}

        {/* Mission Accomplished Banner */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/10 border border-pink-300/50 text-sm sm:text-base font-extrabold text-pink-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500 fill-pink-300" />
            <span>Mission accomplished, Diva. 💕</span>
          </div>
        </div>
      </div>

      {/* Temporary Development START OVER Button at the VERY END */}
      <div className="w-full pt-4 pb-2 flex flex-col items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartOver}
          disabled={loading}
          className="py-2.5 px-6 rounded-full bg-white/80 hover:bg-white text-pink-600 font-bold text-xs tracking-wider border border-pink-300/80 shadow-sm hover:shadow flex items-center gap-2 transition-all cursor-pointer opacity-85 hover:opacity-100"
          title="Reset the entire selection journey to test again"
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
              <span>START OVER 🔄</span>
            </>
          )}
        </motion.button>
        <span className="text-[10px] text-pink-400 font-medium">
          (Testing control: resets entire journey back to welcome)
        </span>
      </div>
    </motion.div>
  );
};
