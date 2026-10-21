# myproject

One sentence: what problem this solves and for whom.
(Copy it from your planning worksheet.)

## Status
v1 not built yet. Done means: <your "done means" sentence>.

## Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
```

No third-party dependencies yet. Add one only when you can say why, and check that it
exists, how old it is and who maintains it before installing.

## Run the tests
```bash
python -m unittest discover -s tests -v
```

## Layout
- `src/myproject/`: the code
- `tests/`: one test per behaviour
- `docs/`: planning worksheet, research notes, sketches
- `pyproject.toml`: project metadata and dependencies (one manifest)
