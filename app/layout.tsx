import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Sidebar from '@/components/ui/Sidebar';
import './globals.css';

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'WePlay KZ — Алматинская Вечеринка',
  description: 'Премиум платформа дедуктивных парти-игр с умным ИИ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${geist.className} bg-[#0A0A0A] text-zinc-100 antialiased min-h-screen flex overflow-x-hidden`}>
        <Sidebar />
        <main className="flex-1 min-h-screen md:pl-60 pb-16 md:pb-0 flex flex-col relative w-full overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
