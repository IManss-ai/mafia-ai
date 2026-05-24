'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Lock, ArrowRight, Sparkles, Activity } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Avatar from '@/components/ui/Avatar';
import PageTransition from '@/components/ui/PageTransition';

interface Game {
  id: string;
  title: string;
  description: string;
  playUrl?: string;
  isSoon?: boolean;
  playersCount: string;
  accent: string;
}

const GAMES: Game[] = [
  {
    id: 'mafia',
    title: 'Алматинская Мафия',
    description: 'Интерактивный детектив. Допроси 6 жителей Кок-Тобе и найди двух скрытых мафиози.',
    playUrl: '/games/mafia',
    playersCount: '124 в игре',
    accent: 'border-rose-500/30 hover:border-rose-500/80 shadow-rose-950/20 shadow-lg',
  },
  {
    id: 'spy',
    title: 'Кто Шпион?',
    description: 'Словесная дедукция в Алматы. Задавай вопросы и вычисляй скрытого шпиона по описаниям.',
    playUrl: '/games/spy',
    playersCount: '86 в игре',
    accent: 'border-blue-500/30 hover:border-blue-500/80 shadow-blue-950/20 shadow-lg',
  },
  {
    id: 'word',
    title: 'Угадай Слово',
    description: 'Скоростное разгадывание казахских ассоциаций и понятий с умной нейросетью.',
    isSoon: true,
    playersCount: 'Скоро',
    accent: 'opacity-75',
  },
  {
    id: 'aitys',
    title: 'Айтыс',
    description: 'Интерактивное соревнование в красноречии и казахской поэзии против ИИ-акына.',
    isSoon: true,
    playersCount: 'Скоро',
    accent: 'opacity-75',
  },
  {
    id: 'karakol',
    title: 'Каракол',
    description: 'Головоломки побега и логики в заброшенных шахтах Чарынского каньона.',
    isSoon: true,
    playersCount: 'Скоро',
    accent: 'opacity-75',
  },
  {
    id: 'quiz',
    title: 'Казахский Квиз',
    description: 'Командная викторина по культуре, истории и современным фактам Казахстана.',
    isSoon: true,
    playersCount: 'Скоро',
    accent: 'opacity-75',
  },
];

const FAKE_FEED = [
  { user: 'Айбек', action: 'играет в', game: 'Алматинская Мафия', time: '1 мин назад', avatar: 'Aibek' },
  { user: 'Диана', action: 'создала лобби в', game: 'Кто Шпион?', time: '3 мин назад', avatar: 'Diana' },
  { user: 'Аслан', action: 'завершил раунд в', game: 'Кто Шпион?', time: '5 мин назад', avatar: 'Aslan' },
  { user: 'Камилла', action: 'пригласила друзей в', game: 'Мафию', time: '8 мин назад', avatar: 'Kamilla' },
  { user: 'Темирлан', action: 'играет в', game: 'Алматинская Мафия', time: '12 мин назад', avatar: 'Temirlan' },
];

