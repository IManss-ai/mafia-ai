'use client';
import { Villager } from '@/lib/types';
import VillagerCard from './VillagerCard';

interface Props {
  villagers: Villager[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onVote: () => void;
  day: number;
}

export default function VillagerList({ villagers, selectedId, onSelect, onVote, day }: Props) {
  const aliveCount = villagers.filter(v => v.status === 'alive').length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">День {day} из 3</div>
        <div className="text-sm text-gray-300">{aliveCount} подозреваемых</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {villagers.map(v => (
          <VillagerCard
            key={v.id}
            villager={v}
            isSelected={selectedId === v.id}
            onClick={() => onSelect(v.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onVote}
          className="w-full py-2.5 px-4 bg-red-800 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Проголосовать за изгнание
        </button>
      </div>
    </div>
  );
}
