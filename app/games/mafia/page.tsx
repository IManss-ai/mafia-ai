'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
import AnimatedButton from '@/components/ui/AnimatedButton';
import Avatar from '@/components/ui/Avatar';
import PageTransition from '@/components/ui/PageTransition';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [nightNarration, setNightNarration] = useState<string | null>(null);
  const confettiFired = useRef(false);

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

  // Fire confetti when the player wins
  useEffect(() => {
    if (gameState?.phase === 'won' && !confettiFired.current) {
      confettiFired.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } }), 300);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } }), 600);
      });
    }
    if (gameState?.phase !== 'won') {
      confettiFired.current = false;
    }
  }, [gameState?.phase]);

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
    confettiFired.current = false;
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-[#1E1F22] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedVillager = gameState.villagers.find(v => v.id === selectedId) ?? null;
  const aliveVillagers = gameState.villagers.filter(v => v.status === 'alive');

  return (
    <PageTransition>
      <div className="h-screen w-full flex flex-col overflow-hidden relative bg-[#1E1F22]">

        {/* Top bar with back button and day indicator */}
        <div className="h-12 border-b border-[#3B3F45] bg-[#2B2D31] px-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#B5BAC1] hover:text-[#FFFFFF] transition-colors p-1.5 bg-[#1E1F22] border border-[#3B3F45] rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-[#B5BAC1]">Алматинская Мафия</span>
          </div>
          <span className="text-xs font-mono text-[#B5BAC1]">День {gameState.day}</span>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Suspects Panel */}
          <div className="w-full md:w-[350px] lg:w-[380px] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#3B3F45] flex flex-col h-[50vh] md:h-full bg-[#2B2D31]">
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

          {/* Right Chat Panel */}
          <div className="flex-1 flex flex-col h-[50vh] md:h-full relative">
            {selectedVillager ? (
              <ChatPanel
                villager={selectedVillager}
                history={gameState.chatHistories[selectedVillager.id] ?? []}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none bg-[#1E1F22]">
                <div className="w-12 h-12 rounded-full bg-[#2B2D31] border border-[#3B3F45] flex items-center justify-center text-[#14B8A6] mb-4">
                  <Avatar seed="?" className="w-6 h-6 border-none bg-transparent" />
                </div>
                <p className="text-[#FFFFFF] text-sm font-bold">Начало допроса</p>
                <p className="text-[#B5BAC1] text-xs mt-1.5 max-w-[240px] leading-relaxed">
                  Выберите одного из жителей слева, чтобы начать перекрестный допрос.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Voting Modal */}
        {showVoteModal && (
          <VoteModal
            aliveVillagers={aliveVillagers}
            onConfirm={handleVoteConfirm}
            onCancel={() => setShowVoteModal(false)}
          />
        )}

        {/* Night Phase Overlay */}
        <AnimatePresence>
          {gameState.phase === 'night' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1E1F22]/97 z-50 flex flex-col items-center justify-center text-center p-6 select-none"
            >
              <div className="max-w-md w-full space-y-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B5BAC1] font-bold">НОЧЬ В АЛМАТЫ</span>
                <h2 className="text-3xl font-extrabold text-[#14B8A6] tracking-tight">
                  Наступает ночь...
                </h2>
                <p className="text-xs text-[#B5BAC1]">Город спит. Убийцы выходят на улицы.</p>

                {nightNarration ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-4"
                  >
                    <div className="w-12 h-[1px] bg-[#3B3F45] mx-auto" />
                    <p className="text-[#FFFFFF] text-sm leading-relaxed max-w-sm mx-auto">{nightNarration}</p>
                    <div className="w-12 h-[1px] bg-[#3B3F45] mx-auto" />
                    <AnimatedButton
                      onClick={handleContinueFromNight}
                      variant="primary"
                      className="px-6 py-2.5 mx-auto"
                    >
                      Продолжить расследование
                    </AnimatedButton>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-[#B5BAC1] text-xs font-semibold pt-8">
                    <span>Убийцы выбирают следующую жертву</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End Game Overlay */}
        <AnimatePresence>
          {(gameState.phase === 'won' || gameState.phase === 'lost') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#1E1F22]/97 z-50 flex flex-col items-center justify-center text-center p-6 select-none"
            >
              <div className="max-w-sm w-full space-y-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B5BAC1] font-bold">
                  {gameState.phase === 'won' ? 'ДЕЛО ЗАКРЫТО' : 'ДЕЛО ПРОВАЛЕНО'}
                </span>

                <h2 className={`text-3xl font-extrabold tracking-tight ${gameState.phase === 'won' ? 'text-[#23A55A]' : 'text-[#F23F42]'}`}>
                  {gameState.phase === 'won' ? 'Убийцы пойманы!' : 'Мафия победила.'}
                </h2>

                <p className="text-xs text-[#B5BAC1] leading-relaxed">
                  {gameState.phase === 'won'
                    ? 'Вы успешно установили личности преступников и спасли город.'
                    : (gameState.loseReason ?? 'Мафия получила большинство голосов.')}
                </p>

                <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 text-left space-y-3">
                  <span className="text-[9px] text-[#B5BAC1] font-bold uppercase tracking-wider block border-b border-[#3B3F45] pb-2">Убийцы:</span>
                  {gameState.villagers
                    .filter(v => v.role === 'mafia')
                    .map(v => (
                      <div key={v.id} className="flex items-center gap-3">
                        <Avatar seed={v.name} className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#FFFFFF]">{v.name}</div>
                          <div className="text-[10px] text-[#B5BAC1] truncate">{v.profession}</div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${v.status === 'exiled' ? 'text-[#23A55A]' : 'text-[#F23F42]'}`}>
                          {v.status === 'exiled' ? 'пойман' : 'на свободе'}
                        </span>
                      </div>
                    ))}
                </div>

                <AnimatedButton
                  onClick={handleReplay}
                  variant="primary"
                  className="w-full py-3 font-bold"
                >
                  Играть снова
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