export default function Home() {
  const [onlineCount, setOnlineCount] = useState(234);

  useEffect(() => {
    // Subtle online player variations
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const diff = Math.floor(Math.random() * 9) - 4;
        return Math.max(210, Math.min(270, prev + diff));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="p-6 md:p-8 space-y-8 select-none max-w-7xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch">
          <div className="space-y-1.5 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              С возвращением, Мансур
            </h1>
            <p className="text-zinc-400 text-sm">
              Готов к интеллектуальным испытаниям? Твои друзья уже онлайн.
            </p>
          </div>

          {/* Daily Challenge Card */}
          <div className="flex-1 w-full md:max-w-md bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Дневной Вызов</span>
              </div>
              <p className="text-sm font-extrabold text-white leading-snug">
                Раскрой шпиона в 3 раундах
              </p>
              <p className="text-[11px] text-purple-300">Награда: +200 XP | +50 ₸</p>
            </div>
            <Link href="/games/spy">
              <AnimatedButton variant="primary" className="py-2 px-4 text-xs font-bold flex items-center gap-1 bg-purple-600 hover:bg-purple-500 rounded-xl">
                <span>Начать</span>
                <ArrowRight className="w-3 h-3" />
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Online Friends strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Друзья онлайн</h3>
            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {onlineCount} человек онлайн
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none select-none">
            {['Айбек', 'Диана', 'Аслан', 'Камилла', 'Темирлан', 'Жанар', 'Ержан', 'Алина'].map((name) => (
              <Link key={name} href="/profile" className="flex flex-col items-center gap-1.5 group flex-shrink-0">
                <div className="relative">
                  <Avatar seed={name} className="w-11 h-11 border border-zinc-800 transition-transform group-hover:scale-105" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A] shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Game List Grid (Left columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-1">
              Игровая комната
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GAMES.map((game) => {
                const isSoon = game.isSoon;

                return (
                  <GlassCard
                    key={game.id}
                    className={`h-[320px] max-w-[340px] sm:max-w-none w-full border border-zinc-800 flex flex-col justify-between transition-all group ${game.accent}
                      ${isSoon ? 'bg-[#111111]/30 hover:border-zinc-850' : 'bg-[#111111]/85'}`}
                  >
                    {isSoon && (
                      <div className="absolute inset-0 bg-black/60 z-20 rounded-[24px] flex flex-col items-center justify-center gap-2.5 backdrop-blur-[1.5px] border border-transparent group-hover:border-zinc-800/40">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                          <Lock className="w-4 h-4 text-zinc-500" />
                        </div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Скоро на WePlay
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider
                          ${isSoon ? 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/30' : 
                            game.id === 'mafia' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' :
                            'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                          }`}
                        >
                          {game.playersCount}
                        </span>
                        {!isSoon && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
                      </div>

                      <h3 className="text-zinc-100 font-extrabold text-lg leading-tight tracking-wide transition-colors group-hover:text-white">
                        {game.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                        {game.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4">
                      {isSoon ? (
                        <button
                          disabled
                          className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-650 text-xs font-semibold rounded-xl select-none"
                        >
                          Заблокировано
                        </button>
                      ) : (
                        <Link href={game.playUrl ?? '/'}>
                          <AnimatedButton
                            variant="primary"
                            className={`w-full py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 rounded-xl border border-transparent
                              ${game.id === 'mafia' ? 'bg-rose-800 hover:bg-rose-700 shadow-rose-950/40 hover:border-rose-600/20' : 
                                'bg-blue-700 hover:bg-blue-600 shadow-blue-950/40 hover:border-blue-600/20'}`}
                          >
                            <span>Начать игру</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </AnimatedButton>
                        </Link>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Activity Sidebar & Featured Card (Right Column) */}
          <div className="space-y-6">
            
            {/* Weekend Tournament Banner */}
            <div className="relative p-6 rounded-[24px] bg-gradient-to-br from-purple-800 via-indigo-900 to-zinc-950 border border-purple-500/35 overflow-hidden shadow-[0_4px_25px_rgba(168,85,247,0.15)] flex flex-col justify-between h-44 select-none">
              {/* Background abstract details */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute left-1/3 bottom-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl" />

              <div className="space-y-1">
                <div className="flex items-center gap-1 bg-purple-500/25 border border-purple-400/25 w-max px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest text-purple-200">
                  <Trophy className="w-2.5 h-2.5 text-purple-300" />
                  <span>Турнир WePlay</span>
                </div>
                <h4 className="text-zinc-100 font-extrabold text-sm tracking-wide mt-1.5 leading-snug">
                  Турнир выходного дня
                </h4>
                <p className="text-purple-300 font-extrabold font-mono text-base mt-0.5">
                  Приз: 50,000 ₸
                </p>
              </div>

              <AnimatedButton variant="secondary" className="py-2 text-[10px] font-extrabold rounded-xl border-zinc-700/60 bg-zinc-900/60 hover:bg-zinc-800 w-max px-4 self-start">
                Участвовать
              </AnimatedButton>
            </div>

            {/* Live Activities List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-500" />
                  <span>Активность</span>
                </h3>
              </div>

              <GlassCard className="p-4 space-y-4 border-zinc-800/80 bg-[#111111]/70">
                {FAKE_FEED.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar seed={item.avatar} className="w-8 h-8 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-zinc-200 font-semibold truncate leading-tight">
                          {item.user}
                        </p>
                        <p className="text-zinc-500 text-[10px] mt-0.5">
                          {item.action} <span className="text-purple-400 font-semibold">{item.game}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-650 font-mono whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </GlassCard>
            </div>
            
          </div>
          
        </div>
        
      </div>
    </PageTransition>
  );
}
