# Codex Handoff — Алматинская Мафия

## What this project is

Single-player Mafia game set in modern Almaty. The player is a detective interrogating 6 AI-powered suspects in Russian. Two are secretly mafia and lie convincingly. Find both within 3 days or lose. Every villager is a live Gemini LLM agent — AI is the mechanic, not a build tool.

Built for nFactorial AI Cup hackathon (solo, single-day). Judging favors: depth of AI integration, originality, UI/UX, fun factor.

**Live URL:** https://mafia-ai-five.vercel.app/  
**GitHub:** https://github.com/IManss-ai/mafia-ai  
**Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Vercel, Google Gemini API (`@google/generative-ai` v0.24.1)

---

## Current state (as of handoff)

### What is fully built and deployed

```
mafia-ai/
  app/
    page.tsx              — start screen (dark, Russian, working)
    game/page.tsx         — main game orchestrator (full loop implemented)
    api/
      chat/route.ts       — POST: villager interrogation via Gemini
      night/route.ts      — POST: mafia picks kill target via Gemini
    globals.css
    layout.tsx
  components/
    VillagerCard.tsx      — single suspect card with colored initials circle
    VillagerList.tsx      — left sidebar with all 6 cards + vote button
    ChatPanel.tsx         — chat UI: history, input, send
    VoteModal.tsx         — modal to pick who to exile
    NightScreen.tsx       — full-screen night narration overlay
    EndScreen.tsx         — win/lose screen with mafia reveal + replay
  lib/
    characters.ts         — 6 character definitions with personalities
    prompts.ts            — buildCivilianPrompt(), buildMafiaPrompt(), buildNightPrompt()
    gameState.ts          — createInitialState(), saveState(), loadState(), checkWinCondition()
    gemini.ts             — callGemini(), callGeminiForJSON()
    types.ts              — all TypeScript interfaces
```

### What was fixed during build

- **Google Fonts blocked** in build env → switched from `next/font/google` to `localFont` using bundled GeistVF.woff
- **gemini-2.0-flash free tier quota is 0** → switched to `gemini-1.5-flash` (free: 15 RPM, 1500 RPD). This is the current model in `lib/gemini.ts`
- **Vercel env var** `GOOGLE_API_KEY` is set in Production environment

### What has NOT been verified end-to-end

The game UI loads and the chat panel opens correctly. The Gemini API call was confirmed working (got past 500 error). But the following have NOT been manually play-tested:

1. Sending a message and getting a real Айгерим response in the browser
2. The voting flow (VoteModal → exile → day ends)
3. The night phase (NightScreen appears → /api/night called → kill narration shows)
4. Win condition (both mafia exiled → EndScreen with "Убийцы пойманы")
5. Lose condition (3 nights pass OR mafia >= civilians)
6. Replay button (clears localStorage, creates fresh game)

---

## Game loop (for reference)

1. Player opens `/game` → 6 suspects in left panel, empty chat on right
2. Click a suspect → ChatPanel opens → type question → Gemini responds in character
3. Player votes → VoteModal picks who to exile → if both mafia exiled: **WIN**
4. After vote → night phase → NightScreen shows → `/api/night` called → mafia kills someone → narration shown → "Продолжить расследование" button
5. Day counter increments (1→2→3). After day 3 night: **LOSE**
6. Also lose if mafia count >= civilian count at any point

---

## File details that matter

### lib/characters.ts
6 characters, each has: `id`, `name`, `age`, `profession`, `voicePrompt`, `alibi` (true, for civilians), `fakeAlibi` (for mafia), `color` (Tailwind bg class).

Roles are assigned randomly at game start — same characters every game, different mafia pair each time.

### lib/prompts.ts
- `buildCivilianPrompt(villager, ctx)` — honest alibi, told to respond naturally in 1-3 sentences
- `buildMafiaPrompt(villager, partnerName, ctx)` — given fake alibi, told never to confess, told to stay consistent
- `buildNightPrompt(mafiaNames, targets, day)` — asks Gemini to pick a kill target and return JSON

