'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  title: string;
  subtitle: string;
  gradient: string;
  playUrl?: string;
  isSoon?: boolean;
}

export default function GameCard({ title, subtitle, gradient, playUrl, isSoon = false }: Props) {
  const cardContent = (
    <div className={`h-48 w-64 rounded-2xl p-5 border border-gray-800 flex flex-col justify-between select-none relative overflow-hidden bg-gradient-to-b ${gradient}`}>
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      <div>
        <h3 className="text-gray-100 font-bold text-lg leading-tight">{title}</h3>
        <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{subtitle}</p>
      </div>
      <div>
        {isSoon ? (
          <button
            disabled
            className="w-full py-2 bg-gray-900/60 text-gray-500 text-xs font-semibold rounded-xl transition-all cursor-not-allowed select-none"
          >
            Скоро
          </button>
        ) : (
          <button
            className="w-full py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors select-none"
          >
            Играть
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.15 }}
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
