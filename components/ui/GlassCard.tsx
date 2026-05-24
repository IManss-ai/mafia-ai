'use client';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: Props) {
  return (
    <div className={`bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-6 relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
