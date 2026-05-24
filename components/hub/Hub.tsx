'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import AvatarCircle from './AvatarCircle';
import GameCard from './GameCard';
import FriendsList from './FriendsList';

export default function Hub() {
  const [onlineCount, setOnlineCount] = useState(234);
  const [radius, setRadius] = useState(125);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  // Settings states
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState('night-almaty');

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * (300 - 180 + 1)) + 180);

    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 85 : 125);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ringAvatars = [
    { initials: 'АЙ', name: 'Айбек', color: 'bg-emerald-600', angle: 0 },
    { initials: 'ДИ', name: 'Диана', color: 'bg-rose-650', angle: 60 },
    { initials: 'АС', name: 'Аслан', color: 'bg-blue-600', angle: 120 },
    { initials: 'КА', name: 'Камилла', color: 'bg-violet-600', angle: 180 },
    { initials: 'ТЕ', name: 'Темирлан', color: 'bg-amber-650', angle: 240 },
    { initials: 'ЖА', name: 'Жанар', color: 'bg-indigo-600', angle: 300 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden text-gray-100 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#1a1a1a] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_top,_rgba(10,10,10,0.15),_transparent)] pointer-events-none -z-10 opacity-10">
        <svg className="absolute bottom-0 w-full text-gray-800/10 h-32 fill-current" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,160 L120,130 C240,100,480,40,720,60 C960,80,1200,180,1320,230 L1440,280 L1440,300 L1320,300 C1200,300,960,300,720,300 C480,300,240,300,120,300 L0,300 Z" />
        </svg>
      </div>

      <TopBar onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} />

      <div className="flex-1 flex overflow-hidden pt-16">
        <div className="flex-1 flex flex-col justify-between py-4 px-6 overflow-y-auto md:pr-[240px]">
          {/* Header Party Label */}
          <div className="flex justify-center mt-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold select-none">
              Алматинская вечеринка
            </span>
          </div>

          {/* Circular Room */}
          <div className="flex-1 flex items-center justify-center relative min-h-[280px]">
            <div className="absolute w-[170px] h-[170px] md:w-[250px] md:h-[250px] border border-gray-800/40 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] border border-gray-800/40 rounded-full" />
            </div>

            <button onClick={() => setShowProfile(true)} className="absolute z-10 hover:scale-105 active:scale-95 transition-all outline-none focus:outline-none">
              <AvatarCircle
                initials="МА"
                name="Вы (Мансур)"
                color="bg-gradient-to-r from-amber-600 to-amber-700"
                size="lg"
                isCenter={true}
              />
            </button>

            {ringAvatars.map((av, idx) => {
              const rad = (av.angle * Math.PI) / 180;
              const x = radius * Math.cos(rad);
              const y = radius * Math.sin(rad);

              return (
                <div
                  key={idx}
                  className="absolute z-0 transition-transform duration-300"
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

          {/* Glowing Activity Banner */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-2 bg-gray-900/60 border border-amber-500/35 rounded-full text-xs text-amber-400 font-semibold select-none shadow-[0_0_15px_rgba(245,158,11,0.12)] flex items-center gap-1.5 backdrop-blur-md">
              <span>🎲 Сейчас играют {onlineCount} человека</span>
            </div>
          </div>

          {/* Game Selection Carousel */}
          <div className="w-full flex flex-col space-y-3">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider select-none px-1">
              Игры на вечеринке
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1 md:justify-center md:overflow-x-visible md:pb-0 select-none">
              <div className="snap-center">
                <GameCard
                  title="Алматинская Мафия"
                  subtitle="Вычислите двух мафиози среди 6 жителей Кок-Тобе."
                  playUrl="/mafia"
                />
              </div>
              <div className="snap-center">
                <GameCard
                  title="Кто Шпион?"
                  subtitle="Найдите шпиона среди жителей Алматы."
                  playUrl="/spy"
                />
              </div>
              <div className="snap-center">
                <GameCard
                  title="Угадай Слово"
                  subtitle="Разгадывайте казахские слова с умным ИИ."
                  isSoon={true}
                />
              </div>
              <div className="snap-center">
                <GameCard
                  title="Айтыс"
                  subtitle="Импровизируйте в поэтическом поединке с ИИ."
                  isSoon={true}
                />
              </div>
              <div className="snap-center">
                <GameCard
                  title="Каракол"
                  subtitle="Разгадайте тайны Чарынского каньона."
                  isSoon={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <FriendsList />
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowProfile(false);
              setSelectedGift(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                <h3 className="text-gray-100 font-bold text-base select-none">Профиль игрока</h3>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setSelectedGift(null);
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Profile Card */}
                <div className="flex items-center gap-4 bg-gray-950/40 p-4 border border-gray-800/80 rounded-xl relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white text-lg font-bold border-2 border-amber-400 select-none shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                    МА
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-100 font-bold text-base">Мансур</span>
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[8px] font-extrabold rounded">VIP</span>
                    </div>
                    <div className="text-xs text-amber-500/95 font-semibold mt-1 select-none">Уровень 12 — Эксперт Дедукции</div>
                    <div className="w-36 h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-950/20 border border-gray-800/60 rounded-xl p-3">
                    <div className="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Всего Игр</div>
                    <div className="text-gray-100 text-lg font-bold mt-1">142</div>
                  </div>
                  <div className="bg-gray-950/20 border border-gray-800/60 rounded-xl p-3">
                    <div className="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Процент Побед</div>
                    <div className="text-green-400 text-lg font-bold mt-1">68%</div>
                  </div>
                </div>

                {/* Kazakh Gifts section */}
                <div className="space-y-3">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider select-none">Казахские подарки</div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { id: 'baursak', name: 'Баурсак', count: 42, color: 'bg-amber-800/20 border-amber-900/50 text-amber-400' },
                      { id: 'kumys', name: 'Кумыс', count: 12, color: 'bg-blue-800/20 border-blue-900/50 text-blue-400' },
                      { id: 'dombra', name: 'Домбра', count: 2, color: 'bg-violet-800/20 border-violet-900/50 text-violet-400' },
                      { id: 'beshbarmak', name: 'Бешбармак', count: 5, color: 'bg-rose-800/20 border-rose-900/50 text-rose-400' }
                    ].map((gift) => (
                      <button
                        key={gift.id}
                        onClick={() => setSelectedGift(selectedGift === gift.id ? null : gift.id)}
                        className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all relative outline-none focus:outline-none
                          ${selectedGift === gift.id 
                            ? 'bg-gray-800 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.25)]' 
                            : 'bg-gray-950/40 border-gray-800 hover:border-gray-700'
                          }`}
                      >
                        <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${gift.color} mb-1.5`}>
                          {gift.name.slice(0, 1)}
                        </span>
                        <span className="text-[10px] text-gray-200 font-semibold">{gift.name}</span>
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-gray-950 border border-gray-800 text-gray-400 text-[8px] font-mono rounded-full font-bold">x{gift.count}</span>
                      </button>
                    ))}
                  </div>

                  {/* Gift description preview */}
                  <AnimatePresence mode="wait">
                    {selectedGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-950/40 border border-gray-800/60 rounded-xl p-3 mt-3 text-xs leading-relaxed text-gray-400 select-none"
                      >
                        {
                          [
                            { id: 'baursak', desc: 'Баурсак — золотистый кусочек жареного теста. Символ гостеприимства, восстанавливает силы.' },
                            { id: 'kumys', desc: 'Кумыс — традиционный напиток из кобыльего молока. Придает бодрость и очищает разум.' },
                            { id: 'dombra', desc: 'Домбра — национальный струнный инструмент. Играет кюи и поднимает дух команды.' },
                            { id: 'beshbarmak', desc: 'Бешбармак — культовое блюдо из мяса и тонкого теста. Сближает игроков за дастарханом.' }
                          ].find(g => g.id === selectedGift)?.desc
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-800 bg-gray-950/20 flex gap-3">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setSelectedGift(null);
                  }}
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs font-semibold rounded-xl transition-colors outline-none focus:outline-none"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                <h3 className="text-gray-100 font-bold text-base select-none">Настройки лобби</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                <div className="space-y-4">
                  {[
                    { label: 'Звуковые эффекты', value: sfxEnabled, setter: setSfxEnabled },
                    { label: 'Музыка в лобби', value: musicEnabled, setter: setMusicEnabled },
                    { label: 'Озвучка (TTS)', value: voiceEnabled, setter: setVoiceEnabled }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs select-none">
                      <span className="text-gray-300 font-medium">{item.label}</span>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center outline-none focus:outline-none
                          ${item.value ? 'bg-amber-500' : 'bg-gray-800'}`}
                      >
                        <motion.div
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-4 h-4 bg-white rounded-full shadow"
                          style={{ marginLeft: item.value ? 'auto' : '0px' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 select-none">
                  <label className="text-gray-500 text-[9px] uppercase font-bold tracking-wider block">Тема оформления</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="night-almaty">Ночной Алматы</option>
                    <option value="cyberpunk-astana">Киберпанк Астана</option>
                    <option value="medeo-ultra">Медео Ультра</option>
                  </select>
                </div>

                <div className="border-t border-gray-800/80 pt-4">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      alert('История игр успешно очищена.');
                      setShowSettings(false);
                      window.location.reload();
                    }}
                    className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 text-xs font-semibold rounded-xl transition-all outline-none focus:outline-none"
                  >
                    Сбросить историю игр
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 bg-gray-950/20">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-100 text-xs font-semibold rounded-xl transition-colors outline-none focus:outline-none"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
