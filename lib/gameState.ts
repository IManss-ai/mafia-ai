import { GameState, Villager } from './types';
import { CHARACTERS } from './characters';

const STORAGE_KEY = 'almaty-mafia-v1';

export function createInitialState(): GameState {
  const indices = [0, 1, 2, 3, 4, 5];
  const shuffled = [...indices].sort(() => Math.random() - 0.5);
  const mafiaIndices = new Set([shuffled[0], shuffled[1]]);

  const villagers: Villager[] = CHARACTERS.map((char, i) => ({
    ...char,
    role: mafiaIndices.has(i) ? 'mafia' : 'civilian',
    status: 'alive',
  }));

  return {
    day: 1,
    phase: 'day',
    villagers,
    chatHistories: Object.fromEntries(CHARACTERS.map(c => [c.id, []])),
    nightLog: [],
  };
}

export function saveState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): GameState | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as GameState;
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export type WinCheck = 'playing' | 'won' | 'lost';

export function checkWinCondition(state: GameState): WinCheck {
  const alive = state.villagers.filter(v => v.status === 'alive');
  const aliveMafia = alive.filter(v => v.role === 'mafia');
  const aliveCivilian = alive.filter(v => v.role === 'civilian');

  if (aliveMafia.length === 0) return 'won';
  if (aliveMafia.length >= aliveCivilian.length) return 'lost';
  if (state.day >= 3 && state.phase === 'night') return 'lost';

  return 'playing';
}
