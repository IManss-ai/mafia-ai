'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Shield, CheckCircle2 } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface PlayerLobby {
  name: string;
  avatar: string;
  isHost?: boolean;
  isReady?: boolean;
}

export default function LobbyRoomPage({ params }: { params: { roomId: string } }) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const players: PlayerLobby[] = [
    { name: 'Мансур', avatar: 'Мансур', isReady: isReady },
    { name: 'Айбек', avatar: 'Aibek', isHost: true, isReady: true },
    { name: 'Диана', avatar: 'Diana', isReady: true },
    { name: 'Аслан', avatar: 'Aslan', isReady: false },
    { name: 'Камилла', avatar: 'Kamilla', isReady: false },
  ];

  const roomId = params.roomId.toUpperCase();

  const handleStartGame = () => {
    if (countdown !== null) return;
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      window.location.href = '/games/mafia';
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <PageTransition>
      <div className="p-6 md:p-8 space-y-8 select-none max-w-4xl mx-auto pb-24">
        
        {/* Lobby navigation */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-extrabold text-zinc-300">Комната #{roomId}</span>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: player circles */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-1">Участники лобби</h3>
            
            <div className="space-y-2.5">
              {players.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-zinc-800 bg-[#111111]/70 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Avatar seed={p.avatar} className="w-10 h-10 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                        {p.isHost && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-500/15 border border-purple-500/25 text-[7px] text-purple-400 font-extrabold rounded">
                            <Shield className="w-2.5 h-2.5" />
                            <span>ХОСТ</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-550 block mt-0.5">Присоединился</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.isReady ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ГОТОВ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
                        <span className="w-1.5 h-1.5 bg-zinc-650 rounded-full animate-pulse" />
                        <span>ЖДЕТ</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: game config status */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-1">Информация</h3>
              
              <GlassCard className="p-4 border-zinc-800/80 bg-[#111111]/70 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Выбранный режим</span>
                  <span className="text-xs font-extrabold text-zinc-200 block">Алматинская Мафия</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Карта / Сеттинг</span>
                  <span className="text-xs font-semibold text-zinc-300 block">Кок-Тобе, Алматы</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Сложность ботов</span>
                  <span className="text-xs font-semibold text-zinc-300 block">Эксперт Gemini</span>
                </div>
              </GlassCard>
            </div>

            {/* Launch Game controls */}
            <div className="space-y-3">
              {countdown !== null ? (
                <div className="w-full py-4 bg-purple-950/20 border border-purple-500/30 text-purple-400 text-center rounded-2xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-zinc-400">ЗАПУСК ИГРЫ ЧЕРЕЗ</span>
                  <span className="text-2xl font-black mt-1 font-mono tracking-wider animate-ping">{countdown}</span>
                </div>
              ) : (
                <>
                  <AnimatedButton
                    onClick={() => setIsReady(!isReady)}
                    variant={isReady ? 'ghost' : 'secondary'}
                    className="w-full py-3 text-xs font-extrabold rounded-2xl"
                  >
                    {isReady ? 'Отменить готовность' : 'Я готов'}
                  </AnimatedButton>

                  {isReady && (
                    <AnimatedButton
                      onClick={handleStartGame}
                      variant="primary"
                      className="w-full py-3 text-xs font-extrabold rounded-2xl bg-purple-600 hover:bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.25)] flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-4 h-4" />
                      <span>Запустить сессию</span>
                    </AnimatedButton>
                  )}
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}
