# 02 · StudyBuddy: "Secrets leak fast"

An AI study-helper chat. Both pages look and work the same, but one of them gives its API key to every visitor.

| Page | How it calls the AI | Key in the browser? |
|---|---|---|
| `/` (leaky) | From the browser, using `NEXT_PUBLIC_OPENAI_API_KEY` | **Yes** |
| `/fixed` | Browser → `/api/chat` (our server) → AI, using `OPENAI_API_KEY` | No |

The key in `.env` is fake, and the AI is mocked in `lib/fakeOpenAI.js`, so the chat works offline.

## Run

Double-click `start-demos.bat` in the project root, or run `npm run dev` here. It opens at http://localhost:5102.

## On stage (2:00–5:00)

1. **Find the leak.** On `/`, ask a question so the chat looks real. Then press **F12 → Sources**, press **Ctrl+Shift+F** (search all files), and type `sk-`. The key shows up.
   "This is all an attacker needs. No hacking skills, just F12."
2. **Move the key out of the frontend.** Show three files:
   - `.env`: the key lives here
   - `.gitignore`: `.env` is listed, so it never gets committed
   - `app/api/chat/route.js`: the server reads `process.env.OPENAI_API_KEY`
3. **Point out the trap.** Go back to `.env`. The leaky page *also* reads its key from `.env`, but its name starts with `NEXT_PUBLIC_`, so Next.js ships it to the browser.
   "A .env file alone isn't safe. The key also has to be used only on the server."
4. **Prove the fix.** Open `/fixed`, ask a question (it still works), then search `sk-` again and find nothing.
5. **If it already leaked:** "Deleting the commit is not a fix. Revoking the key is." Show a screenshot of a provider's "Revoke key" button.
