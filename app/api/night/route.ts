import { NextRequest, NextResponse } from 'next/server';
import { callGeminiForJSON } from '@/lib/gemini';
import { buildNightPrompt } from '@/lib/prompts';
import { NightRequest, NightResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: NightRequest = await req.json();
    const { aliveVillagers, mafiaIds, dayNumber } = body;

    const mafiaVillagers = aliveVillagers.filter(v => mafiaIds.includes(v.id));
    const targets = aliveVillagers.filter(v => !mafiaIds.includes(v.id));

    if (targets.length === 0) {
      return NextResponse.json({ error: 'No targets available' }, { status: 400 });
    }

    const prompt = buildNightPrompt(
      mafiaVillagers.map(v => v.name),
      targets,
      dayNumber
    );

    const result = await callGeminiForJSON(prompt) as NightResponse;

    if (!result.killedVillagerId || !result.narration) {
      throw new Error('Invalid response structure from Gemini');
    }

    if (!targets.some(t => t.id === result.killedVillagerId)) {
      result.killedVillagerId = targets[Math.floor(Math.random() * targets.length)].id;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('/api/night error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
