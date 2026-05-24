'use client';
import React from 'react';
import Link from 'next/link';
import { Sword, Eye, Trophy, Coins, Users } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import PageTransition from '@/components/ui/PageTransition';

interface FakeActivity {
  user: string;
  action: string;
  game: string;
  time: string;
}

const ACTIVITIES: FakeActivity[] = [
  { user: 'Айбек', action: 'играет в', game: 'Алматинская Мафия', time: '1 мин назад' },
  { user: 'Диана', action: 'создала лобби', game: 'Кто Шпион?', time: '3 мин назад' },
  { user: 'Аслан', action: 'завершил раунд в', game: 'Кто Шпион?', time: '5 мин назад' },
  { user: 'Камилла', action: 'пригласила друзей в', game: 'Мафию', time: '8 мин назад' },
  { user: 'Темирлан', action: 'играет в', game: 'Алматинская Мафия', time: '12 мин назад' },
];

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto p-6 space-y-6 select-none bg-[#1E1F22] min-h-screen text-[#FFFFFF]">
        
        {/* Top Header Bar */}
        <header className="flex justify-between items-center pb-4 border-b border-[#3B3F45]">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-wider text-[#FFFFFF]">
              WePlay KZ
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2B2D31] border border-[#3B3F45] rounded-lg">
              <Coins className="w-4 h-4 text-[#F1C40F]" />
              <span className="text-xs font-bold font-mono text-[#FFFFFF]">4,567 ₸</span>
            </div>

            {/* Profile trigger */}
            <Link href="/profile" className="flex items-center gap-2.5 hover:bg-[#2B2D31] p-1 rounded-lg transition-colors">
              <Avatar seed="Мансур" className="w-8 h-8" />
              <span className="hidden sm:inline text-xs font-bold text-[#FFFFFF]">Мансур</span>
            </Link>
          </div>
        </header>

        {/* Welcome message */}
        <div className="py-2">
          <h1 className="text-2xl font-black tracking-tight text-[#FFFFFF]">
            С возвращением, Мансур
          </h1>
          <p className="text-xs text-[#B5BAC1] mt-1">
            Платформа интеллектуальных игр для вас и ваших друзей.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider block">Игр сыграно</span>
              <span className="text-lg font-black text-[#FFFFFF]">142</span>
            </div>
            <Users className="w-5 h-5 text-[#5865F2]" />
          </div>

          <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider block">Процент побед</span>
              <span className="text-lg font-black text-[#23A55A]">68%</span>
            </div>
            <Trophy className="w-5 h-5 text-[#23A55A]" />
          </div>

          <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider block">Серия побед</span>
              <span className="text-lg font-black text-[#F1C40F]">5</span>
            </div>
            <Trophy className="w-5 h-5 text-[#F1C40F]" />
          </div>
        </div>

        {/* Daily Challenge Banner (Horizontal card) */}
        <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#5865F2] uppercase tracking-wider">Ежедневный вызов</span>
            <h3 className="text-sm font-black text-[#FFFFFF]">Разоблачи шпиона среди жителей Алматы за 3 раунда</h3>
            <p className="text-[10px] text-[#B5BAC1]">Награда за выполнение: +200 опыта</p>
          </div>
          <Link href="/games/spy">
            <button className="w-full sm:w-auto px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] active:scale-[0.98] text-[#FFFFFF] text-xs font-bold rounded-xl transition-all">
              Играть
            </button>
          </Link>
        </div>

        {/* Main Content Grid (Games + Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Active 2-column Games Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Доступные игры</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Game 1: Mafia */}
              <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-5 flex flex-col justify-between h-[220px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#F23F42]/10 border border-[#F23F42]/20 rounded-xl text-[#F23F42]">
                      <Sword className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] text-[#B5BAC1] font-mono">124 онлайн</span>
                  </div>
                  <h3 className="text-sm font-black text-[#FFFFFF] mt-2">Алматинская Мафия</h3>
                  <p className="text-xs text-[#B5BAC1] leading-relaxed">
                    Допросите 6 жителей Кок-Тобе. Установите личности обоих убийц за три дня.
                  </p>
                </div>
                <Link href="/games/mafia">
                  <button className="w-full py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold rounded-xl transition-colors">
                    Играть
                  </button>
                </Link>
              </div>

              {/* Game 2: Spy */}
              <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-5 flex flex-col justify-between h-[220px]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-xl text-[#5865F2]">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] text-[#B5BAC1] font-mono">86 онлайн</span>
                  </div>
                  <h3 className="text-sm font-black text-[#FFFFFF] mt-2">Кто Шпион?</h3>
                  <p className="text-xs text-[#B5BAC1] leading-relaxed">
                    Задавайте наводящие вопросы и найдите скрытого шпиона по его неточным описаниям.
                  </p>
                </div>
                <Link href="/games/spy">
                  <button className="w-full py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold rounded-xl transition-colors">
                    Играть
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: Fake Live Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Активность игроков</h2>
            
            <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 space-y-4">
              {ACTIVITIES.map((activity, idx) => (
                <div key={idx} className="flex justify-between items-center gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar seed={activity.user} className="w-7 h-7 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-zinc-200 font-bold truncate leading-snug">
                        {activity.user}
                      </p>
                      <p className="text-[#B5BAC1] text-[10px] mt-0.5">
                        {activity.action} <span className="text-[#5865F2] font-semibold">{activity.game}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
