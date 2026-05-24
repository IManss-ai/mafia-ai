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
    ? 'text-[#F23F42] font-bold'
    : suspicionValue > 25
      ? 'text-[#F1C40F] font-bold'
      : 'text-[#B5BAC1]';

  const accentClass = suspicionValue > 60
    ? 'accent-red-500'
    : suspicionValue > 25
      ? 'accent-yellow-500'
      : 'accent-green-500';

  return (
    <div
      onClick={isDead ? undefined : onClick}
      className={`w-full flex flex-col gap-2 p-3 rounded-xl transition-all border select-none
        ${isDead ? 'opacity-40 cursor-not-allowed border-[#3B3F45] bg-[#2B2D31]/50' : 'cursor-pointer'}
        ${isSelected && !isDead
          ? 'bg-[#35373C] border-[#14B8A6]'
          : 'bg-[#2B2D31] border-[#3B3F45] hover:bg-[#35373C] hover:border-[#14B8A6]/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color}`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-bold text-[#FFFFFF] flex items-center justify-between ${isDead ? 'line-through text-[#B5BAC1]' : ''}`}>
            <span>{villager.name}</span>
            {!isDead && <span className="text-[10px] text-[#B5BAC1] font-mono font-medium">{villager.age} лет</span>}
          </div>
          <div className="text-[11px] text-[#B5BAC1] truncate mt-0.5">{villager.profession}</div>
          {isDead && (
            <span className={`text-[10px] uppercase font-bold tracking-wider inline-block mt-1 px-1.5 py-0.5 rounded ${villager.status === 'exiled' ? 'bg-[#F23F42]/10 text-[#F23F42] border border-[#F23F42]/30' : 'bg-[#2B2D31] text-[#B5BAC1] border border-[#3B3F45]'}`}>
              {STATUS_LABELS[villager.status]}
            </span>
          )}
        </div>
      </div>

      {!isDead && onSuspicionChange && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 pt-1.5 border-t border-[#3B3F45]"
        >
          <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-bold mb-1 select-none">
            <span className="text-[#B5BAC1]">ПОДОЗРЕНИЕ</span>
            <span className={suspicionColor}>{suspicionValue}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={suspicionValue}
            onChange={(e) => onSuspicionChange(Number(e.target.value))}
            className={`w-full h-1 bg-[#3B3F45] rounded-lg appearance-none cursor-pointer focus:outline-none ${accentClass}`}
          />
        </div>
      )}
    </div>
  );
}
