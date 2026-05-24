'use client';
import { Villager } from '@/lib/types';

interface Props {
  villager: Villager;
  isSelected: boolean;
  onClick: () => void;
  onSuspicionChange?: (value: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  alive: 'живой',
  dead: 'погиб',
  exiled: 'изгнан',
};

export default function VillagerCard({ villager, isSelected, onClick, onSuspicionChange }: Props) {
  const isDead = villager.status !== 'alive';
  const initials = villager.name.slice(0, 2).toUpperCase();
  const suspicionValue = villager.suspicion ?? 0;
  
  const suspicionColor = suspicionValue > 60 
    ? 'text-red-400 font-bold' 
    : suspicionValue > 25 
      ? 'text-amber-400 font-bold' 
      : 'text-gray-400';

  const accentClass = suspicionValue > 60 
    ? 'accent-red-500' 
    : suspicionValue > 25 
      ? 'accent-amber-500' 
      : 'accent-green-500';

  return (
    <div
      onClick={isDead ? undefined : onClick}
      className={`w-full flex flex-col gap-2 p-3 rounded-xl transition-all border select-none
        ${isDead ? 'opacity-40 cursor-not-allowed border-gray-900 bg-gray-950/20' : 'cursor-pointer'}
        ${isSelected && !isDead 
          ? 'bg-gray-900 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
          : 'bg-gray-950/40 border-gray-800/85 hover:border-gray-700/80 hover:bg-gray-900/30'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color} shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-bold text-gray-100 flex items-center justify-between ${isDead ? 'line-through text-gray-500' : ''}`}>
            <span>{villager.name}</span>
            {!isDead && <span className="text-[10px] text-gray-500 font-mono font-medium">{villager.age} лет</span>}
          </div>
          <div className="text-[11px] text-gray-400 truncate mt-0.5">{villager.profession}</div>
          {isDead && (
            <span className={`text-[10px] uppercase font-bold tracking-wider inline-block mt-1 px-1.5 py-0.5 rounded ${villager.status === 'exiled' ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-gray-950/40 text-gray-500 border border-gray-900'}`}>
              {STATUS_LABELS[villager.status]}
            </span>
          )}
        </div>
      </div>

      {!isDead && onSuspicionChange && (
        <div 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 pt-1.5 border-t border-gray-800/60"
        >
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold mb-1 select-none">
            <span className="text-gray-500">ШКАЛА ПОДОЗРЕНИЯ</span>
            <span className={suspicionColor}>
              {suspicionValue}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={suspicionValue}
            onChange={(e) => onSuspicionChange(Number(e.target.value))}
            className={`w-full h-1 bg-gray-950 rounded-lg appearance-none cursor-pointer focus:outline-none ${accentClass}`}
          />
        </div>
      )}
    </div>
  );
}
