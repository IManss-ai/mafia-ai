'use client';
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface Props extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}: Props) {
  const baseStyle =
    'relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 select-none outline-none disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#14B8A6] hover:bg-[#0D9488] text-white',
    secondary: 'bg-[#2B2D31] hover:bg-[#35373C] text-[#FFFFFF] border border-[#3B3F45]',
    danger: 'bg-[#F23F42] hover:bg-red-600 text-white',
    ghost: 'hover:bg-[#2B2D31] text-[#B5BAC1] hover:text-[#FFFFFF]',
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
