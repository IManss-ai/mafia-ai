import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Villager, ChatMessage, GamePhase } from '../types';
import { createInitialState } from '../gameState';

interface MafiaState {
  day: number;
  phase: GamePhase;
  villagers: Villager[];
  chatHistories: Record<string, ChatMessage[]>;
  nightLog: string[];
  loseReason?: string;
  
  initGame: () => void;
  setPhase: (phase: GamePhase) => void;
  setVillagers: (villagers: Villager[]) => void;
  setSuspicion: (id: string, value: number) => void;
  addChatMessage: (villagerId: string, msg: ChatMessage) => void;
  setNightLog: (log: string[]) => void;
  setLoseReason: (reason: string | undefined) => void;
  nextDay: () => void;
  resetGame: () => void;
}

export const useMafiaStore = create<MafiaState>()(
  persist(
    (set) => ({
      day: 1,
      phase: 'day',
      villagers: [],
      chatHistories: {},
      nightLog: [],
      loseReason: undefined,

      initGame: () => {
        const fresh = createInitialState();
        set({
          day: fresh.day,
          phase: fresh.phase,
          villagers: fresh.villagers,
          chatHistories: fresh.chatHistories,
          nightLog: fresh.nightLog,
          loseReason: undefined,
        });
      },

      setPhase: (phase) => set({ phase }),
      setVillagers: (villagers) => set({ villagers }),
      setSuspicion: (id, value) => set((state) => ({
        villagers: state.villagers.map((v) =>
          v.id === id ? { ...v, suspicion: value } : v
        ),
      })),
      addChatMessage: (villagerId, msg) => set((state) => ({
        chatHistories: {
          ...state.chatHistories,
          [villagerId]: [...(state.chatHistories[villagerId] ?? []), msg],
        },
      })),
      setNightLog: (nightLog) => set({ nightLog }),
      setLoseReason: (loseReason) => set({ loseReason }),
      nextDay: () => set((state) => ({ day: state.day + 1, phase: 'day' })),
      resetGame: () => {
        const fresh = createInitialState();
        set({
          day: fresh.day,
          phase: fresh.phase,
          villagers: fresh.villagers,
          chatHistories: fresh.chatHistories,
          nightLog: fresh.nightLog,
          loseReason: undefined,
        });
      },
    }),
    {
      name: 'weplay-mafia-persist',
    }
  )
);
