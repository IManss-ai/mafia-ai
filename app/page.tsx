import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-gray-600 text-xs uppercase tracking-widest">Алматы. Сегодня утром.</div>
          <h1 className="text-4xl font-bold text-gray-100">Алматинская Мафия</h1>
        </div>

        <p className="text-gray-400 leading-relaxed">
          У фонтана на Кок-Тобе нашли тело Алмаса. Шестеро были рядом прошлой ночью. Двое из них убийцы. У вас три дня чтобы их найти.
        </p>

        <Link
          href="/game"
          className="inline-block px-8 py-4 bg-red-800 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Начать расследование
        </Link>

        <div className="text-gray-700 text-xs">
          Один детектив. Шесть подозреваемых. Два убийцы.
        </div>
      </div>
    </main>
  );
}
