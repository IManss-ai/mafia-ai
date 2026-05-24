'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldCheck, Heart, Coins, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/ui/PageTransition';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';

interface Gift {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: string;
  desc: string;
}

const GIFTS: Gift[] = [
  { id: 'baursak', name: 'Баурсак', count: 42, color: 'bg-amber-800/20 border-amber-900/50 text-amber-400', icon: '🍪', desc: 'Золотистый кусочек жареного теста. Символ гостеприимства, восстанавливает силы игроков.' },
  { id: 'kumys', name: 'Кумыс', count: 12, color: 'bg-blue-800/20 border-blue-900/50 text-blue-400', icon: '🥛', desc: 'Традиционный напиток из кобыльего молока. Придает бодрость и очищает разум детектива.' },
  { id: 'dombra', name: 'Домбра', count: 2, color: 'bg-violet-800/20 border-violet-900/50 text-violet-400', icon: '🎸', desc: 'Национальный двухструнный инструмент. Поднимает дух команды во время тяжелых споров.' },
  { id: 'beshbarmak', name: 'Бешбармак', count: 5, color: 'bg-rose-800/20 border-rose-900/50 text-rose-400', icon: '🍲', desc: 'Культовое блюдо из мяса и тонкого теста. Сближает участников за общим столом.' }
];

const ACHIEVEMENTS = [
  { title: 'Детектив-ветеран', desc: 'Разоблачил 50 мафиози в Алматы', progress: 100, isUnlocked: true, points: '+500 XP', icon: ShieldCheck },
  { title: 'Ловец шпионов', desc: 'Выиграл 10 раундов в Кто Шпион?', progress: 100, isUnlocked: true, points: '+300 XP', icon: Trophy },
  { title: 'Щедрый гость', desc: 'Подарил 20 баурсаков другим игрокам', progress: 65, isUnlocked: false, points: '+150 XP', icon: Heart },
  { title: 'Золотой акын', desc: 'Одержал победу в поэтическом поединке Айтыс', progress: 0, isUnlocked: false, points: '+400 XP', icon: Sparkles }
];

export default function ProfilePage() {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const activeGift = GIFTS.find(g => g.id === selectedGift) ?? null;

  return (
    <PageTransition>
      <div className="p-6 md:p-8 space-y-8 select-none max-w-4xl mx-auto pb-24">
        
        {/* Profile Navigation Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-extrabold text-zinc-300">Мой профиль</span>
        </div>

        {/* Profile Card Summary Banner */}
        <GlassCard className="flex flex-col sm:flex-row gap-6 items-center p-6 border-zinc-800 bg-[#111111]/85 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
          <Avatar seed="Мансур" className="w-20 h-20 border-2 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.2)]" />
          
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl font-extrabold text-white">Мансур</span>
              <span className="w-max mx-auto sm:mx-0 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-450 text-black text-[9px] font-extrabold rounded shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                VIP АККАУНТ
              </span>
            </div>
            
            <p className="text-xs text-purple-400 font-bold">Уровень 12 — Эксперт Дедукции</p>
            
            <div className="max-w-xs mx-auto sm:mx-0 space-y-1.5">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold font-mono">
                <span>ПРОГРЕСС УРОВНЯ</span>
                <span>1,420 / 2,000 XP</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>
          </div>

          {/* Player Balance Card */}
          <div className="px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1 min-w-[120px] shadow-inner">
            <Coins className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Баланс</span>
            <span className="text-zinc-100 font-extrabold font-mono text-base">4,567 ₸</span>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Всего игр', val: '142' },
            { label: 'Процент побед', val: '68%', color: 'text-emerald-400' },
            { label: 'Лучшая роль', val: 'Шпион' },
            { label: 'Репутация', val: '4.9 ★' }
          ].map((item, idx) => (
            <GlassCard key={idx} className="p-4 border-zinc-800 text-center bg-[#111111]/70">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">{item.label}</span>
              <span className={`text-base font-extrabold text-zinc-100 ${item.color ?? ''}`}>{item.val}</span>
            </GlassCard>
          ))}
        </div>

        {/* Inventory Kazakh Gifts Grid */}
        <div className="space-y-4">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-1">Национальные подарки</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GIFTS.map((g) => {
              const selected = selectedGift === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGift(selected ? null : g.id)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all relative outline-none select-none
                    ${selected 
                      ? 'bg-purple-950/15 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                      : 'bg-[#111111]/70 border-zinc-800 hover:border-zinc-700/80'
                    }`}
                >
                  <span className="text-2xl mb-2">{g.icon}</span>
                  <span className="text-xs font-extrabold text-zinc-200">{g.name}</span>
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 font-bold font-mono rounded-full">
                    x{g.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Gift description preview panel */}
          <AnimatePresence mode="wait">
            {activeGift && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-xs leading-relaxed text-zinc-400 max-w-lg select-none"
              >
                <div className="font-bold text-zinc-250 mb-1 flex items-center gap-1">
                  <span>{activeGift.name}</span>
                  <span className="text-[10px] text-zinc-550">({activeGift.count} шт.)</span>
                </div>
                {activeGift.desc}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievements List */}
        <div className="space-y-4">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-1">Достижения</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <GlassCard key={idx} className="p-4 border-zinc-800/80 bg-[#111111]/70 flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0
                    ${item.isUnlocked 
                      ? 'bg-purple-950/20 border-purple-500/35 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                      : 'bg-zinc-900 border-zinc-850 text-zinc-650'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-zinc-200 truncate">{item.title}</h4>
                      <span className="text-[9px] font-bold text-purple-400 font-mono whitespace-nowrap">{item.points}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">{item.desc}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-zinc-600 font-bold font-mono">
                        <span>ПРОГРЕСС</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.isUnlocked ? 'bg-purple-500' : 'bg-zinc-700'}`}
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
