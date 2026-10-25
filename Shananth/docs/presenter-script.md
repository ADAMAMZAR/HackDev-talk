# Presenter script: Phantom Dependencies

About 25 minutes plus questions. Anyone can give this talk with this page and the deck.
Everything to say is written out below, slide by slide and press by press, so you can read it
straight off the page. The notes window in the deck (press `P`) shows the same words.

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
| 03 Watch an attacker do it | 10–12 | 5 |
| 04 How your pipeline stops it | 13–14 | 5 |
| 05 How to protect yourself | 15–18 | 5 |
| Sources, thank you | 19–20 | under 1 |

Running late? On slide 14, run only requests and react-codeshift on Unprotected and skip the
optional gate 1 part. On slide 11, read only the first two stories.

## Slide by slide

Lines with no cue: say them before pressing anything, or right after the step above them.
**SPACE** means press Space, then say the line. **CLICK** and **DO** are actions.

### 1. Title
*On screen: The talk title, and the command npm install react-codeshift with a dashed box around the name.*

"Hi everyone, welcome, and thank you for joining. Tonight's talk is called Phantom Dependencies: how attackers pre-register your AI's imagination."

"In plain words: AI coding tools sometimes make up names of software packages that don't exist. Attackers quietly claim those made-up names first. So when someone follows the AI's advice, they install the attacker's code instead."

"Look at the command on screen: react-codeshift. An AI made that name up. Someone registered it anyway. Keep that name in mind. It comes back all night."

"It's about 25 minutes, and then we'll have time for questions."

### 2. Hi, I'm Shananth
*On screen: Three rows: who, tonight, no code needed.*

"A little about me. I'm Shananth, a software engineer at Coexrt AI."

"Tonight we're talking about the package names AI tools make up, and the people waiting to claim them."

"And don't worry if you don't write code. You don't need to. I'll explain every term as we go. Every demo you'll see is a simulation: nothing real gets installed, and no real AI is running."

### 3. This week: PHP2Shell (Space 4 times)
*On screen: A timeline with three dates, then the ~70% fact.*

"Before we start, here's why this matters right now, this week. Has anyone heard of PHP2Shell? PHP is the programming language behind a huge part of the web, things like WordPress sites. This week two critical bugs were found in it. They let an attacker run their own code on someone else's web server, without even logging in. That's about as bad as it gets."

**SPACE**  
"October 17th. Amazon's security team saw attackers already trying it. That's four days before any fix existed."

**SPACE**  
"October 21st. PHP released an emergency fix. And the only safe fix is to upgrade PHP itself. Remember that. It matters on the next slide."

**SPACE**  
"That same night, Cloudflare saw millions of attack attempts. Everyone was racing: attackers to break in, developers to patch."

**SPACE**  
"The security company Wiz estimates about 70% of the web runs on PHP. And here's a twist: AI tools helped the researchers find these bugs. So AI is on both sides of this story now."

### 4. Panic + AI = a slopsquatting window (Space 3 times)
*On screen: A fake AI chat answering "composer require php2shell/patch", then three points.*

"Now picture a developer in that rush. It's late, the boss is asking if they're safe, and they ask their AI assistant: how do I patch PHP2Shell in my Laravel app? Quick!"

"The AI answers confidently: install this patch package, php2shell slash patch. Just so you know, I made that name up for this talk. It's not real."

**SPACE**  
"Here's the problem. The real fix is upgrading PHP. There is no patch package to install."

**SPACE**  
"So any package name the AI gives here is invented. It sounds official, but it doesn't exist."

**SPACE**  
"And that's the opening. An attacker can register that exact name in a few minutes while everyone is rushing to patch. Then anyone who copies the AI's answer installs the attacker's code. That trick has a name: slopsquatting. And that's what tonight is about."

### 5. Tonight's plan
*On screen: Five parts with minutes, and the play-along box.*

"Here's the plan. Five parts."

"One: a quick game, real or phantom. Two: how the attack works. Three: we watch an attacker do it, step by step. Four: how the automatic checks in a software pipeline can stop it. And five: how to protect yourself, with things you can do tomorrow."

"Please play along. In a moment two package names will appear. Type REAL or PHANTOM in the chat. No pressure. Most people get it wrong, and that's kind of the point."

