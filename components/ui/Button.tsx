'use client';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: Props) {
  const base = 'px-4 py-2.5 text-xs font-bold rounded-xl transition-colors select-none disabled:opacity-40 disabled:cursor-not-allowed outline-none';
  const styles = {
    primary: 'bg-[#14B8A6] hover:bg-[#0D9488] text-white',
    secondary: 'bg-[#4E5058] hover:bg-[#6D6F78] text-white',
    outline: 'bg-transparent hover:bg-[#35373C] border border-[#3B3F45] text-white'
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
