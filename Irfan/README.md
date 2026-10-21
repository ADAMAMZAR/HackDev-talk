# Initiate Your 1st Project

HackDev Webinar, talk 01, 25 October 2026. Speaker: Irfan Ali.

A process for starting your first project: plan without AI, research what already exists,
loop until the idea is ready, then set up a clean starter. You apply it to your own idea;
nothing here is a product to copy.

## What is in this folder

| Path | What it is |
|------|------------|
| `deck.html` | The slides. One file, no install, no internet needed. |
| `docs/planning-worksheet.md` | Fill in by hand before you build: problem, user, risks, steps, done means. |
| `docs/research-checklist.md` | Eight questions to ask about every existing solution you find. |
| `docs/live-commands.md` | The exact commands from the live segment. |
| `docs/sources.md` | Where each check in the exit condition comes from, and how well I could verify it. |
| `starter/` | A tiny Python project skeleton: layout, `.gitignore`, `pyproject.toml`, one passing test. |

## Open the slides

Open `deck.html` in Chrome or Edge, click the page once, then press `F` for fullscreen.

- Left and right arrows change slides.
- `Enter` plays the next command on slides that have a terminal.
- `T` hides the terminal. On the last list slide, click an item or press `1` to `4` to jump
  to it, and `B` to come back.

The terminals are scripted playback, not a live shell. Slide 9 is a staged example, and
slide 19 is trimmed from a real run.

## Use the starter

Needs Python 3.10 or newer. No third-party packages.

```bash
cp -R starter my-first-project
cd my-first-project
python3 -m venv .venv
source .venv/bin/activate
python -m unittest discover -s tests -v
```

Rename `myproject` in `src/` and `pyproject.toml` to your project's name, then write your
own first test before your first line of code.

## The exit condition

Loop between planning and research until all four are true. Stop after three loops and
pick a smaller idea if you are still not ready.

1. The problem is one sentence.
2. One real person with the problem said "yes, that is me".
3. You know your riskiest assumption and one cheap way to test it.
4. Version 1 fits your time box, for example one weekend.

Sources and caveats are in `docs/sources.md`.
