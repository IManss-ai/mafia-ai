'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { WORD_PAIRS } from '@/lib/wordPairs';
import { SPY_CHARACTERS } from '@/lib/spyCharacters';
import PageTransition from '@/components/ui/PageTransition';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Avatar from '@/components/ui/Avatar';

interface Description {
  playerId: string;
  name: string;
  description: string;
}

const AI_IDS = ['aigeri', 'daniyar', 'zhanna', 'erbol'];
const ALL_IDS = ['player', ...AI_IDS];

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
  const confettiFired = useRef(false);

  const initRound = (nextRoundNum: number) => {
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    setWordPair(pair);

    // Player is always civilian — spy is always one of the AI characters
    const chosenSpy = AI_IDS[Math.floor(Math.random() * AI_IDS.length)];
    setSpyId(chosenSpy);
    setPlayerWord(pair.civilian);

    const shuffledOrder = [...ALL_IDS].sort(() => Math.random() - 0.5);
    setOrder(shuffledOrder);

    setRound(nextRoundNum);
    setTurnIndex(0);
    setDescriptions([]);
    setGamePhase('playing');
    setVotedId(null);
    setAiVotes({});
    setInput('');
    setIsLoading(false);
    confettiFired.current = false;
  };

  useEffect(() => {
    initRound(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confetti on win
  useEffect(() => {
    if (gamePhase === 'reveal' && votedId === spyId && !confettiFired.current) {
      confettiFired.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      });
    }
  }, [gamePhase, votedId, spyId]);

  // Auto-run AI turns
  useEffect(() => {
    if (gamePhase !== 'playing' || order.length === 0) return;
    const currentSpeakerId = order[turnIndex];
    if (!currentSpeakerId || currentSpeakerId === 'player') return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      runAITurn(currentSpeakerId);
    }, 1800);
    return () => clearTimeout(timer);
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
        setTurnIndex(prev => {
          const next = prev + 1;
          if (next >= ALL_IDS.length) {
            setGamePhase('voting');
            return prev;
          }
          return next;
        });
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

    setTurnIndex(prev => {
      const next = prev + 1;
      if (next >= ALL_IDS.length) {
        setGamePhase('voting');
        return prev;
      }
      return next;
    });
  };

  const handleVote = (targetId: string) => {
    setVotedId(targetId);

    const simulatedVotes: Record<string, string> = {};
    AI_IDS.forEach((charId) => {
      const isSpy = spyId === charId;
      if (isSpy) {
        const targets = ALL_IDS.filter(p => p !== charId);
        simulatedVotes[charId] = targets[Math.floor(Math.random() * targets.length)];
      } else {
        simulatedVotes[charId] = Math.random() < 0.75
          ? spyId
          : ALL_IDS.filter(p => p !== charId)[Math.floor(Math.random() * (ALL_IDS.length - 1))];
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
      <div className="min-h-screen bg-[#1E1F22] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
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
    if (id === 'player') return 'Детектив';
    return SPY_CHARACTERS.find(c => c.id === id)?.profession ?? 'Подозреваемый';
  };

  const getSuspectAvatarSeed = (id: string) => {
    if (id === 'player') return 'Мансур';
    return SPY_CHARACTERS.find(c => c.id === id)?.name ?? 'Житель';
  };

  return (
    <PageTransition>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-[#1E1F22] relative select-none">

        {/* Top Bar */}
        <div className="h-12 border-b border-[#3B3F45] bg-[#2B2D31] px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#B5BAC1] hover:text-[#FFFFFF] transition-colors p-1.5 bg-[#1E1F22] border border-[#3B3F45] rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-[#B5BAC1]">Кто Шпион? — Раунд {round}</span>
          </div>

          {/* Word badge */}
          <div className="px-3 py-1 bg-[#2B2D31] border border-[#3B3F45] rounded-full flex items-center gap-2">
            <span className="text-[10px] text-[#B5BAC1] font-bold uppercase tracking-wider">Слово:</span>
            <span className="text-[#FFFFFF] text-xs font-extrabold tracking-widest font-mono">
              {playerWord.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Left: Avatars + Speech + Input */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-6">

            {/* Turn indicator */}
            {gamePhase === 'playing' && (
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#B5BAC1] font-bold">
                  Ход: <span className="text-[#14B8A6] font-extrabold">{getSuspectName(currentSpeakerId)}</span>
                </span>
              </div>
            )}

            {/* Avatars row */}
            <div className="flex items-center justify-center gap-4 md:gap-6">
              {ALL_IDS.map((id) => {
                const name = getSuspectName(id);
                const isCurrentSpeaker = currentSpeakerId === id && gamePhase === 'playing';
                const hasSpoken = descriptions.some(d => d.playerId === id);
                const seed = getSuspectAvatarSeed(id);

                return (
                  <div key={id} className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar
                        seed={seed}
                        className={`w-12 h-12 md:w-14 md:h-14 border-2 transition-transform duration-300
                          ${isCurrentSpeaker ? 'border-[#14B8A6] scale-105' : 'border-[#3B3F45]'}
                          ${hasSpoken && !isCurrentSpeaker ? 'opacity-60' : ''}`}
                      />
                      {hasSpoken && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#23A55A] rounded-full flex items-center justify-center border-2 border-[#1E1F22]">
                          <UserCheck className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#B5BAC1] mt-2 font-bold max-w-[56px] truncate text-center">
                      {name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Speech bubble */}
            {gamePhase === 'playing' && (
              <div className="flex items-center justify-center">
                <div className="w-full max-w-lg bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-5 text-center relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-[#2B2D31] border-t border-l border-[#3B3F45] rotate-45" />
                  <span className="text-[9px] text-[#B5BAC1] font-extrabold uppercase tracking-widest block mb-2">Активная речь</span>
                  {isLoading ? (
                    <div className="flex gap-1 items-center justify-center py-2">
                      <span className="w-2.5 h-2.5 bg-[#14B8A6] rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2.5 h-2.5 bg-[#14B8A6] rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2.5 h-2.5 bg-[#14B8A6] rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <p className="text-[#FFFFFF] text-sm font-semibold italic leading-relaxed">
                      {descriptions[descriptions.length - 1]
                        ? `« ${descriptions[descriptions.length - 1].description} »`
                        : 'Ожидание начала раунда...'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Player input / status */}
            <div className="w-full max-w-lg mx-auto">
              {isPlayerTurn && (
                <form onSubmit={handlePlayerSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Опиши своё слово одним коротким предложением..."
                    className="flex-1 bg-[#2B2D31] border border-[#3B3F45] text-[#FFFFFF] placeholder-[#B5BAC1] rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#14B8A6]"
                  />
                  <AnimatedButton
                    type="submit"
                    disabled={!input.trim()}
                    variant="primary"
                    className="px-5 py-3 text-xs font-bold"
                  >
                    Описать
                  </AnimatedButton>
                </form>
              )}

              {!isPlayerTurn && gamePhase === 'playing' && (
                <div className="w-full py-3 bg-[#2B2D31] border border-[#3B3F45] rounded-xl text-center text-xs text-[#B5BAC1] font-semibold">
                  {getSuspectName(currentSpeakerId)} придумывает описание...
                </div>
              )}

              {gamePhase === 'voting' && (
                <div className="w-full py-3 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-xl text-center text-xs text-[#14B8A6] font-bold">
                  Все описали слова. Проголосуйте за шпиона на панели справа!
                </div>
              )}
            </div>

            {/* Description history */}
            <div className="flex-1 bg-[#2B2D31] border border-[#3B3F45] rounded-2xl p-4 overflow-y-auto space-y-3 max-w-lg mx-auto w-full max-h-[200px]">
              <span className="text-[9px] text-[#B5BAC1] font-extrabold uppercase tracking-wider block border-b border-[#3B3F45] pb-2">История раунда</span>
              {descriptions.length === 0 && (
                <div className="h-16 flex items-center justify-center text-[#B5BAC1] text-xs">
                  История пуста. Завершите первый ход.
                </div>
              )}
              {descriptions.map((desc, idx) => {
                const isUser = desc.playerId === 'player';
                const avatar = getSuspectAvatarSeed(desc.playerId);

                return (
                  <div key={idx} className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && <Avatar seed={avatar} className="w-6 h-6 flex-shrink-0" />}
                    <div className="flex flex-col max-w-[80%]">
                      {!isUser && <span className="text-[9px] text-[#B5BAC1] ml-1 mb-0.5 font-semibold">{desc.name}</span>}
                      <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed
                        ${isUser
                          ? 'bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-[#FFFFFF] rounded-tr-none'
                          : 'bg-[#1E1F22] border border-[#3B3F45] text-[#FFFFFF] rounded-tl-none'}`}>
                        {desc.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Voting sidebar */}
          <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-[#3B3F45] bg-[#2B2D31] p-5 flex flex-col overflow-y-auto">
            {gamePhase !== 'reveal' ? (
              <div className="flex-1 flex flex-col">
                <h3 className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider mb-3">Голосование</h3>
                <p className="text-[#B5BAC1] text-xs mb-4 leading-relaxed">
                  Выберите того игрока, чьё описание кажется неточным.
                </p>

                <div className="space-y-2">
                  {AI_IDS.map((id) => {
                    const name = getSuspectName(id);
                    const profession = getSuspectProfession(id);
                    const seed = getSuspectAvatarSeed(id);
                    const isVotable = gamePhase === 'voting';

                    return (
                      <div
                        key={id}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all
                          ${isVotable ? 'border-[#3B3F45] bg-[#1E1F22] hover:border-[#14B8A6]/50 hover:bg-[#35373C]' : 'border-[#3B3F45] bg-[#1E1F22] opacity-40'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar seed={seed} className="w-8 h-8 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#FFFFFF] truncate">{name}</div>
                            <div className="text-[10px] text-[#B5BAC1] truncate">{profession}</div>
                          </div>
                        </div>

                        {isVotable && (
                          <button
                            onClick={() => handleVote(id)}
                            className="py-1 px-3 text-[10px] font-extrabold rounded-lg bg-[#F23F42] hover:bg-red-600 text-white transition-colors"
                          >
                            Голос
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                <div className="text-center space-y-3 py-2">
                  <span className="text-[#B5BAC1] text-[10px] uppercase font-bold tracking-[0.2em]">Результат</span>

                  <h2 className={`text-2xl font-extrabold tracking-tight ${won ? 'text-[#23A55A]' : 'text-[#F23F42]'}`}>
                    {won ? 'Вы победили!' : 'Вы проиграли!'}
                  </h2>

                  <p className="text-xs text-[#B5BAC1] leading-relaxed">
                    {won
                      ? `Верно! Шпионом был ${getSuspectName(spyId)}.`
                      : `Шпион скрылся. Им был ${getSuspectName(spyId)}.`}
                  </p>

                  {won && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center p-4 bg-[#23A55A]/10 border border-[#23A55A]/30 rounded-2xl"
                    >
                      <span className="text-[#23A55A] font-bold text-sm">+150 ₸ за победу</span>
                    </motion.div>
                  )}
                </div>

                {/* Votes */}
                <div className="bg-[#1E1F22] border border-[#3B3F45] rounded-2xl p-4 space-y-2">
                  <span className="text-[9px] text-[#B5BAC1] font-bold uppercase tracking-wider block border-b border-[#3B3F45] pb-2">Голоса</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#B5BAC1] font-medium">Вы (Мансур)</span>
                      <span className="text-[#FFFFFF] font-bold">→ {getSuspectName(votedId ?? '')}</span>
                    </div>
                    {Object.entries(aiVotes).map(([voterId, targetId]) => (
                      <div key={voterId} className="flex items-center justify-between">
                        <span className="text-[#B5BAC1] font-medium">{getSuspectName(voterId)}</span>
                        <span className="text-[#FFFFFF] font-bold">→ {getSuspectName(targetId)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Word reveal */}
                <div className="bg-[#1E1F22] border border-[#3B3F45] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-[#3B3F45] pb-2">
                    <span className="text-[#B5BAC1] font-medium">Мирные:</span>
                    <span className="text-[#FFFFFF] font-bold font-mono uppercase">{wordPair.civilian}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#B5BAC1] font-medium">Шпион знал:</span>
                    <span className="text-[#14B8A6] font-bold font-mono uppercase">{wordPair.spy}</span>
                  </div>
                </div>

                <AnimatedButton
                  onClick={handleNextRound}
                  variant="primary"
                  className="w-full py-3 font-bold mt-auto"
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
