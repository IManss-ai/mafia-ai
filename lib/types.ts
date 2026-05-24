export type Role = 'civilian' | 'mafia';
export type VillagerStatus = 'alive' | 'dead' | 'exiled';
export type GamePhase = 'day' | 'night' | 'won' | 'lost';

export interface Character {
  id: string;
  name: string;
  age: number;
  profession: string;
  voicePrompt: string;
  alibi: string;
  fakeAlibi: string;
  color: string;
}

export interface Villager extends Character {
  role: Role;
  status: VillagerStatus;
  suspected?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GameState {
  day: number;
  phase: GamePhase;
  villagers: Villager[];
  chatHistories: Record<string, ChatMessage[]>;
  nightLog: string[];
  loseReason?: string;
}

export interface ChatRequest {
  villagerId: string;
  chatHistory: ChatMessage[];
  newMessage: string;
  gameState: {
    day: number;
    aliveVillagerIds: string[];
    exiledIds: string[];
    killedIds: string[];
  };
  villagers: Villager[];
}

export interface NightRequest {
  aliveVillagers: { id: string; name: string }[];
  mafiaIds: string[];
  dayNumber: number;
}

export interface NightResponse {
  killedVillagerId: string;
  narration: string;
}