### lib/gemini.ts
- `callGemini(systemPrompt, history, userMessage)` — for chat (stateful conversation)
- `callGeminiForJSON(prompt)` — for night kill (parses JSON from response text)
- Model: `gemini-1.5-flash`

### app/api/chat/route.ts
Receives full villager array from client (including role). Builds prompt server-side. Returns `{ response: string }`.

### app/api/night/route.ts
Receives alive villagers + mafia IDs + day number. Returns `{ killedVillagerId, narration }`. Has fallback: if Gemini picks an invalid ID, picks a random target.

### app/game/page.tsx
Main state machine. Key state:
- `gameState: GameState | null` — full game state, auto-saved to localStorage
- `selectedId: string | null` — which villager's chat is open
- `nightNarration: string | null` — the narration string from /api/night

Key flows:
- `handleSendMessage()` → calls /api/chat → appends to chatHistories
- `handleVoteConfirm(targetId)` → exiles villager → checks win → if no win: switches to night phase → calls `runNightPhase()`
- `runNightPhase()` → calls /api/night → sets nightNarration → marks villager dead → checks win again
- `handleContinueFromNight()` → increments day, switches back to day phase
- `handleReplay()` → clears localStorage, creates fresh game state

---

## Style rules (enforced throughout)

- All UI copy in Russian. Code, comments, variable names in English.
- No emoji anywhere — not in UI, not in LLM prompts, not in narration.
- No AI-flavored filler ("конечно!", "давайте разберёмся") — prompts explicitly forbid it.
- Each character has a distinct voice. Айгерим uses молодёжный сленг. Данияр is terse. Жанна Сериковна uses formal "вы". Ербол code-switches ru/en. Серик-ага is monosyllabic. Дина is direct and energetic.
- Dark color scheme: bg-gray-950 background, gray-800/900 cards, red-800 for vote button and CTAs.
- No em-dashes anywhere in copy.

---

## What to do next (priority order)

### 1. Verify the full game loop works (highest priority)

Open https://mafia-ai-five.vercel.app/game and play through:
- Interrogate 2-3 suspects, get real Gemini responses
- Vote someone out
- See night screen with narration
- Continue to day 2
- Win or lose and see the end screen
- Hit "Играть снова" and confirm fresh game loads

Fix any bugs found.

### 2. Prompt quality polish

The prompts in `lib/prompts.ts` are functional but not tuned. Goals:
- Mafia should lie convincingly but not too obviously
- Each character's voice should be clearly distinct in responses
- Night narration should mention real Almaty locations and feel atmospheric
- Responses should stay 1-3 sentences — add stricter instruction if LLM ignores this

### 3. UI polish

Current UI is functional but rough:
- Add a small day indicator showing remaining days (e.g. dots or "День 1 из 3")
- The VillagerList sidebar truncates profession text — consider tooltip or full text on hover
- ChatPanel messages could use character name/initials label on the assistant side
- Consider adding a subtle "Подозревается" tag that player can manually mark on a card

### 4. Known potential issues to check

- **Night phase timing:** if the player clicks "Проголосовать" while a chat request is in-flight, `isLoading` might block the modal. Verify this doesn't cause issues.
- **Game state on reload:** page reload loads saved localStorage state. If a game is in 'won' or 'lost' phase, the code clears it and starts fresh. Verify this works.
- **Mafia partner name:** if both mafia members are alive, the partner name in the mafia prompt is resolved correctly. If one is already dead/exiled, the partner lookup might return undefined — check `buildMafiaPrompt` call in `/api/chat/route.ts`.

---

## Environment

```
GOOGLE_API_KEY=<already set in Vercel Production>
```

Local dev: create `.env.local` with `GOOGLE_API_KEY=<your key>`

Run locally: `npm run dev` in `/mafia-ai/`

Deploy: push to `main` on GitHub → Vercel auto-deploys

---

## What NOT to add (scope killers for hackathon)

- Multiplayer
- AI-generated character images (use initials circles)
- Sound effects
- Difficulty settings
- Login/accounts
- Settings page
- Animations beyond default Tailwind transitions
- Multiple languages — Russian only
