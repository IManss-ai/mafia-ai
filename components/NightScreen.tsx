'use client';

interface Props {
  narration: string | null;
  onContinue: () => void;
}

export default function NightScreen({ narration, onContinue }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-40 p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-gray-600 text-xs uppercase tracking-widest">Ночь в Алматы</div>
        <h1 className="text-2xl font-bold text-gray-100">Наступила ночь.</h1>
        <p className="text-gray-500">Город спит. Убийцы не спят.</p>

        {narration ? (
          <div className="space-y-6 mt-4">
            <div className="w-px h-6 bg-gray-800 mx-auto" />
            <p className="text-gray-200">{narration}</p>
            <div className="w-px h-6 bg-gray-800 mx-auto" />
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm rounded-lg transition-colors"
            >
              Продолжить расследование
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-4">
            <span>Город в тревоге</span>
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>
    </div>
  );
}
