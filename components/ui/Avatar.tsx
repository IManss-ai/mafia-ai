'use client';
import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';

interface Props {
  seed: string;
  className?: string;
}

export default function Avatar({ seed, className = 'w-10 h-10' }: Props) {
  const svg = useMemo(() => {
    // Sanitize seed name to get stable outputs
    return createAvatar(avataaars, {
      seed,
      size: 96,
      radius: 50,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    }).toString();
  }, [seed]);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
