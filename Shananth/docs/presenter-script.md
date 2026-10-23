# Presenter script: Phantom Dependencies

About 25 minutes plus questions. Anyone can give this talk with this page and the deck.
"Say" is a guide, not a script to read word for word. Say it your way.

## Before the talk

**The day before**
- Rehearse twice with a timer. Aim for 23 to 25 minutes.
- Open `deck.html` from your computer, not the web link. It works without internet.
- Press `P` and check the notes window opens. Drag it to your own screen.

**15 minutes before**
- Close other apps and turn on Do Not Disturb, so no pop-ups appear on screen.
- Open `deck.html`, click the page once, press `F` for fullscreen, then `Home`.
- Press `P` and move the notes window to your second screen or laptop screen.
- In Teams, share the **deck window only**, never your whole screen, so the notes stay private.
- Backup link if the file fails: https://adamamzar.github.io/HackDev-talk/Shananth/deck.html

## Keys

| Key | Does |
|-----|------|
| `Space` | Next step. Moves to the next slide when the slide is done. |
| `→` / `←` | Next / previous slide |
| `R` | Reset the demo on screen |
| `F` | Fullscreen |
| `P` | Notes window (only you see it) |

## Timing

| Part | Slides | Minutes |
|------|--------|---------|
| Welcome and this week's news | 1–5 | 3 |
| 01 Real or phantom? | 6 | 3 |
| 02 How the attack works | 7–9 | 4 |
| 03 Watch an attacker do it | 10–12 | 4 |
| 04 How your pipeline stops it | 13–14 | 6 |
| 05 How to protect yourself | 15–18 | 5 |
| Sources, thank you | 19–20 | under 1 |

Running late? Read only the first two stories on slide 11, skip the optional gate 1 trick on slide 14,
and on slide 16 point at the code without reading it out.

## Slide by slide

### 1. Title
**Say:** "Welcome, and thanks for joining. Tonight is about package names that AI tools invent, and the attackers who claim those names first. About 25 minutes, then questions."

### 2. Hi, I'm Shananth
**Say:** "I'm Shananth, a software engineer at Coexrt AI. You don't need to write code to follow this. I'll explain every term. And everything you'll see is a simulation, so nothing real gets installed."

### 3. This week: PHP2Shell (press Space 4 times)
**Say:** "This week PHP, the language behind about 70% of websites, fixed two critical bugs. They let an attacker run their own code on a web server without logging in. Attackers were already trying it four days before the fix, and there were millions of attempts the night the fix came out. AI tools helped researchers find these bugs. AI is on both sides now."

### 4. Panic + AI (press Space 3 times)
**Say:** "Picture a developer in a rush, asking an AI how to patch. The AI suggests a package. But the real fix is upgrading PHP itself. There is no package. So that name was invented. I made this one up for the talk. If an attacker registers an invented name first, everyone who follows the AI's advice installs the attacker's code. That's slopsquatting, and that's tonight."

### 5. Tonight's plan
**Say:** "Five parts. And please play along: when two package names appear, type REAL or PHANTOM in the chat."

### 6. Demo 1: Real or phantom? (Space: show, reveal, next)
**Do:** Show a pair, read both names, wait about 5 seconds for the chat, then reveal.
**Say after the last pair:** "The fakes sound right. That's the whole attack. You can't spot them by looking."

### 7. What is slopsquatting? (Space once)
**Say:** "A package is a ready-made piece of code you download instead of writing it yourself. Typosquatting bets that you'll mistype a real package name. Slopsquatting bets that the AI will confidently invent one. Seth Larson from the Python Software Foundation came up with the name."

### 8. Demo 2: Hallucination roulette (Space 5 times)
**Say:** "Same question, asked five times. Watch the counter. The made-up name shows up four times out of five. It isn't random, so attackers can predict it."

### 9. The numbers (Space 4 times)
**Say:** "Researchers checked 576,000 AI-written code samples from 16 models. About 1 in 5 suggested packages didn't exist. That's over 205,000 different made-up names. And 43% of them came back every single time the same question was repeated. Predictable means plannable. Newer models make fewer mistakes, but in 2026 all five models tested invented the same 127 fake names."

### 10. Demo 3: The attacker's view (Space 3 times)
**Say:** "Here's the attacker's side. A registry is the public app store for code packages. Search the name: nobody owns it. Publish it: a free account and one command. Now installs arrive. The yellow ones are AI agents installing it on their own. Cost to the attacker: one free account and a few minutes."

### 11. It already happened (Space 3 times)
**Say:** "This isn't theory. In 2024 a researcher claimed huggingface-cli, a name AI kept suggesting, and it got over 30,000 downloads. Alibaba even put it in their instructions. react-codeshift, the name from our demo, spread to 237 projects, and AI agents kept trying to install it. And in July, Anthropic disclosed that a Claude model, in a test setup that wrongly had internet access, registered a made-up name on the real Python registry. It ran on 15 real systems in about an hour before it was removed."

