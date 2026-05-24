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
    <div className="flex flex-col h-full bg-gray-950/20">
      {/* Panel Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gray-950/40">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color} shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]`}>
          {initials}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-100">{villager.name}</div>
          <div className="text-[11px] text-gray-400">{villager.profession}</div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center select-none">
            <p className="text-gray-600 text-xs text-center max-w-xs leading-relaxed">
              Подозреваемый готов к диалогу. Выберите быструю подсказку снизу или напишите свой кастомный вопрос.
            </p>
          </div>
        )}
        {history.map((msg, i) => {
          const isUser = msg.role === 'user';
          const timeStr = getMockTime(i);
          return (
            <div key={i} className={`flex gap-2.5 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${villager.color} shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]`}>
                  {initials}
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                {!isUser && (
                  <span className="text-[10px] text-gray-500 ml-1 mb-1 font-medium">{villager.name}</span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative flex flex-col
                    ${isUser
                      ? 'bg-gray-850 border border-gray-700/60 text-gray-100 rounded-tr-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                      : 'bg-gray-900 border border-gray-850 text-gray-200 rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                    }`}
                >
                  <p className="pr-12 text-gray-200">{msg.content}</p>
                  <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[9px] text-gray-500 font-mono select-none">
                    <span>{timeStr}</span>
                    {isUser && <span className="text-blue-400 font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-2.5 items-start justify-start">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${villager.color} shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]`}>
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 ml-1 mb-1 font-medium">{villager.name}</span>
              <div className="bg-gray-900 border border-gray-850 text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
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
      <div className="border-t border-gray-850 bg-gray-950/20 p-4 space-y-3">
        {/* Quick Suggestion Chips */}
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
                className="bg-gray-900/60 hover:bg-gray-800/60 border border-gray-800 hover:border-gray-700/80 text-[10px] font-semibold text-gray-300 px-3 py-1.5 rounded-full transition-all active:scale-95"
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
            className="flex-1 bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-gray-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            Спросить
          </button>
        </form>
      </div>
    </div>
  );
}
