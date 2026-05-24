'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, User } from 'lucide-react';
import Avatar from './Avatar';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Главная', path: '/', icon: Home, activeRegex: /^\/$/ },
    { name: 'Игры', path: '/games/mafia', icon: Gamepad2, activeRegex: /^\/games/ },
    { name: 'Профиль', path: '/profile', icon: User, activeRegex: /^\/profile/ },
  ];

  const isLinkActive = (item: typeof navItems[0]) => {
    return item.activeRegex.test(pathname);
  };

  return (
    <>
      {/* Desktop Sidebar (Persistent Left Side) */}
      <aside className="hidden md:flex w-60 bg-[#111111]/90 backdrop-blur-md border-r border-zinc-800/80 flex-col justify-between fixed top-0 bottom-0 left-0 z-40 select-none">
        <div className="flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-850">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
                WePlay KZ
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                    ${
                      active
                        ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${active ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card Profile Section at Bottom */}
        <div className="p-4 border-t border-zinc-850">
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800/30"
          >
            <Avatar seed="Мансур" className="w-9 h-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-250 font-bold text-xs truncate">Мансур</span>
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[7px] font-extrabold rounded shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  VIP
                </span>
              </div>
              <span className="text-[10px] text-zinc-550 block font-mono">1,420 XP</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Tab Bar (Persistent Bottom Side) */}
      <nav className="md:hidden w-full h-16 fixed bottom-0 left-0 bg-[#111111]/95 border-t border-zinc-800/80 z-50 flex items-center justify-around px-4 select-none backdrop-blur-md">
        {navItems.map((item) => {
          const active = isLinkActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all
                ${active ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        {/* User Mobile Profile Tab */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all
            ${pathname === '/profile' ? 'text-purple-400' : 'text-zinc-400'}`}
        >
          <Avatar seed="Мансур" className="w-5 h-5" />
          <span>Профиль</span>
        </Link>
      </nav>
    </>
  );
}