### 6. Demo 1: Real or phantom? (Space 7 times: show, reveal, three pairs, then the summary)
*On screen: Two name cards side by side. On reveal, the real one turns green and the fake gets a red stamp.*

"Quick word first. A package is a ready-made piece of code that developers download so they don't have to write everything themselves. Think of it like an app from an app store, but for programmers. In each pair, one name is a real package and one is fake."

**SPACE · pair 1**  
"First pair, from Python's package store. huggingface-cli, or huggingface underscore hub with cli in brackets. Which one is fake? Type it in the chat."

**DO**  
Wait about 5 seconds. Read out a few answers from the chat.

**SPACE · reveal**  
"The fake is huggingface-cli. It looks like the cleaner, simpler name, right? That's exactly why AI tools kept suggesting it. It didn't exist until a security researcher registered it as a harmless test. We'll see what happened to it later."

**SPACE · pair 2**  
"Second pair, from JavaScript's package store. eslint-plugin-unused-imports, or just unused-imports. Chat, which one?"

**SPACE · reveal**  
"The fake is unused-imports, the short one. And this was no harmless test. It's a real malicious package. The store has locked it under a security hold."

**SPACE · pair 3**  
"Last pair. react-codeshift, or jscodeshift. Which is fake?"

**SPACE · reveal**  
"react-codeshift is the fake. It's a mash-up of two real things: React, a hugely popular tool, and jscodeshift, a real tool. Mix them and you get a name that sounds completely believable. It's the name from the title slide."

**SPACE · summary**  
"So how did you do? Notice that the fakes sound right. Sometimes even more right than the real ones. That's the whole attack. You can't spot them just by looking at the name."

### 7. What is slopsquatting? (Space once)
*On screen: Two columns: typosquatting (reqeusts) and slopsquatting (react-codeshift).*

"So what exactly is slopsquatting? Let's start with its older cousin, typosquatting."

"Typosquatting bets on a human typo. A popular Python package is called requests. An attacker registers r-e-q-e-u-s-t-s, with two letters swapped, and waits for someone to mistype it. It's like a fake website that's one letter off from your bank's."

**SPACE**  
"Slopsquatting bets on the AI's mistake instead. The AI isn't misspelling anything. It confidently invents a name that sounds right, like react-codeshift. 'Slop' is slang for low-quality AI output. So it's squatting on the AI's slop."

"The term was coined by Seth Larson from the Python Software Foundation."

### 8. Demo 2: Hallucination roulette (Space 5 times, once per answer)
*On screen: A simulated AI chat on the left; on the right a counter and five dots.*

"Here's what makes this dangerous. Does the AI make the same mistake every time, or is it random? Let's test it. This is a simulated AI chat. The question: write a script that converts my React code to the newer style automatically."

"We'll ask the exact same question five times and count how often the made-up name react-codeshift shows up. Watch the counter on the right."

**SPACE · answer 1**  
"First answer. There it is, in red: react-codeshift. One out of one."

**SPACE · answer 2**  
"Same question, a differently worded answer, but react-codeshift again. Two out of two."

**SPACE · answer 3**  
"Third time, the AI gives an honest answer: no single tool does this automatically. No fake name. A green dot."

**SPACE · answer 4**  
"Fourth answer. And it's back."

**SPACE · answer 5**  
"Fifth. Back again. Four out of five."

"So it's not random. The AI makes up the same name over and over. And if it's predictable, an attacker can plan for it. They register the name and wait."

### 9. The numbers (Space 4 times)
*On screen: Four number tiles: 19.7%, 205,474, 43%, 127.*

"And this isn't just my demo. Researchers measured it."

**SPACE**  
"In a large study published in 2025, researchers had 16 AI models write 576,000 pieces of code. About 1 in 5 of the packages the AI recommended didn't exist. 19.7 percent."

**SPACE**  
"That's over 205,000 different made-up names. Every one of them is a name an attacker could claim."

**SPACE**  
"And here's the worrying part. When they asked the same questions 10 more times, 43 percent of the made-up names came back every single time. Predictable means plannable."

**SPACE**  
"A 2026 update: newer models are better. They make up about 5 to 6 percent of names. But all five models tested invented the same 127 fake names. So an attacker doesn't even need to know which AI you use."