### 12. Why AI agents make it worse (Space twice)
**Say:** "In a chat, a person reads the name before installing. An AI agent is an AI that runs commands by itself, so nobody looks. And installing a package can run code immediately, before anyone even uses it."

### 13. What is a CI/CD pipeline? (Space once)
**Say:** "For anyone who isn't a developer: a CI/CD pipeline is an assembly line for code. Every change gets built, tested and shipped, with automatic checks on the way. Every check is a gate. The question is whether any gate asks the right question."

### 14. Demo 4: Pipeline simulator
**Do:**
1. It starts on **Unprotected**. Press Space to run each card. The bad ones steal the secrets.
2. Click **Typical**: only the malware scan is on. Run the cards. react-codeshift and the trick card still get through. Say: "This is where most teams are."
3. Click **Hardened**. Run the cards. Every bad card stops at gate 1. requests still reaches production.
4. Optional: click gate 1 to switch it off and run react-codeshift. Gate 3 catches it.

**Say for gate 1:** "A lockfile is a list of packages a person already approved, each with a fingerprint called a hash. Anything not on the list fails. The AI's invented name was never approved, so it can't get in."

### 15. Spot a phantom in 10 seconds (Space 6 times)
**Say:** "So how do you protect yourself? First, anyone can spot a phantom in about 10 seconds. Look the name up on the registry. Red flags: it's brand new, it has only one release, there's no link to its source code, and nobody knows the publisher. Last check: is the name in the tool's official docs? The rule: copy install commands from the official docs, not from the AI."

### 16. Best practices, in three layers (Space 4 times)
**Say:** "Then it's three layers. You, using AI: look names up, copy commands from docs, and give your AI tool a written rule to only use packages already in the project. Your project and pipeline: install only what the lockfile approves, that's gate 1. Wait about a week before accepting brand-new releases, that's gate 3. And don't let install scripts run by default, that's gate 4. The commands are on screen and in the checklist. Your AI agents: they ask before installing, they run in a sandbox, and they never sit next to real passwords or keys. And remember, scanners, signatures and download counts help, but none of them is enough alone."

### 17. Already installed one? (Space 4 times)
**Say:** "And if it already happened: remove it and restore your lockfile. Assume every password and key that machine could reach is stolen, and replace them all. Check what else changed. And report it, so the registry can take it down for everyone."

### 18. Takeaways (Space 3 times)
**Say:** "Three things to keep. Treat package names from AI like a link from a stranger. Pin your packages with hashes, so unknown names fail. And keep AI agents away from real passwords and keys. The full checklist is at the link on screen."

### 19. Sources
**Say:** "All sources are here and in the repo." Move on.

### 20. Meme, then thank you (Space once)
**Do:** Let the meme sit for a moment, then press Space.
**Say:** "Thank you. Happy to take questions."

## Words people may ask about

| Word | Plain meaning |
|------|---------------|
| Package | Ready-made code you download instead of writing it yourself. |
| Registry | The public "app store" for packages: npm (JavaScript), PyPI (Python), Packagist (PHP). |
| Install script | Code that runs automatically the moment a package is installed. |
| Lockfile | A file listing the exact packages a team approved. |
| Hash | A fingerprint of a file. If the file changes, the fingerprint changes. |
| CI/CD pipeline | The automatic assembly line that builds, tests and ships code. |
| AI agent | An AI that runs commands by itself, not just suggests them. |
| CVE | A public ID for a known security bug. |

## Likely questions

**Does this affect PHP, or only npm and PyPI?**
Any registry where anyone can publish a name, including Packagist for PHP. The research numbers come from Python and JavaScript.

**Is PHP2Shell itself slopsquatting?**
No. PHP2Shell is a bug in PHP. The link is the rush: when everyone asks AI for a quick fix, an invented package name is an easy trap.

**Is react-codeshift dangerous now?**
The researcher who found it registered it first, so no attacker got it. Still, don't install it.

**Should we stop using AI coding tools?**
No. Check any package name they suggest before installing, and let your lockfile catch the rest.

**What's the quickest fix for my team?**
Commit your lockfile and install with the command that respects it, such as `npm ci`, `composer install`, or pip with `--require-hashes`. Then add a one-week cooldown for new releases. Both are in `docs/checklist.md`.

**Does a cooldown slow down security fixes?**
It can. Most tools let you exclude specific packages, and Dependabot's default 3-day wait doesn't apply to security updates.

**How do I check if a package is real?**
Look it up on the registry yourself. Check who publishes it, how old it is, and whether it links to real source code. Be careful with anything brand new or with only one release.
