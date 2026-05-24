'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';
import { WORD_PAIRS } from '@/lib/wordPairs';
import { SPY_CHARACTERS } from '@/lib/spyCharacters';
import PageTransition from '@/components/ui/PageTransition';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Avatar from '@/components/ui/Avatar';
import PulseRing from '@/components/ui/PulseRing';

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
  const [aiVotes, setAiVotes] = useState<Record<string, string>>({});

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
    setAiVotes({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, turnIndex, order]);

  const runAITurn = async (characterId: string) => {
    const isSpy = spyId === characterId;
    const word = isSpy ? wordPair.spy : wordPair.civilian;
    const character = SPY_CHARACTERS.find(c => c.id === characterId)!;

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
    
    // Simulate AI votes
    const playersList = ['player', 'aigeri', 'daniyar', 'zhanna', 'erbol'];
    const simulatedVotes: Record<string, string> = {};
    
    playersList.forEach((charId) => {
      if (charId === 'player') return;
      
      const isSpy = spyId === charId;
      if (isSpy) {
        const targets = playersList.filter(p => p !== charId);
        simulatedVotes[charId] = targets[Math.floor(Math.random() * targets.length)];
      } else {
        if (Math.random() < 0.75) {
          simulatedVotes[charId] = spyId;
        } else {
          const targets = playersList.filter(p => p !== charId);
          simulatedVotes[charId] = targets[Math.floor(Math.random() * targets.length)];
        }
      }
    });
    
    setAiVotes(simulatedVotes);
    setGamePhase('reveal');
  };

  const handleNextRound = () => {
    initRound(round + 1);
  };

  if (order.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentSpeakerId = order[turnIndex];
  const isPlayerTurn = currentSpeakerId === 'player' && gamePhase === 'playing';
  const won = votedId === spyId;

  const getSuspectName = (id: string) => {
    if (id === 'player') return 'Вы (Мансур)';
    return SPY_CHARACTERS.find(c => c.id === id)?.name ?? 'Житель';
  };

  const getSuspectProfession = (id: string) => {
    if (id === 'player') return 'Детектив в лобби';
    return SPY_CHARACTERS.find(c => c.id === id)?.profession ?? 'Подозреваемый';
  };

  const getSuspectAvatarSeed = (id: string) => {
    if (id === 'player') return 'Мансур';
    return SPY_CHARACTERS.find(c => c.id === id)?.name ?? 'Житель';
  };

  return (
    <PageTransition>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-[#0A0A0A] border-l border-zinc-900/60 relative select-none">
        
        {/* Game Top Navigation Info */}
        <div className="h-16 border-b border-zinc-800 bg-[#111111]/30 px-6 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-xs font-extrabold text-zinc-300">Раунд {round}</span>
          </div>

          {/* Large Monospace Word Pill Badge */}
          <div className="px-4 py-1.5 bg-purple-950/40 border border-purple-500/30 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.15)] flex items-center gap-2">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Слово:</span>
            <span className="text-zinc-100 text-xs font-extrabold tracking-widest font-mono">
              {playerWord.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Outer Split Layout Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Left Column: Center Stage & Speech Bubble */}
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            
            {/* Active Turn Progress Text */}
            {gamePhase === 'playing' && (
              <div className="flex justify-center select-none">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold">
                  Ход: <span className="text-purple-400 font-extrabold">{getSuspectName(currentSpeakerId)}</span>
                </span>
              </div>
            )}

            {/* Central Stage: 5 Avatars in a Row */}
            <div className="flex items-center justify-center gap-6 md:gap-8 my-6">
              {['player', 'aigeri', 'daniyar', 'zhanna', 'erbol'].map((id) => {
                const name = getSuspectName(id);
                const isCurrentSpeaker = currentSpeakerId === id && gamePhase === 'playing';
                const hasSpoken = descriptions.some(d => d.playerId === id);
                const seed = getSuspectAvatarSeed(id);

                return (
                  <div key={id} className="flex flex-col items-center">
                    <PulseRing active={isCurrentSpeaker} color={id === 'player' ? 'purple' : 'blue'}>
                      <div className="relative">
                        <Avatar
                          seed={seed}
                          className={`w-14 h-14 md:w-16 md:h-16 border-2 transition-transform duration-300
                            ${isCurrentSpeaker ? 'border-purple-500 scale-105' : 'border-zinc-800'}
                            ${hasSpoken && !isCurrentSpeaker ? 'opacity-70' : ''}`}
                        />
                        {hasSpoken && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            <UserCheck className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                    </PulseRing>
                    <span className="text-[10px] text-zinc-400 mt-2 font-bold max-w-[64px] truncate text-center">
                      {name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Speech Bubble Display */}
            {gamePhase === 'playing' && (
              <div className="flex-1 max-h-32 flex items-center justify-center">
                <div className="w-full max-w-lg bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl relative backdrop-blur-sm text-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-zinc-900 border-t border-l border-zinc-800 rotate-45" />
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Активная речь</span>
                  {isLoading ? (
                    <div className="flex gap-1 items-center justify-center py-2 select-none">
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <p className="text-zinc-200 text-sm font-semibold italic leading-relaxed">
                      {descriptions[descriptions.length - 1] 
                        ? `« ${descriptions[descriptions.length - 1].description} »` 
                        : 'Ожидание начала раунда...'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Turn feedback Banner / Inputs */}
            <div className="w-full max-w-lg mx-auto mt-6">
              {isPlayerTurn && (
                <form onSubmit={handlePlayerSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Опиши своё слово одним коротким предложением..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-purple-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
                  />
                  <AnimatedButton
                    type="submit"
                    disabled={!input.trim()}
                    variant="primary"
                    className="px-5 py-3 text-xs font-bold rounded-xl"
                  >
                    Описать
                  </AnimatedButton>
                </form>
              )}

              {!isPlayerTurn && gamePhase === 'playing' && (
                <div className="w-full py-3.5 bg-zinc-900/40 border border-zinc-800/40 rounded-xl text-center text-xs text-zinc-500 font-semibold">
                  {getSuspectName(currentSpeakerId)} придумывает описание...
                </div>
              )}

              {gamePhase === 'voting' && (
                <div className="w-full py-3 bg-rose-950/20 border border-rose-900/35 rounded-xl text-center text-xs text-rose-400 font-bold">
                  Все описали слова. Проголосуйте за шпиона на панели справа!
                </div>
              )}
            </div>

            {/* Scrollable Dialogue History */}
            <div className="mt-6 flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-4 max-w-lg mx-auto w-full max-h-[180px]">
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block border-b border-zinc-850 pb-2">История раунда</span>
              {descriptions.length === 0 && (
                <div className="h-20 flex items-center justify-center text-zinc-650 text-xs">
                  История пуста. Завершите первый ход.
                </div>
              )}
              {descriptions.map((desc, idx) => {
                const isUser = desc.playerId === 'player';
                const avatar = getSuspectAvatarSeed(desc.playerId);

                return (
                  <div key={idx} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && <Avatar seed={avatar} className="w-7 h-7 flex-shrink-0" />}
                    <div className="flex flex-col max-w-[80%]">
                      {!isUser && <span className="text-[9px] text-zinc-500 ml-1 mb-1 font-semibold">{desc.name}</span>}
                      <div className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed
                        ${isUser 
                          ? 'bg-purple-950/20 border border-purple-550/20 text-purple-250 rounded-tr-none' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'}`}>
                        {desc.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Voting / Confetti Reveal Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-800 bg-[#111111]/30 p-6 flex flex-col justify-between overflow-y-auto">
            {gamePhase !== 'reveal' ? (
              <div className="flex-1 flex flex-col">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Голосование</h3>
                <p className="text-zinc-400 text-xs mb-5 leading-relaxed">
                  Изучите все описания. Выберите того игрока, чьё слово отличается от вашей ассоциации.
                </p>

                <div className="space-y-2">
                  {['aigeri', 'daniyar', 'zhanna', 'erbol'].map((id) => {
                    const name = getSuspectName(id);
                    const profession = getSuspectProfession(id);
                    const seed = getSuspectAvatarSeed(id);
                    const isVotable = gamePhase === 'voting';

                    return (
                      <div
                        key={id}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all
                          ${isVotable ? 'border-zinc-800 bg-zinc-900/35 hover:border-zinc-700/80' : 'border-zinc-900 bg-zinc-900/10 opacity-40'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar seed={seed} className="w-8 h-8 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-200 truncate">{name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{profession}</div>
                          </div>
                        </div>

                        {isVotable && (
                          <AnimatedButton
                            onClick={() => handleVote(id)}
                            variant="danger"
                            className="py-1 px-3 text-[10px] font-extrabold rounded-lg"
                          >
                            Голос
                          </AnimatedButton>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between h-full">
                <div className="space-y-6 text-center py-4">
                  <span className="text-zinc-550 text-[10px] uppercase font-bold tracking-[0.2em]">Результат</span>
                  
                  <h2 className={`text-2xl font-extrabold tracking-tight ${won ? 'text-purple-400 animate-pulse' : 'text-rose-500'}`}>
                    {won ? 'Вы победили!' : 'Вы проиграли!'}
                  </h2>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {won
                      ? `Вы верно вычислили шпиона! Им был ${getSuspectName(spyId)}.`
                      : `Вы не смогли поймать шпиона. Шпионом был ${getSuspectName(spyId)}.`}
                  </p>

                  {/* Confetti / Coins reward modal animation */}
                  {won && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-950/20 to-indigo-950/30 border border-purple-500/30 rounded-2xl relative overflow-hidden shadow-[0_0_16px_rgba(168,85,247,0.05)] select-none"
                    >
                      {/* Floating coin icons */}
                      <div className="absolute inset-0 pointer-events-none opacity-25">
                        <motion.span
                          animate={{ y: [30, -10], opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                          className="absolute left-6 text-purple-400 text-xs font-bold font-mono"
                        >
                          ₸
                        </motion.span>
                        <motion.span
                          animate={{ y: [40, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
                          className="absolute right-8 text-purple-400 text-[10px] font-bold font-mono"
                        >
                          ₸
                        </motion.span>
                      </div>

                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_20px_rgba(168,85,247,0.45)] border border-purple-300 select-none mb-2"
                      >
                        ₸
                      </motion.div>
                      <span className="text-purple-400 font-bold text-xs tracking-wide">+150 ₸ за победу</span>
                    </motion.div>
                  )}

                  {/* Voted display */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left space-y-3 shadow-lg select-none">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-850 pb-2">Голоса игроков</span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-medium">Вы (Мансур)</span>
                        <span className="text-zinc-200 font-bold">→ {getSuspectName(votedId ?? '')}</span>
                      </div>
                      {Object.entries(aiVotes).map(([voterId, targetId]) => (
                        <div key={voterId} className="flex items-center justify-between">
                          <span className="text-zinc-500 font-medium">{getSuspectName(voterId)}</span>
                          <span className="text-zinc-200 font-bold">→ {getSuspectName(targetId)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Word display details */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs border-b border-zinc-850 pb-2 select-none">
                      <span className="text-zinc-500 font-medium">Мирные:</span>
                      <span className="text-zinc-200 font-bold font-mono uppercase">{wordPair.civilian}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 select-none">
                      <span className="text-zinc-500 font-medium">Шпион:</span>
                      <span className="text-purple-400 font-bold font-mono uppercase">{wordPair.spy}</span>
                    </div>
                  </div>
                </div>

                <AnimatedButton
                  onClick={handleNextRound}
                  variant="primary"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl mt-4"
                >
                  Следующий раунд
                </AnimatedButton>
              </div>
            )}
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
