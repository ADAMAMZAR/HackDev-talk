# Phantom Dependencies: How Attackers Pre-Register Your AI's Imagination

HackDev Webinar. Speaker: Shananth. About 25 minutes, online.

Slopsquatting is when attackers register package names that AI coding tools hallucinate.
This talk shows how it works and which CI/CD checks stop it. You only watch; the speaker
drives every demo on screen.

## What is in this folder

| Path | What it is |
|------|------------|
| `deck.html` | The slides and all four demos. One file, no install, no internet needed. |
| `docs/sources.md` | Where each fact on the slides comes from, and how well I could verify it. |

## Open the slides

Open `deck.html` in Chrome or Edge, click the page once, then press `F` for fullscreen.

| Key | Does |
|-----|------|
| `→` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Space` | Next step on this slide; moves on when the slide has no steps left |
| `R` | Reset the current demo |
| `F` | Fullscreen |
| `Home` / `End` | First / last slide |
| `P` | Presenter notes in a separate window. Keys typed there also drive the deck. |

Every demo button can also be clicked with the mouse.

## The demos

All demos are scripted and simulated. There is no real AI and no real registry.

1. **Real or phantom?** (slide 2): pairs of package names, one real and one fake.
2. **Hallucination roulette** (slide 4): the same question asked five times. Four answers
   suggest `react-codeshift`.
3. **The attacker's view** (slide 6): search a mock registry, publish the free name, watch
   installs arrive.
4. **Pipeline simulator** (slide 10): five gates, five package cards, three presets. Click
   gates to switch them on or off. The result comes from each card's details and the gate
   rules, so any mix of gates works. `ai-helper-utils-pro` and the card details are
   illustrative.

Expected simulator results:

| Card | Unprotected | Typical | Hardened |
|---|---|---|---|
| requests | Production | Production | Production |
| react-codeshift | Secrets stolen | Secrets stolen | Blocked at gate 1 |
| reqeusts | Secrets stolen | Blocked at gate 5 | Blocked at gate 1 |
| unused-imports | Secrets stolen | Blocked at gate 5 | Blocked at gate 1 |
| ai-helper-utils-pro | Secrets stolen | Secrets stolen | Blocked at gate 1 |

Open `deck.html#selftest` and check the browser console for `selftest ok` to confirm the
rules still match this table after you edit the cards or gates.

## Edit the content

Slide text is in the HTML. Demo data (pairs, AI answers, installers, gates, cards, presets,
speaker notes) is in the arrays at the top of the `<script>` block.