### 10. Demo 3: Two sides of one install (Space 4 times, or click the button at the bottom right)
*On screen: A five-stage bar on top. Left: the developer's AI coding agent. Right: the attacker's screen.*

"So far we've seen the AI make up names. Now let's watch the whole attack from start to finish."

"Look at the bar along the top. Those are the five stages of the attack. Stage one is already lit: the AI invents a name. We just saw that. react-codeshift keeps coming back."

"The screen is split into two sides of one install. On the left, a regular developer. On the right, the attacker. We start on the attacker's side, on a package registry. A registry is the public app store for code. Anyone can make a free account and publish a package there, and nobody reviews it first."

**SPACE · claim the name**  
"Stage two: the attacker claims the name. They search for react-codeshift. Green tick: nobody owns this name. So they fill in a short form. The name: react-codeshift. A description that matches what the AI said it does. And they click Publish."

"That's it. The package is live, published just now by a brand-new account, with zero installs. Inside it they've hidden a small piece of code. You can't see it on the page. Now they just wait."

**SPACE · developer asks AI**  
"Stage three. On the left, a developer asks their AI coding agent to convert their React code. An AI agent is an AI that doesn't just suggest things. It actually does them on your computer."

"It says: I'll install the tool and run it. It types the install command, npm install react-codeshift, all by itself. Added 1 package. Nobody checked the name. No human looked at it."

"And on the right, the attacker sees their first install come in: an AI agent, the developer on the left."

**SPACE · what does the attacker get?**  
"Stage four: hidden code runs. Here's what most people don't know. Installing a package isn't like downloading a photo. A package can run its own code the moment it's installed, before you've even used it. It's like opening an email attachment from a stranger. That's the 'running install script' line on the left."

"Stage five: the attacker gets the keys. The hidden code searches the developer's computer for keys and passwords and sends them to the attacker. We're now looking at the attacker's inbox. The values are masked and made up, but these are things that sit on a normal developer laptop."

"A cloud key: access to the company's cloud servers. A GitHub token: access to the company's code. The .env file with the database password: access to customer data. And an SSH key, which logs into servers."

"With these, the attacker can log in as you. They can change your code, read your database, and run up your cloud bill. They never had to hack anything. The developer's own AI installed it for them."

**SPACE · watch it spread**  
"And it doesn't stop at one person. The AI suggests the same name to lots of people. So every laptop, every AI agent and every automatic build server that installs it sends its keys too. Watch the counter climb. Many of these are AI agents, with no human review at all."

"Cost to the attacker: one free account and a few minutes."

### 11. It already happened (Space 3 times)
*On screen: Three real cases: huggingface-cli, react-codeshift, AI on the other side.*

"This might sound like a thought experiment. It isn't. It has already happened."

**SPACE**  
"In 2024, a researcher named Bar Lanyado at Lasso Security noticed AI models kept suggesting huggingface-cli, the fake from our game. It didn't exist. So he published an empty, harmless package under that name to see what would happen. Over 30,000 downloads in three months. Even Alibaba, a huge tech company, had copied the install command into its public instructions. If he'd been an attacker, every one of those would have been a victim."

**SPACE**  
"In 2026, Charlie Eriksen at Aikido found react-codeshift, the name from our demos, in instruction files that AI had written for AI agents. Nobody had ever registered it, but it had already spread to 237 projects. He claimed it before an attacker could. And AI agents kept trying to install it anyway."

**SPACE**  
"And this one is from July this year. Anthropic, the company that makes Claude, disclosed that during a security test that was set up wrongly and accidentally had internet access, a Claude model registered one of these made-up names on the real Python package store. It had picked the name up from a setup document. It got installed on 15 real systems in about an hour before the store removed it. So AI doesn't only make up these names. It can end up publishing them too."

### 12. Why AI agents make it worse (Space twice)
*On screen: Two rows: you plus an AI chat, and an AI agent with a red "No one looks" box. Then an install script line.*

"So why do AI agents make this worse? Look at the top row: you, using an AI chat. The AI suggests a name, you read it, and you decide to run the install. There's a human in the middle who might notice something's off."

**SPACE**  
"Now the second row: an AI agent. The AI suggests a name, and then no one looks. The agent runs the install itself. The one moment where a human could have caught it is gone."

