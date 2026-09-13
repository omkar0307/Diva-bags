import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
  const messages = [
    'preparing the bag magic ✨',
    'finding your perfect matches... 💅',
    'okayyy diva, let’s go 💖',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Glowing pulsing bag icon */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-md shadow-xl shadow-pink-200/60 border border-pink-200 flex items-center justify-center text-5xl mb-8 relative"
      >
        <span>👜</span>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-pink-400"
        />
      </motion.div>

      {/* Cycling cute messages */}
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base sm:text-lg font-bold text-pink-700 tracking-wide font-['Outfit']"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 mt-4">
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
      </div>
    </div>
  );
};
