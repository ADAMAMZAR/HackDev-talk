# Slide 20 live commands (terminal side)

Run from a fresh empty folder next to `starter/`. Python 3.10+. Nothing here installs a
third-party package. `deck.html` plays back the same sequence as a scripted terminal.

```bash
mkdir myproject && cd myproject
git init
python3 -m venv .venv
source .venv/bin/activate
mkdir -p src/myproject tests docs          # make the layout from slide 16
cp -R ../starter/. .                       # fill it with the starter files
tree -a -I '.git|.venv'                    # show the result (needs tree: brew install tree)
python -m unittest discover -s tests -v    # one passing test
git add . && git commit -m "Initial skeleton"
```

Presenting tips:
- Rehearse once end to end on the presenting machine; the run should take under 3 minutes.
- Terminal font 18pt or larger; clear the prompt first (`export PS1='$ '`).
- The deck terminal is scripted, and says so on screen. Show one real run too, or a recording.
- Fallback: a screen recording of the same run, in case Teams or the terminal misbehaves.
