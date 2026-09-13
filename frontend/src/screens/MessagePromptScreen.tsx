import React from 'react';
import { motion } from 'framer-motion';
import { DodgeButton } from '../components/DodgeButton';
import { Heart, Sparkles, MessageCircleHeart } from 'lucide-react';

interface MessagePromptScreenProps {
  onYes: () => void;
}

export const MessagePromptScreen: React.FC<MessagePromptScreenProps> = ({ onYes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[85vh] flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto text-center"
    >
      {/* Top Tag */}
      <div className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-pink-600 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>Step 2: The Direct Order</span>
      </div>

      {/* Center Prompt */}
      <div className="my-auto flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-100 flex items-center justify-center shadow-xl shadow-pink-200/50 border-2 border-white text-5xl"
        >
          <MessageCircleHeart className="w-12 h-12 text-pink-500 stroke-[1.8]" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2040] tracking-tight font-['Outfit']">
            would u want to send a message to him? 🥹
          </h2>
          <p className="text-xs sm:text-sm text-pink-600 font-medium">
            (tell him what's up or drop a cute hint 😉)
          </p>
        </div>
      </div>

      {/* Buttons Container */}
      <div className="w-full flex flex-col items-center gap-4 pb-4">
        {/* Playful Yes button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={onYes}
          className="w-full max-w-xs py-4 px-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-base shadow-xl shadow-pink-300/50 flex items-center justify-center gap-2 border border-pink-300/40"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>YEAHHH 🥹</span>
        </motion.button>

        {/* Playful Dodge Button */}
        <div className="relative w-full max-w-xs h-12 flex items-center justify-center">
          <DodgeButton />
        </div>
      </div>
    </motion.div>
  );
};