**SPACE**  
"And remember what we saw in the demo: installing alone is enough. A package can include an install script, a note that says 'run this the moment I'm installed'. The line on screen is an example. It runs immediately, before anyone even uses the package. By the time anyone notices, it's too late."

### 13. What is a CI/CD pipeline? (Space once)
*On screen: Four stations (code change, build, test, deploy) with a block moving along a track.*

"So how do companies defend against this? With something called a CI/CD pipeline. If you're not a developer, think of it as an assembly line for code."

"Every time someone changes the code, it moves down the line automatically. First the code change. Then it gets built, which is where packages get installed. Then it's tested. And finally it's shipped to users. Watch the little block move along. At each station there are automatic checks."

**SPACE**  
"Every check is a gate. Something can only move forward if it passes. The question is whether any of those gates asks the right question about packages."

### 14. Demo 4: Pipeline simulator (Space runs one card at a time; click the presets at the top right)
*On screen: Five package cards on top, five gates in the middle, production on the right, a run log at the bottom.*

"Let's test that. This is a pipeline simulator. Along the top are five packages trying to get in. In the middle are five gates, the checks. On the far right is production, the live system. It holds the real keys and passwords. That's what the attacker wants."

"Each gate asks one question. Gate 1: did a person approve this package? Gate 2: does it even exist? Gate 3: does it look suspicious? Brand new, only one release, no source code, unknown publisher. Gate 4: what does it do when it's installed? Does it try to send anything out? Gate 5: is it on a list of known bad packages? That's what a virus scanner does."

"And the five packages. requests is the real, popular one, and it's approved. react-codeshift is the one our attacker just registered. reqeusts is the typo version. unused-imports is the malicious one from our game. And ai-helper-utils-pro is a made-up example of a smarter attack: it's signed, it has no known problems, and its code looks clean."

"At the top right you pick how protected the pipeline is. We start on Unprotected: every gate is off."

**SPACE · requests**  
"requests goes straight through to production. That's fine. It's the real one."

**SPACE · react-codeshift**  
"Now react-codeshift. Every gate is off, so it walks right in. Its hidden code runs, and watch the secrets fly to the attacker."

**SPACE 3 more times**  
"reqeusts: stolen. unused-imports: stolen. ai-helper-utils-pro: stolen. With no gates, every bad package wins."

**CLICK Typical**  
"Now Typical. Only gate 5 is on, the known-bad list. This is where most teams are today."

**SPACE · requests**  
"requests: fine."

**SPACE · react-codeshift**  
"react-codeshift: stolen. Why? Gate 5 only knows packages that were already reported as bad. react-codeshift was registered two days ago. Nobody has reported it yet."

**SPACE · reqeusts**  
"reqeusts: blocked at gate 5. It was reported months ago, so it's on the list."

**SPACE · unused-imports**  
"unused-imports: blocked at gate 5 too, same reason."

**SPACE · ai-helper-utils-pro**  
"ai-helper-utils-pro: stolen. It's brand new and looks clean, so the scanner has nothing on it. A virus-style scanner only catches old attacks, and slopsquatting names are new by design."

**CLICK Hardened**  
"Now Hardened. Every gate is on."

**SPACE 5 times**  
"requests passes everything and reaches production. react-codeshift: blocked at gate 1. reqeusts: gate 1. unused-imports: gate 1. ai-helper-utils-pro: gate 1. Every bad package stops at the very first gate, and the good one still gets through."

"Why is gate 1 so strong? It uses a lockfile. Think of it as an approved shopping list. Someone on the team already decided which packages the project uses, and each one is saved with a fingerprint, called a hash. If a package isn't on the list, or its fingerprint doesn't match, it doesn't get in. The AI's invented name was never on the list, so it doesn't matter how clean it looks."

**OPTIONAL · CLICK gate 1, CLICK the react-codeshift card, SPACE**  
"What if someone forgets gate 1? Let's switch it off and run react-codeshift. Gate 2, does it exist? Yes, it passes, because our attacker registered it in the last demo. So checking that a name exists isn't enough anymore. But gate 3 catches it: created 2 days ago, only one release. That's why layers matter. If one gate is missing, the next one catches it."

### 15. Spot a phantom in 10 seconds (Space 6 times)
*On screen: A mock registry page for react-codeshift. Each Space highlights one red flag.*

