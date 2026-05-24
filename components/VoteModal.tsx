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
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-gray-100 font-semibold">Кого изгнать?</h2>
          <p className="text-gray-500 text-sm mt-1">Выбор необратим. День закончится.</p>
        </div>

        <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
          {aliveVillagers.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                ${selectedId === v.id ? 'bg-red-900/40 ring-1 ring-red-700' : 'hover:bg-gray-800'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${v.color}`}>
                {v.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-gray-100">{v.name}</div>
                <div className="text-xs text-gray-400">{v.profession}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button
            disabled={!selectedId}
            onClick={() => selectedId && onConfirm(selectedId)}
            className="flex-1 py-2 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
          >
            Изгнать
          </button>
        </div>
      </div>
    </div>
  );
}
