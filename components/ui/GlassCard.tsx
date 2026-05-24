'use client';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: Props) {
  return (
    <div className={`backdrop-blur-md bg-[#111111]/85 border border-[#27272A]/70 rounded-[24px] p-6 shadow-xl relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
