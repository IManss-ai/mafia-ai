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

  const initials = villager.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${villager.color}`}>
          {initials}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-100">{villager.name}</div>
          <div className="text-xs text-gray-400">{villager.profession}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <p className="text-gray-600 text-sm text-center mt-8">
            Начните допрос. Задайте вопрос.
          </p>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-800 text-gray-200'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Задайте вопрос..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-gray-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
          >
            Спросить
          </button>
        </div>
      </form>
    </div>
  );
}
