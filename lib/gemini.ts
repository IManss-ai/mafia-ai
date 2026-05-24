import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from './types';

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getGeminiClient() {
  if (!genAI) {
    throw new Error('GOOGLE_API_KEY is not set');
  }

  return genAI;
}

export async function callGemini(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const model = getGeminiClient().getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  });

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'user' ? ('user' as const) : ('model' as const),
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: formattedHistory });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

export async function callGeminiForJSON(prompt: string): Promise<unknown> {
  const model = getGeminiClient().getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in Gemini response');
  return JSON.parse(match[0]);
}
