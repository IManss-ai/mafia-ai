'use client';

interface Props {
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

export default function TopBar({ onOpenProfile, onOpenSettings }: Props) {
  return (
    <div className="h-16 border-b border-gray-800 bg-gray-950/40 px-6 flex items-center justify-between">
      <div
        onClick={onOpenProfile}
        className="flex items-center gap-3 select-none cursor-pointer hover:bg-gray-900/40 px-2.5 py-1.5 rounded-xl transition-colors"
      >
        <span className="text-gray-100 font-bold text-sm">Мансур</span>
        <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-extrabold rounded-md shadow-[0_0_8px_rgba(245,158,11,0.3)]">
          VIP
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
          <span className="text-amber-500 text-xs font-bold font-mono">₸</span>
          <span className="text-gray-200 text-xs font-bold font-mono">4,567</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="text-gray-400 hover:text-gray-100 transition-colors p-1.5 rounded-lg hover:bg-gray-900/60"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
