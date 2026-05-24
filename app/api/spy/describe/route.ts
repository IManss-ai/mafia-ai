import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { buildSpyDescribePrompt } from '@/lib/prompts';
import { SPY_CHARACTERS } from '@/lib/spyCharacters';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { characterId, word, role, previousDescriptions } = body;

    const character = SPY_CHARACTERS.find(c => c.id === characterId);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const systemPrompt = buildSpyDescribePrompt(character, word, role, previousDescriptions);

    try {
      const response = await callGemini(systemPrompt, [], 'Пожалуйста, опиши свое слово.');
      return NextResponse.json({ description: response.trim() });
    } catch (err) {
      console.error('/api/spy/describe Gemini error:', err);
      // Clean, character-appropriate fallbacks when the Gemini API is unavailable/throttled
      let fallback = '';
      if (characterId === 'aigeri') {
        fallback = 'Ну типа, это супер бодрящая тема, с утра вообще залетает.';
      } else if (characterId === 'daniyar') {
        fallback = 'Часто вижу это в городе. Полезная штука, когда торопишься.';
      } else if (characterId === 'zhanna') {
        fallback = 'Это сложная географическая или органическая вещь, крайне популярная у нас.';
      } else if (characterId === 'erbol') {
        fallback = 'По факту literally топчик, юзаю почти каждый день для разгона.';
      } else {
        fallback = 'Очень популярное явление у нас в Алматы, все об этом знают.';
      }
      return NextResponse.json({ description: fallback, fallback: true });
    }
  } catch (err) {
    console.error('/api/spy/describe error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
