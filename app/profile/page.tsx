'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShieldCheck, Heart, Coins, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/ui/PageTransition';
import Avatar from '@/components/ui/Avatar';

interface Gift {
  id: string;
  name: string;
  count: number;
  icon: string;
  desc: string;
}

const GIFTS: Gift[] = [
  { id: 'baursak', name: 'Баурсак', count: 42, icon: '🍪', desc: 'Золотистый кусочек жареного теста. Символ гостеприимства, восстанавливает силы игроков.' },
  { id: 'kumys', name: 'Кумыс', count: 12, icon: '🥛', desc: 'Традиционный напиток из кобыльего молока. Придает бодрость и очищает разум детектива.' },
  { id: 'dombra', name: 'Домбра', count: 2, icon: '🎸', desc: 'Национальный двухструнный инструмент. Поднимает дух команды во время тяжелых споров.' },
  { id: 'beshbarmak', name: 'Бешбармак', count: 5, icon: '🍲', desc: 'Культовое блюдо из мяса и тонкого теста. Сближает участников за общим столом.' }
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
      <div className="p-6 md:p-8 space-y-8 select-none max-w-4xl mx-auto pb-24 bg-[#1E1F22] min-h-screen">

        {/* Back navigation */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#B5BAC1] hover:text-[#FFFFFF] transition-colors p-1.5 bg-[#2B2D31] border border-[#3B3F45] rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-extrabold text-[#FFFFFF]">Мой профиль</span>
        </div>

        {/* Profile Card */}
        <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
          <Avatar seed="Мансур" className="w-20 h-20 border-2 border-[#5865F2]" />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl font-extrabold text-[#FFFFFF]">Мансур</span>
              <span className="w-max mx-auto sm:mx-0 px-2 py-0.5 bg-[#F1C40F] text-black text-[9px] font-extrabold rounded">
                VIP АККАУНТ
              </span>
            </div>

            <p className="text-xs text-[#5865F2] font-bold">Уровень 12 — Эксперт Дедукции</p>

            <div className="max-w-xs mx-auto sm:mx-0 space-y-1.5">
              <div className="flex justify-between text-[10px] text-[#B5BAC1] font-bold font-mono">
                <span>ПРОГРЕСС УРОВНЯ</span>
                <span>1,420 / 2,000 XP</span>
              </div>
              <div className="w-full h-1.5 bg-[#1E1F22] border border-[#3B3F45] rounded-full overflow-hidden">
                <div className="h-full bg-[#5865F2] rounded-full" style={{ width: '71%' }} />
              </div>
            </div>
          </div>

          <div className="px-5 py-4 bg-[#1E1F22] border border-[#3B3F45] rounded-2xl flex flex-col items-center justify-center gap-1 min-w-[120px]">
            <Coins className="w-5 h-5 text-[#F1C40F] mb-1" />
            <span className="text-[10px] text-[#B5BAC1] font-extrabold uppercase tracking-wider">Баланс</span>
            <span className="text-[#FFFFFF] font-extrabold font-mono text-base">4,567 ₸</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Всего игр', val: '142', color: '' },
            { label: 'Процент побед', val: '68%', color: 'text-[#23A55A]' },
            { label: 'Лучшая роль', val: 'Шпион', color: '' },
            { label: 'Репутация', val: '4.9 ★', color: 'text-[#F1C40F]' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 text-center">
              <span className="text-[9px] text-[#B5BAC1] font-bold uppercase tracking-wider block mb-1">{item.label}</span>
              <span className={`text-base font-extrabold text-[#FFFFFF] ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Gift Inventory */}
        <div className="space-y-4">
          <h3 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Национальные подарки</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GIFTS.map((g) => {
              const selected = selectedGift === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGift(selected ? null : g.id)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all relative outline-none select-none
                    ${selected
                      ? 'bg-[#5865F2]/10 border-[#5865F2]'
                      : 'bg-[#2B2D31] border-[#3B3F45] hover:border-[#5865F2]/50 hover:bg-[#35373C]'
                    }`}
                >
                  <span className="text-2xl mb-2">{g.icon}</span>
                  <span className="text-xs font-extrabold text-[#FFFFFF]">{g.name}</span>
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-[#1E1F22] border border-[#3B3F45] text-[9px] text-[#B5BAC1] font-bold font-mono rounded-full">
                    x{g.count}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeGift && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 text-xs leading-relaxed text-[#B5BAC1] max-w-lg"
              >
                <div className="font-bold text-[#FFFFFF] mb-1 flex items-center gap-1">
                  <span>{activeGift.name}</span>
                  <span className="text-[10px] text-[#B5BAC1]">({activeGift.count} шт.)</span>
                </div>
                {activeGift.desc}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Достижения</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0
                    ${item.isUnlocked
                      ? 'bg-[#5865F2]/10 border-[#5865F2]/30 text-[#5865F2]'
                      : 'bg-[#1E1F22] border-[#3B3F45] text-[#B5BAC1]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-[#FFFFFF] truncate">{item.title}</h4>
                      <span className="text-[9px] font-bold text-[#5865F2] font-mono whitespace-nowrap">{item.points}</span>
                    </div>
                    <p className="text-[11px] text-[#B5BAC1] leading-normal">{item.desc}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-[#B5BAC1] font-bold font-mono">
                        <span>ПРОГРЕСС</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#1E1F22] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.isUnlocked ? 'bg-[#5865F2]' : 'bg-[#3B3F45]'}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
