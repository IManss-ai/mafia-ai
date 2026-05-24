'use client';
import React from 'react';
import { X } from 'lucide-react';

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'info' | 'success' | 'error';
}

export default function Toast({ message, isVisible, onClose, type = 'info' }: Props) {
  if (!isVisible) return null;

  const colors = {
    success: 'bg-[#23A55A]',
    error: 'bg-[#F23F42]',
    info: 'bg-[#5865F2]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl max-w-sm select-none bg-[#2B2D31] border border-[#3B3F45]">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[type]}`} />
      <p className="text-xs text-white font-semibold leading-relaxed">{message}</p>
      <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-0.5 ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
