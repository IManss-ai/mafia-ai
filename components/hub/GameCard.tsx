'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  title: string;
  subtitle: string;
  playUrl?: string;
  isSoon?: boolean;
}

export default function GameCard({ title, subtitle, playUrl, isSoon = false }: Props) {
  const cardContent = (
    <div className="h-[240px] w-[200px] rounded-[24px] p-4 border border-gray-800 flex flex-col justify-between select-none relative bg-[#1a1a1a] shadow-lg">
      <div className="flex flex-col">
        <h3 className="text-gray-100 font-extrabold text-base leading-tight mt-1">{title}</h3>
        <p className="text-gray-400 text-[11px] mt-2 leading-relaxed">{subtitle}</p>
      </div>
      <div>
        {isSoon ? (
          <button
            disabled
            className="w-full py-2.5 bg-gray-900 text-gray-650 text-xs font-semibold rounded-xl transition-all cursor-not-allowed select-none border border-gray-850"
          >
            Скоро
          </button>
        ) : (
          <button
            className="w-full py-2.5 bg-red-800 hover:bg-red-750 text-white text-xs font-semibold rounded-xl transition-colors select-none shadow-[0_2px_8px_rgba(153,27,27,0.3)]"
          >
            Играть
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0"
    >
      {playUrl && !isSoon ? (
        <Link href={playUrl} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
