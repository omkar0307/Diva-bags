import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface UndoButtonProps {
  onUndo: () => void;
  disabled?: boolean;
}

export const UndoButton: React.FC<UndoButtonProps> = ({ onUndo, disabled = false }) => {
  if (disabled) return <div className="h-9" />; // preserve spacing

  return (
    <div className="w-full flex justify-center py-2">
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={onUndo}
        className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white/90 border border-pink-200/50 text-xs font-semibold text-pink-500/80 hover:text-pink-600 shadow-sm flex items-center gap-1.5 transition-all duration-200"
      >
        <RotateCcw className="w-3 h-3 text-pink-400" />
        <span>waittt, I changed my mind</span>
      </motion.button>
    </div>
  );
};
