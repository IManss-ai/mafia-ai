'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { WORD_PAIRS } from '@/lib/wordPairs';
import { SPY_CHARACTERS } from '@/lib/spyCharacters';

interface Description {
  playerId: string;
  name: string;
  description: string;
}

export default function SpyPage() {
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<'playing' | 'voting' | 'reveal'>('playing');
  const [wordPair, setWordPair] = useState(WORD_PAIRS[0]);
  const [spyId, setSpyId] = useState('');
  const [playerWord, setPlayerWord] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [votedId, setVotedId] = useState<string | null>(null);

  // Initialize a fresh round
  const initRound = (nextRoundNum: number) => {
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setWordPair(pair);

    const playersList = ['player', 'aigeri', 'daniyar', 'zhanna', 'erbol'];
    const chosenSpy = playersList[Math.floor(Math.random() * playersList.length)];
    setSpyId(chosenSpy);

    setPlayerWord(chosenSpy === 'player' ? pair.spy : pair.civilian);

    const shuffledOrder = [...playersList].sort(() => Math.random() - 0.5);
    setOrder(shuffledOrder);

    setRound(nextRoundNum);
    setTurnIndex(0);
    setDescriptions([]);
    setGamePhase('playing');
    setVotedId(null);
    setInput('');
    setIsLoading(false);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  // Run AI Turn automatically
  useEffect(() => {
    if (gamePhase !== 'playing' || order.length === 0) return;
    const currentSpeakerId = order[turnIndex];
    if (!currentSpeakerId) return;

    if (currentSpeakerId !== 'player') {
      setIsLoading(true);
      const timer = setTimeout(() => {
        runAITurn(currentSpeakerId);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, turnIndex, order]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const runAITurn = async (characterId: string) => {
    const character = SPY_CHARACTERS.find(c => c.id === characterId)!;
    const isSpy = spyId === characterId;
    const word = isSpy ? wordPair.spy : wordPair.civilian;

    try {
      const res = await fetch('/api/spy/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          word,
          role: isSpy ? 'spy' : 'civilian',
          previousDescriptions: descriptions.map(d => ({
            name: d.name,
            description: d.description,
          })),
        }),
      });

      const data = await res.json();
      if (data.description) {
        setDescriptions(prev => [
          ...prev,
          { playerId: characterId, name: character.name, description: data.description },
        ]);
        if (turnIndex < 4) {
          setTurnIndex(prev => prev + 1);
        } else {
          setGamePhase('voting');
        }
      }
    } catch (err) {
      console.error('AI Describe error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;

    setDescriptions(prev => [
      ...prev,
      { playerId: 'player', name: 'Вы (Мансур)', description: msg },
    ]);
    setInput('');

    if (turnIndex < 4) {
      setTurnIndex(prev => prev + 1);
    } else {
      setGamePhase('voting');
    }
  };

  const handleVote = (targetId: string) => {
    setVotedId(targetId);
    setGamePhase('reveal');
  };

  const handleNextRound = () => {
    initRound(round + 1);
  };

  if (order.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 text-sm">Загрузка...</div>
      </div>
    );
  }

  const currentSpeakerId = order[turnIndex];
  const isPlayerTurn = currentSpeakerId === 'player' && gamePhase === 'playing';
  const won = votedId === spyId;

  // Retrieve matching UI color or details for suspects
  const getSuspectColor = (id: string) => {
    if (id === 'player') return 'bg-gradient-to-r from-amber-600 to-amber-700';
    return SPY_CHARACTERS.find(c => c.id === id)?.color ?? 'bg-gray-700';
  };

  const getSuspectName = (id: string) => {
    if (id === 'player') return 'Вы (Мансур)';
    return SPY_CHARACTERS.find(c => c.id === id)?.name ?? 'Житель';
  };

  const getSuspectProfession = (id: string) => {
    if (id === 'player') return 'Детектив в лобби';
    return SPY_CHARACTERS.find(c => c.id === id)?.profession ?? 'Подозреваемый';
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col text-gray-100 overflow-hidden relative">
      {/* Top Header info */}
      <div className="h-16 border-b border-gray-800 bg-gray-950/40 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-100 transition-colors p-1 bg-gray-900 rounded-lg border border-gray-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm font-bold text-gray-200">Раунд {round}</span>
        </div>

        <div className="px-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] select-none">
          <span className="text-gray-400 text-xs font-semibold">Твоё слово:</span>
          <span className="text-amber-400 text-xs font-bold font-mono tracking-wider">{playerWord.toUpperCase()}</span>
        </div>
      </div>

      {/* Main layout wrapper */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/10 via-gray-950 to-gray-950 -z-10 pointer-events-none" />

        {/* Center/Left column: suspects row + message stream */}
        <div className="flex-1 flex flex-col min-w-0 h-full justify-between p-6">
          
          {/* Top Avatars Row */}
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto w-full mb-6">
            {['player', 'aigeri', 'daniyar', 'zhanna', 'erbol'].map((id) => {
              const name = getSuspectName(id);
              const initials = name.slice(0, 2).toUpperCase();
              const color = getSuspectColor(id);
              const isCurrentSpeaker = currentSpeakerId === id && gamePhase === 'playing';
              const hasSpoken = descriptions.some(d => d.playerId === id);

              return (
                <div key={id} className="flex flex-col items-center relative">
                  <motion.div
                    animate={isCurrentSpeaker ? {
                      scale: [1, 1.06, 1],
                      boxShadow: '0 0 16px rgba(96, 165, 250, 0.6)',
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 select-none relative
                      ${color}
                      ${isCurrentSpeaker ? 'border-blue-400' : 'border-gray-800'}
                      ${hasSpoken && !isCurrentSpeaker ? 'opacity-80' : ''}
                    `}
                  >
                    {initials}
                    {hasSpoken && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-gray-950">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </motion.div>
                  <span className="text-[10px] text-gray-400 mt-2 font-medium truncate w-full text-center max-w-[64px]">
                    {name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Descriptions list area */}
          <div className="flex-1 bg-gray-900/40 border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-4 max-w-2xl mx-auto w-full">
            {descriptions.length === 0 && !isLoading && (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm select-none">
                Ожидание первого описания...
              </div>
            )}

            {descriptions.map((desc, idx) => {
              const isUser = desc.playerId === 'player';
              const color = getSuspectColor(desc.playerId);
              const initials = desc.name.slice(0, 2).toUpperCase();

              return (
                <div key={idx} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${color}`}>
                      {initials}
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    {!isUser && (
                      <span className="text-[10px] text-gray-500 ml-1 mb-1 font-medium">{desc.name}</span>
                    )}
                    <div
                      className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed
                        ${isUser
                          ? 'bg-gray-800 text-gray-100 rounded-tr-none border border-gray-700/60 shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                          : 'bg-gray-900 border border-gray-800/80 text-gray-200 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                        }`}
                    >
                      {desc.description}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-start justify-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${getSuspectColor(currentSpeakerId)}`}>
                  {getSuspectName(currentSpeakerId).slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 ml-1 mb-1 font-medium">{getSuspectName(currentSpeakerId)}</span>
                  <div className="bg-gray-900 border border-gray-800/80 text-gray-400 rounded-xl rounded-tl-none px-4 py-3 text-sm">
                    <span className="inline-flex gap-1 select-none">
                      <span className="animate-bounce [animation-delay:0ms]">.</span>
                      <span className="animate-bounce [animation-delay:150ms]">.</span>
                      <span className="animate-bounce [animation-delay:300ms]">.</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom input or message area */}
          <div className="mt-6 w-full max-w-2xl mx-auto">
            {isPlayerTurn && (
              <form onSubmit={handlePlayerSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Опиши своё слово одним коротким предложением..."
                  className="flex-1 bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-5 py-3 bg-blue-800 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
                >
                  Описать
                </button>
              </form>
            )}

            {!isPlayerTurn && gamePhase === 'playing' && (
              <div className="w-full py-3.5 bg-gray-900/40 border border-gray-800/60 rounded-xl text-center text-xs text-gray-500 select-none">
                {getSuspectName(currentSpeakerId)} придумывает описание...
              </div>
            )}

            {gamePhase === 'voting' && (
              <div className="w-full py-3 bg-red-950/20 border border-red-900/30 rounded-xl text-center text-xs text-red-400 font-semibold select-none shadow-[0_0_12px_rgba(239,68,68,0.05)]">
                Все описали слова. Проголосуйте за шпиона в панели справа!
              </div>
            )}
          </div>

        </div>

        {/* Right column: Voting panel or Reveal state */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-950/40 p-6 flex flex-col justify-between overflow-y-auto">
          {gamePhase !== 'reveal' ? (
            <div className="flex-1 flex flex-col">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 select-none">
                Голосование
              </h3>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed select-none">
                Внимательно изучите все описания. Выберите того игрока, чьё описание кажется вам неподходящим или подозрительным.
              </p>

              <div className="space-y-2">
                {['aigeri', 'daniyar', 'zhanna', 'erbol'].map((id) => {
                  const name = getSuspectName(id);
                  const initials = name.slice(0, 2).toUpperCase();
                  const color = getSuspectColor(id);
                  const profession = getSuspectProfession(id);
                  const isVotable = gamePhase === 'voting';

                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all select-none
                        ${isVotable ? 'border-gray-800 bg-gray-900/30' : 'border-gray-900 bg-gray-900/10 opacity-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${color}`}>
                          {initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-200">{name}</div>
                          <div className="text-[10px] text-gray-500">{profession}</div>
                        </div>
                      </div>

                      {isVotable && (
                        <button
                          onClick={() => handleVote(id)}
                          className="px-3 py-1.5 bg-red-800/80 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Выбрать
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="space-y-6 text-center py-6">
                <div className="text-gray-500 text-xs uppercase tracking-widest select-none">Результат раунда</div>
                
                <h2 className={`text-2xl font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
                  {won ? 'Вы победили!' : 'Вы проиграли!'}
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed select-none">
                  {won
                    ? `Вы верно вычислили шпиона! Им был ${getSuspectName(spyId)}.`
                    : `Вы не смогли поймать шпиона. Шпионом был ${getSuspectName(spyId)}.`}
                </p>

                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-left space-y-3.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] select-none">
                  <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Слово мирных:</span>
                    <span className="text-gray-300 font-bold font-mono uppercase">{wordPair.civilian}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-500">Слово шпиона:</span>
                    <span className="text-amber-400 font-bold font-mono uppercase">{wordPair.spy}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
              >
                Следующий раунд
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
