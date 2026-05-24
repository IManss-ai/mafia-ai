'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage, Villager } from '@/lib/types';

interface Props {
  villager: Villager;
  history: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatPanel({ villager, history, onSendMessage, isLoading }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;
    setInput('');
    await onSendMessage(msg);
  };

  const handleChipClick = async (chipText: string) => {
    if (isLoading) return;
    await onSendMessage(chipText);
  };

  const getMockTime = (index: number) => {
    const baseHour = 20;
    const totalMinutes = index * 3;
    const hour = (baseHour + Math.floor(totalMinutes / 60)) % 24;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const initials = villager.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-[#1E1F22]">
      {/* Panel Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#3B3F45] bg-[#2B2D31]">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color}`}>
          {initials}
        </div>
        <div>
          <div className="text-sm font-bold text-[#FFFFFF]">{villager.name}</div>
          <div className="text-[11px] text-[#B5BAC1]">{villager.profession}</div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center select-none">
            <p className="text-[#B5BAC1] text-xs text-center max-w-xs leading-relaxed">
              Подозреваемый готов к диалогу. Выберите быструю подсказку снизу или напишите свой вопрос.
            </p>
          </div>
        )}
        {history.map((msg, i) => {
          const isUser = msg.role === 'user';
          const timeStr = getMockTime(i);
          return (
            <div key={i} className={`flex gap-2.5 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${villager.color}`}>
                  {initials}
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                {!isUser && (
                  <span className="text-[10px] text-[#B5BAC1] ml-1 mb-1 font-medium">{villager.name}</span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative flex flex-col
                    ${isUser
                      ? 'bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-[#FFFFFF] rounded-tr-none'
                      : 'bg-[#2B2D31] border border-[#3B3F45] text-[#FFFFFF] rounded-tl-none'
                    }`}
                >
                  <p className="pr-12">{msg.content}</p>
                  <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[9px] text-[#B5BAC1] font-mono select-none">
                    <span>{timeStr}</span>
                    {isUser && <span className="text-[#14B8A6] font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-2.5 items-start justify-start">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${villager.color}`}>
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#B5BAC1] ml-1 mb-1 font-medium">{villager.name}</span>
              <div className="bg-[#2B2D31] border border-[#3B3F45] text-[#B5BAC1] rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                <span className="inline-flex gap-1 select-none">
                  <span className="animate-bounce [animation-delay:0ms]">.</span>
                  <span className="animate-bounce [animation-delay:150ms]">.</span>
                  <span className="animate-bounce [animation-delay:300ms]">.</span>
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area + chips */}
      <div className="border-t border-[#3B3F45] bg-[#2B2D31] p-4 space-y-3">
        {!isLoading && (
          <div className="flex flex-wrap gap-1.5">
            {[
              'Где твоё алиби?',
              'Кто твой напарник?',
              'Где ты был в 22:00?',
              'Кого ты подозреваешь?',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="bg-[#1E1F22] hover:bg-[#35373C] border border-[#3B3F45] hover:border-[#14B8A6]/50 text-[10px] font-semibold text-[#B5BAC1] px-3 py-1.5 rounded-full transition-all active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Задайте вопрос..."
            disabled={isLoading}
            className="flex-1 bg-[#1E1F22] border border-[#3B3F45] text-[#FFFFFF] placeholder-[#B5BAC1] rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#14B8A6] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Спросить
          </button>
        </form>
      </div>
    </div>
  );
}
