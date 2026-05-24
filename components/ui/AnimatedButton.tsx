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
    primary:
      'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_16px_rgba(168,85,247,0.4)]',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80',
    danger: 'bg-rose-750 hover:bg-rose-700 text-white shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    ghost: 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200',
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
