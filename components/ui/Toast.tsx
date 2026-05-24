'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'info' | 'success' | 'error';
}

export default function Toast({ message, isVisible, onClose, type = 'info' }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border bg-zinc-900/90 border-zinc-800 shadow-2xl backdrop-blur-md max-w-sm select-none"
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
            type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
            'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
          }`} />
          <p className="text-xs text-zinc-200 font-semibold leading-relaxed">{message}</p>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-350 transition-colors p-0.5 ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
