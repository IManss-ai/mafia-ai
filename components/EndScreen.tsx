'use client';
import { GameState } from '@/lib/types';

interface Props {
  gameState: GameState;
  onReplay: () => void;
}

export default function EndScreen({ gameState, onReplay }: Props) {
  const won = gameState.phase === 'won';
  const mafia = gameState.villagers.filter(v => v.role === 'mafia');

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-gray-600 text-xs uppercase tracking-widest">
          {won ? 'Дело закрыто' : 'Дело провалено'}
        </div>

        <h1 className={`text-3xl font-bold ${won ? 'text-gray-100' : 'text-red-400'}`}>
          {won ? 'Убийцы пойманы.' : 'Мафия победила.'}
        </h1>

        <p className="text-gray-400 text-sm">
          {won
            ? 'Вы установили личности обоих убийц Алмаса.'
            : (gameState.loseReason ?? 'Мафия взяла контроль над городом.')}
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left space-y-3">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">Убийцы Алмаса</div>
          {mafia.map(v => (
            <div key={v.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${v.color}`}>
                {v.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-100">{v.name}</div>
                <div className="text-xs text-gray-500 truncate">{v.profession}</div>
              </div>
              <div className={`text-xs font-medium ${v.status === 'exiled' ? 'text-green-400' : 'text-red-400'}`}>
                {v.status === 'exiled' ? 'пойман' : 'на свободе'}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onReplay}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm rounded-lg transition-colors"
        >
          Играть снова
        </button>
      </div>
    </div>
  );
}
