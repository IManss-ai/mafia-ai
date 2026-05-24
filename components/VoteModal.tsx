'use client';
import { useState } from 'react';
import { Villager } from '@/lib/types';

interface Props {
  aliveVillagers: Villager[];
  onConfirm: (villagerId: string) => void;
  onCancel: () => void;
}

export default function VoteModal({ aliveVillagers, onConfirm, onCancel }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl w-full max-w-sm">
        <div className="p-5 border-b border-[#3B3F45]">
          <h2 className="text-[#FFFFFF] font-bold">Кого изгнать?</h2>
          <p className="text-[#B5BAC1] text-sm mt-1">Выбор необратим. День закончится.</p>
        </div>

        <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
          {aliveVillagers.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors
                ${selectedId === v.id
                  ? 'bg-[#F23F42]/15 border border-[#F23F42]/50'
                  : 'hover:bg-[#35373C] border border-transparent'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${v.color}`}>
                {v.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-[#FFFFFF] font-medium">{v.name}</div>
                <div className="text-xs text-[#B5BAC1]">{v.profession}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[#3B3F45] flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm text-[#B5BAC1] hover:text-[#FFFFFF] transition-colors"
          >
            Отмена
          </button>
          <button
            disabled={!selectedId}
            onClick={() => selectedId && onConfirm(selectedId)}
            className="flex-1 py-2 bg-[#F23F42] hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Изгнать
          </button>
        </div>
      </div>
    </div>
  );
}
