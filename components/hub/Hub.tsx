'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import AvatarCircle from './AvatarCircle';
import GameCard from './GameCard';
import FriendsList from './FriendsList';

export default function Hub() {
  const [onlineCount, setOnlineCount] = useState(234);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  // Settings states
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState('night-almaty');

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

      <TopBar onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} />

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
