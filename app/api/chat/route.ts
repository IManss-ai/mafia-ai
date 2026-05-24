import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { buildCivilianPrompt, buildMafiaPrompt } from '@/lib/prompts';
import { buildFallbackReply } from '@/lib/fallback';
import { ChatRequest, Villager } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { villagerId, chatHistory, newMessage, gameState, villagers } = body;

    const villager = villagers.find((v: Villager) => v.id === villagerId);
    if (!villager) {
      return NextResponse.json({ error: 'Villager not found' }, { status: 404 });
    }

    if (villager.status !== 'alive') {
      return NextResponse.json({ error: 'Villager is not alive' }, { status: 400 });
    }

    let systemPrompt: string;
    if (villager.role === 'civilian') {
      systemPrompt = buildCivilianPrompt(villager, gameState);
    } else {
      const partner = villagers.find(
        (v: Villager) => v.role === 'mafia' && v.id !== villagerId
      );
      systemPrompt = buildMafiaPrompt(villager, partner?.name ?? 'неизвестен', gameState);
    }

    try {
      const response = await callGemini(systemPrompt, chatHistory, newMessage);
      return NextResponse.json({ response });
    } catch (err) {
      console.error('/api/chat Gemini fallback:', err);
      return NextResponse.json({
        response: buildFallbackReply(villager, gameState.day),
        fallback: true,
      });
    }
  } catch (err) {
    console.error('/api/chat error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
