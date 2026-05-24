'use client';
import { Villager } from '@/lib/types';

interface Props {
  villager: Villager;
  isSelected: boolean;
  onClick: () => void;
  onToggleSuspect?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  alive: 'живой',
  dead: 'погиб',
  exiled: 'изгнан',
};

export default function VillagerCard({ villager, isSelected, onClick, onToggleSuspect }: Props) {
  const isDead = villager.status !== 'alive';
  const initials = villager.name.slice(0, 2).toUpperCase();

  return (
    <div className="relative group">
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
        <div className="min-w-0 flex-1 pr-6" title={`${villager.name} — ${villager.profession}`}>
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

      {!isDead && onToggleSuspect && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSuspect();
          }}
          title={villager.suspected ? 'Снять подозрение' : 'Пометить как подозреваемого'}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors z-10
            ${villager.suspected
              ? 'text-red-400 bg-red-950/40 border border-red-900/60 hover:bg-red-900/30'
              : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800 opacity-0 group-hover:opacity-100 focus:opacity-100'
            }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </button>
      )}
    </div>
  );
}
