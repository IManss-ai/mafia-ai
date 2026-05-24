'use client';
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Sword, Eye, Trophy, Coins, Users, Zap, ChevronRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8 select-none bg-[#1E1F22] min-h-screen text-[#FFFFFF]">

      {/* Top Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center pb-5 border-b border-[#3B3F45]"
      >
        <div className="flex items-center gap-2">
          <span className="font-black text-xl tracking-wider text-[#FFFFFF]">WePlay KZ</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2B2D31] border border-[#3B3F45] rounded-lg">
            <Coins className="w-4 h-4 text-[#F1C40F]" />
            <span className="text-xs font-bold font-mono text-[#FFFFFF]">4,567 ₸</span>
          </div>
          <Link href="/profile" className="flex items-center gap-2.5 hover:bg-[#2B2D31] p-1 rounded-lg transition-colors">
            <Avatar seed="Мансур" className="w-8 h-8" />
            <span className="hidden sm:inline text-xs font-bold text-[#FFFFFF]">Мансур</span>
          </Link>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-[#2B2D31] border border-[#3B3F45] p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/15 border border-teal-500/30 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              Powered by Google Gemini AI
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#FFFFFF] leading-tight">
              С возвращением,{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Мансур
              </span>
            </h1>
            <p className="text-sm text-[#B5BAC1] max-w-md leading-relaxed">
              Платформа социальных детективных игр с ИИ-персонажами. Допрашивайте жителей Алматы, разоблачайте шпионов.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/games/mafia">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-sm font-bold rounded-xl transition-colors"
              >
                Играть сейчас
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Игр сыграно', value: '142', color: 'text-[#FFFFFF]', icon: <Users className="w-5 h-5 text-[#14B8A6]" /> },
          { label: 'Процент побед', value: '68%', color: 'text-[#23A55A]', icon: <Trophy className="w-5 h-5 text-[#23A55A]" /> },
          { label: 'Серия побед', value: '5', color: 'text-[#F1C40F]', icon: <Trophy className="w-5 h-5 text-[#F1C40F]" /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider block">{stat.label}</span>
              <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
            </div>
            {stat.icon}
          </motion.div>
        ))}
      </div>

      {/* Daily Challenge Banner */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">Ежедневный вызов</span>
          <h3 className="text-sm font-black text-[#FFFFFF]">Разоблачи шпиона среди жителей Алматы за 3 раунда</h3>
          <p className="text-[10px] text-[#B5BAC1]">Награда за выполнение: +200 опыта</p>
        </div>
        <Link href="/games/spy">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-[#FFFFFF] text-xs font-bold rounded-xl transition-all"
          >
            Играть
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Games Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Доступные игры</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Mafia */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-[#2B2D31] border border-[#3B3F45] hover:border-[#F23F42]/40 rounded-2xl p-5 flex flex-col justify-between h-[240px] transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#F23F42]/10 border border-[#F23F42]/20 rounded-xl text-[#F23F42] group-hover:bg-[#F23F42]/15 transition-colors">
                    <Sword className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] text-[#B5BAC1] font-mono bg-[#1E1F22] px-2 py-1 rounded-full">124 онлайн</span>
                </div>
                <h3 className="text-base font-black text-[#FFFFFF] mt-2">Алматинская Мафия</h3>
                <p className="text-xs text-[#B5BAC1] leading-relaxed">
                  Допросите 6 жителей Кок-Тобе. Установите личности обоих убийц за три дня.
                </p>
              </div>
              <Link href="/games/mafia">
                <button className="w-full py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Начать игру <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </motion.div>

            {/* Spy */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-[#2B2D31] border border-[#3B3F45] hover:border-[#14B8A6]/40 rounded-2xl p-5 flex flex-col justify-between h-[240px] transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl text-[#14B8A6] group-hover:bg-[#14B8A6]/15 transition-colors">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] text-[#B5BAC1] font-mono bg-[#1E1F22] px-2 py-1 rounded-full">86 онлайн</span>
                </div>
                <h3 className="text-base font-black text-[#FFFFFF] mt-2">Кто Шпион?</h3>
                <p className="text-xs text-[#B5BAC1] leading-relaxed">
                  Задавайте наводящие вопросы и найдите скрытого шпиона по его неточным описаниям.
                </p>
              </div>
              <Link href="/games/spy">
                <button className="w-full py-2.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Начать игру <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Activity Feed */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-4"
        >
          <h2 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider px-1">Активность игроков</h2>
          <div className="bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 space-y-4">
            {ACTIVITIES.map((activity, idx) => (
              <div key={idx} className="flex justify-between items-center gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar seed={activity.user} className="w-7 h-7 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-zinc-200 font-bold truncate leading-snug">{activity.user}</p>
                    <p className="text-[#B5BAC1] text-[10px] mt-0.5">
                      {activity.action} <span className="text-[#14B8A6] font-semibold">{activity.game}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
