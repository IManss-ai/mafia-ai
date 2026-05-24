'use client';
import { motion } from 'framer-motion';

interface Props {
  initials: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  isCenter?: boolean;
  className?: string;
}

export default function AvatarCircle({ initials, name, color, size = 'md', isCenter = false, className = '' }: Props) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 text-xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          boxShadow: isCenter
            ? [
                '0 0 15px rgba(212, 175, 55, 0.4)',
                '0 0 25px rgba(212, 175, 55, 0.7)',
                '0 0 15px rgba(212, 175, 55, 0.4)',
              ]
            : [
                '0 0 8px rgba(96, 165, 250, 0.2)',
                '0 0 15px rgba(96, 165, 250, 0.5)',
                '0 0 8px rgba(96, 165, 250, 0.2)',
              ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`rounded-full flex items-center justify-center font-bold text-white border-2 select-none
          ${sizeClasses[size]} ${color}
          ${isCenter ? 'border-amber-400' : 'border-blue-400/80'}
        `}
      >
        {initials}
      </motion.div>
      <span className="text-[10px] text-gray-400 mt-1.5 font-medium select-none truncate max-w-[80px]">
        {name}
      </span>
    </div>
  );
}
