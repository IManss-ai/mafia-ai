'use client';

interface Friend {
  name: string;
  initials: string;
  color: string;
}

const FRIENDS: Friend[] = [
  { name: 'Айбек', initials: 'АЙ', color: 'bg-emerald-600' },
  { name: 'Диана', initials: 'ДИ', color: 'bg-rose-600' },
  { name: 'Аслан', initials: 'АС', color: 'bg-blue-600' },
  { name: 'Камилла', initials: 'КА', color: 'bg-violet-600' },
  { name: 'Темирлан', initials: 'ТЕ', color: 'bg-amber-600' },
  { name: 'Жанар', initials: 'ЖА', color: 'bg-indigo-650' },
  { name: 'Ержан', initials: 'ЕР', color: 'bg-teal-600' },
  { name: 'Алина', initials: 'АЛ', color: 'bg-orange-650' },
];

export default function FriendsList() {
  return (
    <div className="w-[240px] border-l border-gray-800/80 bg-gray-950/60 p-4 h-[calc(100vh-64px)] flex flex-col overflow-y-auto fixed right-0 top-16 z-30">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 select-none">
        Онлайн друзья
      </h3>
      <div className="space-y-3.5">
        {FRIENDS.map((f, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-900/30 p-1.5 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${f.color}`}>
                {f.initials}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors">
                {f.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
