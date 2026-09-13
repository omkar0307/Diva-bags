import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart, Sparkles } from 'lucide-react';

interface MessageScreenProps {
  onSend: (text: string) => void;
  loading?: boolean;
}

export const MessageScreen: React.FC<MessageScreenProps> = ({ onSend, loading = false }) => {
  const [text, setText] = useState('');
  const maxLength = 280;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[85vh] flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto"
    >
      {/* Top Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Love Letter Protocol 💌</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2040] font-['Outfit']">
          Leave him a note ✍️💕
        </h2>
      </div>

      {/* Message Form */}
      <form onSubmit={handleSubmit} className="w-full my-auto space-y-4">
        <div className="relative glass-card rounded-[28px] p-4 border border-pink-200/80 shadow-xl focus-within:border-pink-400 transition-colors">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxLength))}
            placeholder="Tell your dumb boyfriend what you want to say... 🥹"
            rows={5}
            disabled={loading}
            className="w-full bg-transparent resize-none outline-none text-[#4A2040] placeholder:text-pink-300/90 text-base font-medium leading-relaxed font-['Outfit']"
            autoFocus
          />

          {/* Character counter */}
          <div className="flex justify-between items-center pt-2 border-t border-pink-100/60 text-xs font-semibold text-pink-400">
            <span>Keep it sweet or spicy 🌶️</span>
            <span>
              {text.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          disabled={!text.trim() || loading}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-pink-300/60 border border-pink-400/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Send To Drama King 💌</span>
              <Send className="w-4 h-4 text-white" />
            </>
          )}
        </motion.button>
      </form>

      {/* Little footnote */}
      <div className="pb-2 text-center text-xs text-pink-400 font-medium flex items-center justify-center gap-1">
        <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
        <span>This will be saved directly into his inbox</span>
      </div>
    </motion.div>
  );
};
