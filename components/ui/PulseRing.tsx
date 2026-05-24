'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  active?: boolean;
  color?: 'teal' | 'blue' | 'emerald';
}

export default function PulseRing({ children, active = false, color = 'teal' }: Props) {
  if (!active) return <>{children}</>;

  const ringColors = {
    teal: 'border-teal-500/70',
    blue: 'border-blue-500/70',
    emerald: 'border-emerald-500/70',
  };

  return (
    <div className="relative inline-block">
      {/* Pulse Outer */}
      <motion.div
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        className={`absolute inset-0 rounded-full border-2 ${ringColors[color]} pointer-events-none z-0`}
      />
      {/* Pulse Mid */}
      <motion.div
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
        className={`absolute inset-0 rounded-full border-2 ${ringColors[color]} pointer-events-none z-0`}
      />
      {/* Inner Children */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
