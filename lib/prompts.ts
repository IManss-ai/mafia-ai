import { Villager } from './types';

interface GameContext {
  day: number;
  aliveVillagerIds: string[];
  exiledIds: string[];
  killedIds: string[];
}

export function buildCivilianPrompt(villager: Villager, ctx: GameContext): string {
  return `Ты ${villager.name}, ${villager.age} лет, ${villager.profession}. Живёшь в Алматы.
Стиль речи: ${villager.voicePrompt}
Прошлой ночью убили твоего знакомого Алмаса у фонтана на Кок-Тобе.
Ты НЕ убивал и не знаешь кто это сделал. Ты невиновен.
Где ты был ночью: ${villager.alibi}.
Тебя допрашивает детектив. Отвечай искренне, как обычный человек.
Не выходи из роли. Не упоминай что ты ИИ. Говори 1-3 предложения максимум.
Не используй эмодзи. Пиши как живой алматинец.
Сейчас идёт день ${ctx.day} расследования.`;
}

export function buildMafiaPrompt(villager: Villager, partnerName: string, ctx: GameContext): string {
  return `Ты ${villager.name}, ${villager.age} лет, ${villager.profession}. Живёшь в Алматы.
Стиль речи: ${villager.voicePrompt}
ВАЖНО: ты один из двух убийц Алмаса. Твой напарник — ${partnerName}.
Никогда не признавайся. Никогда не выдавай напарника.
Твоё ложное алиби: ${villager.fakeAlibi}. Держись его последовательно.
Если детектив ловит тебя на противоречии, выкручивайся естественно.
Не выходи из роли. Не упоминай что ты ИИ. Говори 1-3 предложения максимум.
Не используй эмодзи. Не пали слишком очевидно, но и не слишком хладнокровно.
Веди себя как обычный человек, которому неприятно что подозревают именно его.
Сейчас идёт день ${ctx.day} расследования.`;
}

export function buildNightPrompt(
  mafiaNames: string[],
  targets: { id: string; name: string }[],
  day: number
): string {
  return `Ты — коллективный разум двух убийц: ${mafiaNames.join(' и ')}.
Вы уже убили Алмаса. Сейчас конец дня ${day} в Алматы.
Детектив ведёт расследование и скоро может вас разоблачить.
Выберите одну жертву из оставшихся жителей: ${targets.map(v => `${v.name} (id: ${v.id})`).join(', ')}.
Выбирайте тактически: убейте того, кто кажется самым опасным свидетелем.
Ответь ТОЛЬКО в формате JSON без лишнего текста:
{"killedVillagerId": "id_жертвы", "narration": "Утром нашли [имя] [место в Алматы]. Одно предложение по-русски без эмодзи."}`;
}
