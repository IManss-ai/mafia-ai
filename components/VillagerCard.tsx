'use client';
import { Villager } from '@/lib/types';

interface Props {
  villager: Villager;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  alive: 'живой',
  dead: 'погиб',
  exiled: 'изгнан',
};

export default function VillagerCard({ villager, isSelected, onClick }: Props) {
  const isDead = villager.status !== 'alive';
  const initials = villager.name.slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      disabled={isDead}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
        ${isDead ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-800'}
        ${isSelected && !isDead ? 'bg-gray-800 ring-1 ring-gray-600' : ''}
      `}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color}`}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-medium text-gray-100 truncate ${isDead ? 'line-through' : ''}`}>
          {villager.name}
        </div>
        <div className="text-xs text-gray-400 truncate">{villager.profession}</div>
        {isDead && (
          <div className={`text-xs mt-0.5 ${villager.status === 'exiled' ? 'text-red-400' : 'text-gray-500'}`}>
            {STATUS_LABELS[villager.status]}
          </div>
        )}
      </div>
    </button>
  );
}
