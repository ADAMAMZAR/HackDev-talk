# 01 · LeadSnap: "A working app is not a safe app"

A polished lead-gen SaaS, like EnrichLead. It works, and people would pay for it. It also has exactly one bug for each part of the closing attacker prompt, all in `src/App.jsx`:

| Attacker prompt asks about | The bug | Where in `App.jsx` |
|---|---|---|
| "steal data" | `leads` table read with the public key, RLS **off** | `supabase.from('leads').select('*')` |
| "bypass payment" | The Pro plan is checked only in the browser | `localStorage.getItem('plan') === 'pro'` |
| "run up my bills" | AI key hardcoded and used from the browser | `const OPENAI_API_KEY = 'sk-proj-...'` |

A bonus bug the AI may also find: on the Free plan, emails and phone numbers are only **blurred with CSS**. The real values are still on the page and in the network response.

The key is fake and the AI is mocked (`src/fakeOpenAI.js`), so "✨ Enrich" works offline.

## One-time setup

**Supabase → SQL Editor:** paste `supabase/leads.sql` and click Run. It should report `leads = 16`. Run it again any time to reset.

Then double-click `start-demos.bat` in the project root, or run `npm run dev` here. It opens at http://localhost:5101.

## On stage

Click the **Demo** pill (bottom right), or press **`** (the backtick key), to open the Demo controls.

**0:00 (backdrop, talk only).** Leave the dashboard on screen while you tell the EnrichLead story. Click "✨ Enrich" on one row so it looks alive.

*Optional 10-second paywall bypass, only if you're ahead of time:* click **Unlock Pro as attacker**. The page reloads with the blur gone and Export CSV unlocked, and the panel shows the one line of code that did it. Click **Back to Free plan** to undo.

**13:00 (attacker prompt).** Click **Copy prompt + code**. It copies the attacker prompt plus all of `src/App.jsx`. Switch to any AI, press Ctrl+V and send.

It should find the hardcoded key, the open table and the browser-only paywall. Rehearse this once and screenshot the answer into `backups/05/` in case the AI or the Wi-Fi is slow.
