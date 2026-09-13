import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bag } from '../types';
import { Sparkles, Heart, X } from 'lucide-react';

interface BagCardProps {
  bag: Bag;
  index: number;
  totalCandidates: number;
  decision?: 'liked' | 'disliked';
  onLike: () => void;
  onDislike: () => void;
  isCurrent?: boolean;
}

export const BagCard: React.FC<BagCardProps> = ({
  bag,
  index,
  totalCandidates,
  decision,
  onLike,
  onDislike,
  isCurrent = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLiked = decision === 'liked';
  const isDisliked = decision === 'disliked';

  return (
    <div
      className={`w-full max-w-[340px] h-[520px] glass-card rounded-[32px] p-3.5 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-300 select-none ${
        isCurrent
          ? 'border-2 border-pink-300/80 shadow-pink-200/60 ring-4 ring-pink-100/50'
          : 'border border-pink-200/50 shadow-md opacity-85'
      }`}
    >
      {/* Decorative Glow accents */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Floating Badge: Status / Decision */}
      <div className="absolute top-5 right-5 z-20 pointer-events-none">
        {isLiked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1.5 border border-white/40"
          >
            <Heart className="w-3 h-3 fill-white stroke-[2]" />
            <span>Liked 💕</span>
          </motion.div>
        ) : isDisliked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1.5 border border-white/40"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
            <span>Disliked</span>
          </motion.div>
        ) : (
          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-100/90 shadow-sm flex items-center gap-1 text-[11px] font-semibold text-pink-600">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>#{index + 1} of {totalCandidates}</span>
          </div>
        )}
      </div>

      {/* Bag Image Area */}
      <div className="w-full h-[62%] rounded-[24px] overflow-hidden bg-gradient-to-b from-pink-50/60 to-white relative shadow-inner border border-pink-100/60 flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-pink-50/40">
            <div className="w-8 h-8 rounded-full border-2 border-pink-300 border-t-pink-500 animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="flex flex-col items-center justify-center text-pink-400 p-4 text-center">
            <span className="text-4xl mb-1">👜</span>
            <p className="text-xs font-medium">Image preview coming soon 💕</p>
          </div>
        ) : (
          <img
            src={bag.image_url}
            alt={bag.name}
            draggable={false}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center pointer-events-none transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle touch hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/75 backdrop-blur-sm border border-pink-100 text-[10px] text-pink-500/90 font-medium pointer-events-none">
          slide ‹ › to browse
        </div>
      </div>

      {/* Bag Name & Details Area */}
      <div className="w-full px-2 pt-2 text-center flex flex-col items-center justify-center">
        <h2 className="text-base sm:text-lg font-bold text-[#4A2040] tracking-tight leading-snug line-clamp-2 font-['Outfit']">
          {bag.name}
        </h2>
      </div>

      {/* Integrated Attached Decision Controls directly ON the card */}
      <div className="w-full pt-2 pb-1 px-1 flex items-center justify-between gap-3">
        {/* DISLIKE BUTTON */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDislike();
          }}
          className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            isDisliked
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-300/50 ring-2 ring-rose-400 ring-offset-1 font-black scale-[1.02]'
              : 'bg-white/90 border border-rose-200/90 text-rose-500 shadow-sm hover:bg-rose-50/80 active:bg-rose-100/80'
          }`}
          aria-label={isDisliked ? 'Disliked (tap to change)' : 'Dislike bag'}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isDisliked ? 'bg-white/20' : 'bg-rose-100'
            }`}
          >
            <X className={`w-3 h-3 stroke-[2.5] ${isDisliked ? 'text-white' : 'text-rose-500'}`} />
          </div>
          <span>{isDisliked ? 'DISLIKED' : 'DISLIKE'}</span>
        </motion.button>

        {/* LIKE BUTTON */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className={`flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            isLiked
              ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-300/60 ring-2 ring-pink-400 ring-offset-1 font-black scale-[1.02]'
              : 'bg-white/90 border border-pink-200/90 text-pink-600 shadow-sm hover:bg-pink-50/80 active:bg-pink-100/80'
          }`}
          aria-label={isLiked ? 'Liked (tap to change)' : 'Like bag'}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isLiked ? 'bg-white/20' : 'bg-pink-100'
            }`}
          >
            <Heart
              className={`w-3 h-3 stroke-[2] ${
                isLiked ? 'text-white fill-white' : 'text-pink-500 fill-pink-500'
              }`}
            />
          </div>
          <span>{isLiked ? 'LIKED' : 'LIKE'}</span>
        </motion.button>
      </div>
    </div>
  );
};
