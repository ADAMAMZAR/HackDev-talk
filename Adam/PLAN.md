# Demo Websites Plan for "Vibe Coding Safely"

One small website per topic in the talk. Each one looks like a real vibe-coded app, has the bug built in, and has a fixed version you can switch to on stage.

**Talk date:** Sunday 25 Oct 2026 · **Hosting:** laptop only (nothing deployed)

## Quick start on the day

1. Double-click **`start-demos.bat`**. It starts every demo server in one window and opens LeadSnap. Closing that window stops everything.
2. **Switch demos:** move the mouse to the very top edge of the page. A navbar slides down with all demos in talk order, with the current one highlighted. Move the mouse away and it hides.
3. On each live demo, click **Demo** (bottom right) or press **`** for the presenter controls. No terminal, SQL Editor or copy-paste is needed on stage.

| Part | Demo | Address |
|---|---|---|
| 1 | LeadSnap | http://localhost:5101 |
| 2 | StudyBuddy | http://localhost:5102 (`/fixed` for the fixed version) |
| 3 | CampusConnect | http://localhost:5103 |
| 4A | MCP plug-in | http://localhost:5100/04a-mcp-plugin/ |
| 4B | KedaiKita | http://localhost:5104 |
| 4C | Agent console | http://localhost:5100/04c-agent-console/ |
| 5 | KopiCheck | http://localhost:5100/05-kopicheck/ |

Port 5100 is a small server inside the launcher that serves the three static demos and the shared navbar (`demos/nav.js`). The static demos also still open straight from disk, but without the navbar unless the launcher is running.

---

## Rules for every site

1. **Fake data only.** Names, emails and matric numbers come from a generator. API keys are fake or already revoked. Never put a real secret in any demo.
2. **Made-up brands.** Don't copy EnrichLead, Lovable, Tea, Replit or SaaStr. Each site gets its own name so it reads like "an app like that one."
3. **Broken by default, fixed on request.** Each site has a vulnerable state (`/`) and a fixed state (`/fixed`, or a SQL script you run live). You show the bug, then the fix, without switching projects.
4. **Small enough to read.** Keep the vulnerable code in one file where possible, so you can show it on screen or paste it into an AI.
5. **A quiet demo label.** Put a small footer on each site: "Demo app: fake data, revoked keys." Don't use a big banner, because the point is that the app looks real.
6. **Works offline where possible.** Anything that doesn't need a network gets mocked. Anything that does (Supabase, npm audit, the AI prompt) gets a screenshot or screen-recording backup.

---

## Repo layout

```
hackdev-01/
  PLAN.md
  demos/
    01-leadsnap/          Part 1 + the closing attacker prompt (Vite + React + Supabase)
    02-studybuddy/        Part 2: secrets (Next.js)
    03-campusconnect/     Part 3: RLS (Vite + React + Supabase, built like a Lovable app)
      supabase/
        01-seed.sql         creates the table with RLS OFF and loads fake rows
        02-lock.sql         ENABLE ROW LEVEL SECURITY
        03-policy.sql       own rows only
        04-bad-policy.sql   USING (true), the fake fix
    04a-mcp-plugin/       Part 4A: a plug-in for your AI that turns bad (static HTML)
    04b-stale-deps/       Part 4B: npm audit + Dependabot (tiny Vite app + GitHub repo)
    04c-agent-console/    Part 4C: agent with too much power (static HTML + JS)
    05-kopicheck/         Part 5: privacy and data minimisation (static HTML)
  backups/
    02/ 03/ 04b/ 05/      a screenshot for every on-screen step
