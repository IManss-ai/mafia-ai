'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import AvatarCircle from './AvatarCircle';
import GameCard from './GameCard';
import FriendsList from './FriendsList';

export default function Hub() {
  const [onlineCount, setOnlineCount] = useState(234);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const diff = Math.floor(Math.random() * 21) - 10;
        const next = prev + diff;
        return Math.max(180, Math.min(300, next));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const ringAvatars = [
    { initials: 'АЙ', name: 'Айбек', color: 'bg-emerald-600', angle: 0 },
    { initials: 'ДИ', name: 'Диана', color: 'bg-rose-600', angle: 72 },
    { initials: 'АС', name: 'Аслан', color: 'bg-blue-600', angle: 144 },
    { initials: 'КА', name: 'Камилла', color: 'bg-violet-600', angle: 216 },
    { initials: 'ТЕ', name: 'Темирлан', color: 'bg-amber-600', angle: 288 },
  ];

  const R = 110;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-gray-950 flex flex-col overflow-hidden text-gray-100 relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-gray-950 to-gray-950 -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_top,_rgba(15,23,42,0.1),_transparent)] pointer-events-none -z-10">
        <svg className="absolute bottom-0 w-full text-gray-900/10 h-32 fill-current" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,160 L120,130 C240,100,480,40,720,60 C960,80,1200,180,1320,230 L1440,280 L1440,300 L1320,300 C1200,300,960,300,720,300 C480,300,240,300,120,300 L0,300 Z" />
        </svg>
      </div>

      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
          <div className="flex justify-center">
            <div className="px-4 py-1.5 bg-gray-900/60 border border-gray-800 rounded-full text-xs text-green-400 font-medium select-none shadow-[0_0_12px_rgba(74,222,128,0.1)]">
              Сейчас онлайн: {onlineCount} игроков
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
            <div className="absolute w-[240px] h-[240px] border border-gray-800/40 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-[120px] h-[120px] border border-gray-800/40 rounded-full" />
            </div>

            <AvatarCircle
              initials="МА"
              name="Вы (Мансур)"
              color="bg-gradient-to-r from-amber-600 to-amber-700"
              size="lg"
              isCenter={true}
              className="absolute z-10 animate-pulse"
            />

            {ringAvatars.map((av, idx) => {
              const rad = (av.angle * Math.PI) / 180;
              const x = R * Math.cos(rad);
              const y = R * Math.sin(rad);

              return (
                <div
                  key={idx}
                  className="absolute z-0"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <AvatarCircle
                    initials={av.initials}
                    name={av.name}
                    color={av.color}
                  />
                </div>
              );
            })}
          </div>

          <div className="w-full flex flex-col space-y-3">
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider select-none">
              Игры на платформе
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-none">
              <GameCard
                title="Алматинская Мафия"
                subtitle="Допроси 6 жителей на Кок-Тобе. Вычисли двух мафиози в Russian-Almaty сеттинге."
                gradient="from-red-950/40 to-black"
                playUrl="/mafia"
              />
              <GameCard
                title="Кто Шпион?"
                subtitle="Местный шпионский баттл слов. Найди шпиона среди пяти жителей Алматы."
                gradient="from-blue-950/40 to-black"
                playUrl="/spy"
              />
              <GameCard
                title="Угадай Слово"
                subtitle="Скоростное разгадывание казахских слов и ассоциаций с умным ИИ."
                gradient="from-gray-900/40 to-black"
                isSoon={true}
              />
              <GameCard
                title="Айтыс AI"
                subtitle="Интерактивный поэтический айтыс-поединок с импровизацией."
                gradient="from-gray-900/40 to-black"
                isSoon={true}
              />
              <GameCard
                title="Каракол"
                subtitle="Головоломка побега и дедукции в подземельях Чарынского каньона."
                gradient="from-gray-900/40 to-black"
                isSoon={true}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <FriendsList />
        </div>
      </div>
    </motion.div>
  );
}