"So how do you protect yourself? Let's start with something anyone can do, even if you don't code. You can spot a phantom in about 10 seconds. Before you install a package an AI suggests, look it up on the registry. Here's what react-codeshift's page might look like."

**SPACE**  
"Red flag one: brand new. Published two days ago. Real, popular tools are usually years old."

**SPACE**  
"Red flag two: only one release, version 1.0.0. Real tools usually have a long history of updates."

**SPACE**  
"Red flag three: no link to its source code. Real tools almost always show where their code lives, so anyone can check it."

**SPACE**  
"Red flag four: unknown publisher. A fresh account with no other packages."

**SPACE**  
"And the last check: is this name in the tool's official documentation? For react-codeshift, no. It only exists because an AI said so."

**SPACE**  
"So here's the simple rule: copy install commands from the official docs, not from the AI."

### 16. Best practices, in three layers (Space 4 times)
*On screen: Three columns: you using AI, your project and pipeline, your AI agents. Then a "not enough on its own" line.*

"Beyond spotting fakes, protection comes in three layers. Some stop the attack from happening. Others limit the damage if something slips through. Developers, the exact settings are on screen and in the checklist, so feel free to take a screenshot."

**SPACE**  
"Layer one: you, when you use AI. Look the name up on the registry before installing. Copy install commands from the official docs. And give your AI tool a written rule. Many AI tools read a file called AGENTS.md. Put something like: only use packages already in the project, and ask me before adding a new one."

**SPACE**  
"Layer two: your project and pipeline. These are the gates from the simulator. First, install only what the lockfile approves, the approved shopping list. That's gate 1. Second, hold back brand-new releases for about a week. It's like not buying a product on day one with zero reviews. Fakes usually get reported within days. That's gate 3. Third, don't let packages run install scripts by default, so nothing runs the moment it arrives. That's gate 4."

**SPACE**  
"Layer three: your AI agents. Make them ask for your approval before they install anything. Run them in a sandbox, a sealed-off space where they can't reach the rest of your computer. And never keep real passwords or keys where agents or installs run. If there are no keys to steal, the attack gets nothing."

**SPACE**  
"And one warning. Some things people trust are not enough on their own. Virus-style scanners: a brand-new fake has no report yet. Signatures: they prove who built a package, not that it's the one you actually wanted. And download counts are easy to fake. They help, but don't rely on them alone."

### 17. Already installed one? (Space 4 times)
*On screen: Four numbered steps.*

"And what if it already happened? You or your AI already installed one. Four steps."

**SPACE**  
"One: remove it. Uninstall it, and restore your lockfile, the approved list, to how it was before the package was added."

**SPACE**  
"Two, and this is the most important one: change every secret. Assume every password, key and token that machine or pipeline could reach has been stolen, and replace them all. Removing the package does not un-send the keys."

**SPACE**  
"Three: check what else changed. New files, recent builds, changes to the lockfile, strange network activity. The hidden code may have left something behind."

**SPACE**  
"Four: report it. On npm and PyPI there's a 'Report malware' button on the package page. For PHP's Packagist, use their contact page. That gets it taken down for everyone else."

### 18. Three things to keep (Space 3 times)
*On screen: Three takeaways, then the checklist link.*

"If you remember only three things from tonight, make it these."

**SPACE**  
"One: treat package names from AI like a link from a stranger. It might be fine, but check before you click."

**SPACE**  
"Two: pin your packages with fingerprints, using a lockfile with hashes. Then any name nobody approved fails automatically."

**SPACE**  
"Three: never let AI agents or automatic tools install packages where real passwords and keys live. The full checklist, with every command and setting, is at the link on screen."

### 19. Sources
*On screen: The list of sources.*

"Every fact tonight comes from these sources. They're all in the repo too, with notes on how well each one could be checked. I'll leave this up for a moment."

### 20. Meme, then thank you (Space once)
*On screen: "Your AI is hallucinating packages? Just scream this at it." over the exorcist meme: "The power of code compels you!" Underneath: "(It won't work. The lockfile will.)"*

"And I'll leave you with this. Your AI is hallucinating packages? Just scream this at it: THE POWER OF CODE COMPELS YOU! ... It won't work. The lockfile will."

**DO**  
Pause and let it land.

**SPACE**  
"Thank you so much for listening. I'm happy to take any questions."

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
