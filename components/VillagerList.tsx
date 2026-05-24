'use client';
import { Villager } from '@/lib/types';
import VillagerCard from './VillagerCard';

interface Props {
  villagers: Villager[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onVote: () => void;
  day: number;
  isLoading?: boolean;
  onSuspicionChange?: (id: string, value: number) => void;
}

export default function VillagerList({
  villagers,
  selectedId,
  onSelect,
  onVote,
  day,
  isLoading,
  onSuspicionChange,
}: Props) {
  const aliveCount = villagers.filter(v => v.status === 'alive').length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#3B3F45]">
        <div className="text-xs text-[#B5BAC1] uppercase tracking-wider mb-1">День {day} из 3</div>
        <div className="text-sm text-[#FFFFFF] font-bold">{aliveCount} подозреваемых</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {villagers.map(v => (
          <VillagerCard
            key={v.id}
            villager={v}
            isSelected={selectedId === v.id}
            onClick={() => onSelect(v.id)}
            onSuspicionChange={onSuspicionChange ? (val) => onSuspicionChange(v.id, val) : undefined}
          />
        ))}
      </div>

      <div className="p-4 border-t border-[#3B3F45]">
        <button
          disabled={isLoading}
          onClick={onVote}
          className="w-full py-2.5 px-4 bg-[#F23F42] hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Голосовать за изгнание
        </button>
      </div>
    </div>
  );
}
