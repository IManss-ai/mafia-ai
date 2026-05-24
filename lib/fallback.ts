import { Villager } from './types';

export function buildFallbackReply(villager: Villager, day: number): string {
  const alibi = villager.role === 'mafia' ? villager.fakeAlibi : villager.alibi;
  const dayNote = day > 1 ? ` Уже день ${day}, а вы всё возвращаетесь к одному и тому же.` : '';

  switch (villager.id) {
    case 'aigeri':
      return `Ну типа, я уже сказала: ${alibi}${dayNote}`;
    case 'daniyar':
      return `${alibi} Проверяйте, если надо.${dayNote}`;
    case 'zhanna':
      return `Я понимаю ваши подозрения, но повторю: ${alibi}${dayNote}`;
    case 'erbol':
      return `По факту всё просто: ${alibi}${dayNote}`;
    case 'serik':
      return `${alibi} Не был там.${dayNote}`;
    case 'dina':
      return `Смотри, я не путаюсь: ${alibi}${dayNote}`;
    default:
      return `${alibi}${dayNote}`;
  }
}

export function buildFallbackNight(
  targets: { id: string; name: string }[],
  day: number
) {
  const target = targets[(day - 1) % targets.length];
  const places = [
    'возле станции метро Абая',
    'у старого входа на Кок-Тобе',
    'рядом с пустой парковкой у Dostyk Plaza',
  ];
  const place = places[(day - 1) % places.length];

  return {
    killedVillagerId: target.id,
    narration: `Утром ${target.name} нашли ${place}, и город снова сделал вид, что ничего не заметил.`,
  };
}
