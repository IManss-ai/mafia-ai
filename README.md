# WePlay KZ

AI-powered social deduction games set in Almaty, Kazakhstan. Built for the WePlay-KZ hackathon.

**Live demo:** https://mafia-ai-five-one.vercel.app

---

## What is this?

WePlay KZ is a web platform with two party games where you play against AI characters powered by Google Gemini. Every character has a unique personality, backstory, and speaks in Russian — they remember what you asked them, lie convincingly, and react to being accused.

### Алматинская Мафия (Almaty Mafia)
Six residents of Kok-Tobe hill are suspects in a double murder. Two of them are mafia. You have three days to interrogate all six in real-time chat, track suspicion levels, and vote to exile the killers before they outnumber you at night.

### Кто Шпион? (Who's the Spy?)
Five players get a secret word — one of them (an AI) gets a slightly different word. Everyone describes their word in one sentence. You watch for vague answers, then vote on who the spy is before time runs out.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand + localStorage |
| AI | Google Gemini (`gemini-1.5-flash`) |
| Avatars | DiceBear Avataaars |
| Deploy | Vercel |

---

## Project structure

```
app/
  page.tsx              # Home lobby — game selection
  games/
    mafia/page.tsx      # Mafia game UI and game loop
    spy/page.tsx        # Spy game UI and game loop
  profile/page.tsx      # Player profile and stats
  api/
    mafia/chat/         # POST — villager responds to interrogation
    mafia/night/        # POST — mafia AI picks a kill target
    spy/describe/       # POST — AI character describes their word
components/
  ui/                   # Sidebar, Avatar, AnimatedButton, Toast, etc.
  ChatPanel.tsx         # Chat interface for mafia interrogation
  VillagerList.tsx      # Suspect list with suspicion sliders
  VoteModal.tsx         # Exile voting dialog
lib/
  characters.ts         # 6 mafia game characters with personalities
  spyCharacters.ts      # 4 spy game characters
  wordPairs.ts          # 20+ civilian/spy word pairs in Russian
  prompts.ts            # System prompts for each AI role
  gemini.ts             # Gemini API client
  gameState.ts          # Game logic, win conditions, localStorage
  types.ts              # TypeScript interfaces
```

---

## Getting started

**Prerequisites:** Node.js 18+, a Google AI Studio API key

```bash
git clone https://github.com/IManss-ai/mafia-ai.git
cd mafia-ai
npm install
```

Create `.env.local`:

```
GOOGLE_API_KEY=your_google_ai_studio_key
```

```bash
npm run dev
```

Open http://localhost:3000

---

## How the AI works

Each villager in Алматинская Мафия has:
- A real alibi (civilian) or a fake alibi (mafia)
- A distinct personality and speaking style in Russian
- Memory of the full conversation within the session

When you interrogate a villager, the message goes to `/api/mafia/chat` which calls Gemini with a system prompt containing the character's secret role, alibi, and personality. Mafia characters are instructed to lie and deflect. Civilian characters are nervous but honest.

At night, `/api/mafia/night` asks a Gemini agent (playing the mafia team) to choose which civilian to eliminate, with a narrative explanation.

For Кто Шпион?, `/api/spy/describe` asks each AI character to describe their word in one sentence — the spy gets a related but different word and must bluff convincingly.

---

## Design system

| Token | Value |
|---|---|
| Background | `#1E1F22` |
| Surface | `#2B2D31` |
| Border | `#3B3F45` |
| Accent | `#14B8A6` (teal) |
| Text primary | `#FFFFFF` |
| Text secondary | `#B5BAC1` |
| Success | `#23A55A` |
| Danger | `#F23F42` |
| Gold | `#F1C40F` |

Dark flat cards, `rounded-2xl` corners, system fonts, Framer Motion stagger animations on load.

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set `GOOGLE_API_KEY` in your Vercel project environment variables. The free tier of Gemini (`gemini-1.5-flash`) is sufficient for demos.

---

## API reference

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/mafia/chat` | `villagerId, chatHistory, newMessage, gameState, villagers` | `{ response: string }` |
| POST | `/api/mafia/night` | `aliveVillagers, mafiaIds, dayNumber` | `{ killedVillagerId, narration }` |
| POST | `/api/spy/describe` | `characterId, word, role, previousDescriptions` | `{ description: string }` |

All endpoints return `{ error: string }` with an appropriate HTTP status on failure.

---

## Built at

WePlay-KZ Hackathon — Almaty, May 2026