```

**Stack choices.** Use Next.js only where the script needs a server route (Part 2). Use Vite + React + Supabase where you want to copy what Lovable or Bolt actually generate (Parts 1 and 3). Use plain HTML for the simulations, because they have no build step and nothing to break.

**One Supabase project** serves Parts 1, 3 and the optional bucket in Part 5, each with its own table.

---

## The sites

### 01 · LeadSnap: "A working app is not a safe app" (0:00–2:00)

**Real-life version:** EnrichLead, a lead-gen SaaS built with Cursor that had "zero handwritten code."

**What it is:** a polished SaaS with a landing page, a pricing page ("Free / Pro RM49") and a dashboard of sales leads. It looks finished and it works.

**Bugs built in.** There is exactly one for each part of the closing attacker prompt:

| Attacker prompt asks about | Bug in LeadSnap |
|---|---|
| "steal data" | The `leads` table is read through the anon key with RLS **off** |
| "bypass payment" | The paywall is checked only in the browser: `if (localStorage.plan === 'pro')` |
| "run up my bills" | A fake `sk-...` key is hardcoded and the "Enrich" button calls the AI API from the browser |

**On stage:**
- 0:00: show the landing page and dashboard. "This works. People paid for it." In the script this is a talk-only part, so leave the site on screen as a backdrop and don't demo anything.
- 13:00: paste `src/App.jsx` into an AI with the attacker prompt. It should find all three bugs, which closes the loop with the opening story.

**Done when:** all the vulnerable logic is in `App.jsx` (under about 200 lines), and a dry run of the attacker prompt finds all three bugs.

**Effort:** M

---

### 02 · StudyBuddy: "Secrets leak fast" (2:00–5:00)

**Real-life version:** GitHub is full of leaked keys, and AI-assisted commits leak about twice as often.

**What it is:** an AI study-helper chat for students. You type a question and get an answer.

**Two pages, one app:**

| Route | How it calls the AI | What DevTools shows |
|---|---|---|
| `/` (leaky) | From the browser, using `NEXT_PUBLIC_OPENAI_API_KEY` | Search `sk-` in Sources and the key appears |
| `/fixed` | `fetch('/api/chat')`, and the server route reads `process.env.OPENAI_API_KEY` | Searching `sk-` finds nothing |

The leaky page shows two lessons at once. The key does live in `.env`, but the `NEXT_PUBLIC_` prefix still ships it to the browser. That is the trap in step 3, so you don't need a separate demo for it.

**Mock the AI.** Both routes return canned answers, so no real key and no network are needed. The chat still looks like it works.

**On stage:** F12 → Sources → search `sk-` → the key appears. Then show `.env`, `.gitignore` and `app/api/chat/route.js`. Open `/fixed`, search again, and find nothing. Say the line about rotating the key, with a screenshot of the provider's "Revoke key" button.

**Done when:** the key turns up in a Sources search on `/` and doesn't on `/fixed`, both chats answer, and it all works with Wi-Fi off.

**Effort:** S

---

### 03 · CampusConnect: "Your database is open by default" (5:00–9:00)

**Real-life version:** CVE-2025-48757. 170 of 1,645 Lovable showcase apps were readable by anyone.

**What it is:** a student directory, "find classmates in your course." After login the UI shows **only your own profile card**, so the app looks private. The `students` table holds 50 fake rows: name, email, matric no., phone and course.

**This site carries the "hiding a button is not a lock" line.** The UI hides other students, but the database doesn't.

**Live sequence, matching the script:**

1. In the console: `await supabase.from('students').select('*')` returns all 50 rows. For the demo, expose `window.supabase`, and tell the room an attacker would just copy the URL and key from the JS bundle.
2. Run `02-lock.sql` in the Supabase SQL editor.
3. Run step 1 again and get `[]`. "Same code, same key, nothing comes back."
4. Run `03-policy.sql`. You're logged in as one seeded user, so you see one row.
5. Show `04-bad-policy.sql` (`USING (true)`) and **don't run it**. Then open Security Advisor and show the red items you just fixed.

**Setup notes:**
- Create the table with **raw SQL** (`01-seed.sql`), not the Table Editor. The Table Editor turns RLS on by default, which would ruin the demo.
- `user_id uuid` has to reference real `auth.users`. Create 2–3 demo users in the dashboard and link a few rows to them.
- New Supabase projects call the anon key the **publishable key** (`sb_publishable_...`). It's the same idea, so say "the public key" on stage.
- **Offline fallback:** `supabase start` runs the whole stack locally in Docker, and RLS behaves the same. This makes Part 3 work without Wi-Fi.

**Done when:** steps 1–4 give the expected results twice in a row, and you have a reset script (`01-seed.sql` again) to run between rehearsals.

**Effort:** M

---

### 04a · MCP plug-in: "Tools you plug into your AI" (9:00–10:00)

**Real-life version:** `postmark-mcp` on npm, Sept 2025. It posed as Postmark's email connector. 15 versions worked fine, then 1.0.16 added one line that Bcc'd every email to the attacker (~1,500 downloads a week, found by Koi Security).

**What it is:** a scripted simulation of an AI assistant ("Quill") with an email MCP server ("SendLark") plugged in. No real AI, nothing is sent. Space steps through it.

- **Left:** the chat. "Email Aiman his password reset link", then the invoice and a login code.
- **Right:** the MCP config (`npx -y sendlark-mcp`, unpinned, unknown publisher, full-account key), Sent mail, and the **attacker's inbox**.
- **Steps:** the first email goes out clean → `sendlark-mcp 1.0.16` is published and the unpinned config updates itself → the next two emails look normal in Sent mail, but copies land in the attacker's inbox → the raw headers show the hidden `Bcc:` line (also toggled with **H**).
- **Toggle to "Safe setup"** (or press **M**) and replay: `@sendlark/mcp` from the vendor's docs, pinned at 1.4.2 (a 1.4.3 update waits for you), and a send-only key. The attacker's inbox stays at 0.

The three rules on the deck's remedy slide become three things you can see: publisher, pinned version, key scope.

**Effort:** S. It's one HTML file.

---

### 04b · Stale deps: "Packages that are too old" (10:00–11:30)

**Real-life version:** Equifax. A Struts patch was available and never applied, and 147M people's data was stolen.

**What it is:** a tiny Vite app whose `package.json` and `package-lock.json` pin old versions (`axios 0.21.1` and similar). The folder is its own git repo, and the vulnerable versions are committed.

**On stage:**

```
npm audit              # red warnings stay on screen
npm audit fix --force  # upgrades to the patched versions
npm audit              # found 0 vulnerabilities
```

**Why `--force`:** plain `npm audit fix` only makes small, safe upgrades. Fixing axios 0.21 means jumping to 1.x, which npm treats as a big upgrade that could break things, so it won't do it without `--force`. This demo app has no real code that could break, so `--force` is fine. Tell the room: "In a real app, run your tests after this."

**Reset between rehearsals:** this is your idea of keeping a copy of the old versions and installing them back. Git already holds that copy:

```
git checkout -- package.json package-lock.json
npm ci
```

**Backup:** `npm audit` needs internet, so keep screenshots of the red output and the clean output in `backups/04b/`.

**Optional:** push to a **private** GitHub repo and turn on Dependabot alerts. You'd only use it to screenshot the alert list for the "turn on Dependabot" line. The site stays on your laptop either way, so skip this if you'd rather nothing goes online.

**Done when:** you've run the three commands above, reset with git, then run them again, and the output matched both times.

**Effort:** S

---

### 04c · Agent console: "Agents with too much power" (11:30–13:00)

**Real-life version:** the Replit agent that deleted SaaStr's production data during a code freeze.

**What it is:** a scripted simulation of an AI coding-agent console. There is no real LLM. Press Space to go to the next step.

- **Left:** the chat. The user says "CODE FREEZE. Don't change anything without asking."
- **Right:** a `prod` database panel with a live row count: *executives: 1,206 · companies: 1,196*.
- **Steps:** the agent says "Cleaning up test data..." → `DELETE FROM executives;` appears → the counters drop to 0 → the agent says "Rollback is impossible."
- **Toggle to "Safe setup"** and replay. The agent is connected to `dev` (a different badge), destructive commands open an **"Approve? DELETE FROM..."** modal, and a **Restore from backup** button brings the rows back.

The four prevention bullets in the script become four things you can see: the dev/prod badge, no prod credentials, the approval modal and the backup button.

**Effort:** S. It's one HTML file.

---

### 05 · KopiCheck: "Privacy and the checklist" (13:00–15:00)

**Real-life version:** the Tea app. 72k images, including selfies and ID photos, sat in a storage bucket with no lock.

**What it is:** the sign-up flow of a dating-safety app, with a toggle between two versions.

| Before (what Tea did) | After (data minimisation) |
|---|---|
| Name, email, phone, home address, IC number, **IC photo**, selfie, matric no. | Email + selfie |
| "We'll delete your photos after verification" (they don't) | Selfie deleted automatically once verified, and the UI says so |
| Uploads go to a **public** bucket | Private bucket, accessible only to the verifier |

On the "Before" side, label each field with the question from the script: *do I actually need this?* Add a small PDPA note: fines up to RM1M, and breaches must be reported.

**Optional live moment:** put 3–4 placeholder images in a **public** Supabase Storage bucket, and paste the bucket URL into a new tab to show that anyone can open them. Skip this if Part 5 runs over, because the script's on-screen item here is the attacker prompt (which uses LeadSnap).

**Hard rule for images:** use grey silhouettes and cards stamped **"SAMPLE — NOT A REAL ID."** Don't make anything that looks like a real Malaysian IC.

**Effort:** S

---

## Optional: hub page

A single local page linking to all seven demos in talk order, ending with the **5 checks before you ship** from the closing slide. It works as both your launcher and your closing slide. Build it last, only if there's time.

---

## Schedule (talk on Sun 25 Oct)

The demos that are **on screen in the script** come first, so the talk still works if the week runs short. The backdrops for talk-only parts come after.

| Day | Build | Effort |
|---|---|---|
| **Mon 19** | Create the Supabase project. Start **03 CampusConnect**: seed SQL, demo users, UI | M |
| **Tue 20** | Finish **03 CampusConnect** and rehearse its 5 steps. Build **02 StudyBuddy** | M + S |
| **Wed 21** | **04b Stale deps** (rehearse with the git reset). **01 LeadSnap**, using the same Supabase project | S + M |
| **Thu 22** | **04c Agent console**, **05 KopiCheck** | S + S |
| **Fri 23** | **04a MCP plug-in** (added). Full run-through of every demo, with backup screenshots into `backups/`. Fix anything broken. Hub page if there's time | — |
| **Sat 24** | Day-before checklist (below), then 2 timed rehearsals of the full talk | — |
| **Sun 25** | Talk | — |

**If the week slips:** everything you need for the live demos is done by Wednesday (02, 03, 04b, 01). Thursday's sites are backdrops, and the talk works without them.

---

## Timing warning

The script already fills all 15 minutes. **Parts 1, 4A, 4C and the Part 5 form are talk-only slots.** Use those sites as **backdrops** that sit on screen (or step through with one keypress) while you talk. Don't add new interactive demos to them, or the talk will run over. The live demos stay exactly as the script has them: Parts 2, 3, 4B and the attacker prompt.

---

## Day-before checklist, Sat 24 Oct (adds to the script's list)

- [ ] Every site runs locally with `npm run dev`, or opens straight from disk if it's static
- [ ] Supabase: reset script run, RLS **off** on `students` and `leads`, demo user logged in
- [ ] 04b reset with `git checkout -- package.json package-lock.json` then `npm ci`, and `npm audit` shows red again
- [ ] Attacker prompt dry-run on `01-leadsnap/src/App.jsx` and the response saved as a screenshot
- [ ] Browser zoomed to 150%+, DevTools font made bigger, bookmarks bar hidden
- [ ] One browser tab per demo, open in talk order
- [ ] Wi-Fi-off test: 02, 04a, 04c and 05 still work

---

## Decisions

1. **Talk date:** Sunday 25 Oct 2026. All 7 sites are planned, with the live demos finished first (see Schedule).
2. **Hosting:** laptop only. Nothing gets deployed. The one online piece is the Supabase database, which you can delete after the talk.
3. **Part 4B:** tested 19 Oct. `npm audit fix --force` needs **two runs** to reach 0 (the first only moves axios to 0.21.4). `npm install axios@latest lodash@latest` gets there in one. Reset with `git checkout` + `npm ci` between rehearsals. See `demos/04b-stale-deps/README.md`.
