'use client';
import { useCallback, useEffect, useState } from 'react';
import { GameState, ChatMessage } from '@/lib/types';
import {
  createInitialState,
  saveState,
  loadState,
  clearState,
  checkWinCondition,
} from '@/lib/gameState';
import VillagerList from '@/components/VillagerList';
import ChatPanel from '@/components/ChatPanel';
import VoteModal from '@/components/VoteModal';
import NightScreen from '@/components/NightScreen';
import EndScreen from '@/components/EndScreen';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [nightNarration, setNightNarration] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.phase !== 'won' && saved.phase !== 'lost') {
      setGameState(saved);
    } else {
      const initial = createInitialState();
      setGameState(initial);
      saveState(initial);
    }
  }, []);

  const updateState = useCallback((updater: (s: GameState) => GameState) => {
    setGameState(prev => {
      if (!prev) return prev;
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!gameState || !selectedId || isLoading) return;

    const villager = gameState.villagers.find(v => v.id === selectedId);
    if (!villager || villager.status !== 'alive') return;

    const userMsg: ChatMessage = { role: 'user', content: message };

    updateState(s => ({
      ...s,
      chatHistories: {
        ...s.chatHistories,
        [selectedId]: [...(s.chatHistories[selectedId] ?? []), userMsg],
      },
    }));

    setIsLoading(true);
    try {
      const currentHistory = gameState.chatHistories[selectedId] ?? [];
      const res = await fetch('/api/mafia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villagerId: selectedId,
          chatHistory: currentHistory,
          newMessage: message,
          gameState: {
            day: gameState.day,
            aliveVillagerIds: gameState.villagers.filter(v => v.status === 'alive').map(v => v.id),
            exiledIds: gameState.villagers.filter(v => v.status === 'exiled').map(v => v.id),
            killedIds: gameState.villagers.filter(v => v.status === 'dead').map(v => v.id),
          },
          villagers: gameState.villagers,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Chat request failed');
      }

      if (data.response) {
        const assistantMsg: ChatMessage = { role: 'assistant', content: data.response };
        updateState(s => ({
          ...s,
          chatHistories: {
            ...s.chatHistories,
            [selectedId]: [...(s.chatHistories[selectedId] ?? []), assistantMsg],
          },
        }));
      }
    } catch (err) {
      console.error('Chat error:', err);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: 'Связь сорвалась. Повторите вопрос короче или выберите другого подозреваемого.',
      };
      updateState(s => ({
        ...s,
        chatHistories: {
          ...s.chatHistories,
          [selectedId]: [...(s.chatHistories[selectedId] ?? []), assistantMsg],
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteConfirm = async (targetId: string) => {
    if (!gameState) return;
    setShowVoteModal(false);

    const afterExile: GameState = {
      ...gameState,
      villagers: gameState.villagers.map(v =>
        v.id === targetId ? { ...v, status: 'exiled' as const } : v
      ),
    };

    const winCheck = checkWinCondition(afterExile);
    if (winCheck === 'won') {
      const final = { ...afterExile, phase: 'won' as const };
      setGameState(final);
      saveState(final);
      return;
    }
    if (winCheck === 'lost') {
      const final = {
        ...afterExile,
        phase: 'lost' as const,
        loseReason: 'Мафия получила большинство голосов.',
      };
      setGameState(final);
      saveState(final);
      return;
    }

    const nightState: GameState = { ...afterExile, phase: 'night' };
    setGameState(nightState);
    saveState(nightState);
    setNightNarration(null);

    if (selectedId === targetId) setSelectedId(null);

    await runNightPhase(nightState);
  };

  const handleSuspicionChange = (id: string, value: number) => {
    updateState(s => ({
      ...s,
      villagers: s.villagers.map(v =>
        v.id === id ? { ...v, suspicion: value } : v
      ),
    }));
  };

  const runNightPhase = async (state: GameState) => {
    const alive = state.villagers.filter(v => v.status === 'alive');
    const mafiaIds = state.villagers
      .filter(v => v.role === 'mafia' && v.status === 'alive')
      .map(v => v.id);

    try {
      const res = await fetch('/api/mafia/night', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aliveVillagers: alive.map(v => ({ id: v.id, name: v.name })),
          mafiaIds,
          dayNumber: state.day,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      if (!data.killedVillagerId || !data.narration) {
        throw new Error('Invalid night response structure');
      }

      setNightNarration(data.narration);

      const afterKill: GameState = {
        ...state,
        villagers: state.villagers.map(v =>
          v.id === data.killedVillagerId ? { ...v, status: 'dead' as const } : v
        ),
        nightLog: [...state.nightLog, data.narration],
      };

      const winCheck = checkWinCondition({ ...afterKill, phase: 'night' });
      if (winCheck !== 'playing') {
        const aliveAfterKill = afterKill.villagers.filter(v => v.status === 'alive');
        const aliveMafia = aliveAfterKill.filter(v => v.role === 'mafia').length;
        const aliveCivilian = aliveAfterKill.filter(v => v.role === 'civilian').length;
        const loseReason =
          aliveMafia >= aliveCivilian
            ? 'Мафия получила большинство голосов.'
            : 'Три ночи прошло. Мафия победила.';
        const final = {
          ...afterKill,
          phase: winCheck as 'won' | 'lost',
          loseReason: winCheck === 'lost' ? loseReason : undefined,
        };
        setGameState(final);
        saveState(final);
      } else {
        setGameState(afterKill);
        saveState(afterKill);
      }
    } catch (err) {
      console.error('Night phase error:', err);
      const civilians = state.villagers.filter(v => v.status === 'alive' && v.role === 'civilian');
      const target = civilians.length > 0
        ? civilians[Math.floor(Math.random() * civilians.length)]
        : alive[Math.floor(Math.random() * alive.length)];

      const fallbackNarration = `Ночью произошло нападение. Нашли ${target.name} на улицах города.`;
      setNightNarration(fallbackNarration);

      const afterKill: GameState = {
        ...state,
        villagers: state.villagers.map(v =>
          v.id === target.id ? { ...v, status: 'dead' as const } : v
        ),
        nightLog: [...state.nightLog, fallbackNarration],
      };

      const winCheck = checkWinCondition({ ...afterKill, phase: 'night' });
      if (winCheck !== 'playing') {
        const final = {
          ...afterKill,
          phase: winCheck as 'won' | 'lost',
          loseReason: winCheck === 'lost' ? 'Три ночи прошло. Мафия победила.' : undefined,
        };
        setGameState(final);
        saveState(final);
      } else {
        setGameState(afterKill);
        saveState(afterKill);
      }
    }
  };

  const handleContinueFromNight = () => {
    setNightNarration(null);
    updateState(s => ({
      ...s,
      day: s.day + 1,
      phase: 'day',
    }));
  };

  const handleReplay = () => {
    clearState();
    const fresh = createInitialState();
    setGameState(fresh);
    saveState(fresh);
    setSelectedId(null);
    setNightNarration(null);
    setShowVoteModal(false);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 text-sm">Загрузка...</div>
      </div>
    );
  }

  const selectedVillager = gameState.villagers.find(v => v.id === selectedId) ?? null;
  const aliveVillagers = gameState.villagers.filter(v => v.status === 'alive');

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <div className="w-72 flex-shrink-0 border-r border-gray-800 flex flex-col">
        <VillagerList
          villagers={gameState.villagers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onVote={() => setShowVoteModal(true)}
          day={gameState.day}
          isLoading={isLoading}
          onSuspicionChange={handleSuspicionChange}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedVillager ? (
          <ChatPanel
            villager={selectedVillager}
            history={gameState.chatHistories[selectedVillager.id] ?? []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-gray-700 text-sm max-w-xs">
              Выберите подозреваемого слева чтобы начать допрос
            </div>
          </div>
        )}
      </div>

      {showVoteModal && (
        <VoteModal
          aliveVillagers={aliveVillagers}
          onConfirm={handleVoteConfirm}
          onCancel={() => setShowVoteModal(false)}
        />
      )}

      {gameState.phase === 'night' && (
        <NightScreen
          narration={nightNarration}
          onContinue={handleContinueFromNight}
        />
      )}

      {(gameState.phase === 'won' || gameState.phase === 'lost') && (
        <EndScreen gameState={gameState} onReplay={handleReplay} />
      )}
    </div>
  );
}
