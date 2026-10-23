# Slopsquatting checklist

From the talk "Phantom Dependencies". Slopsquatting is when attackers register package names
that AI tools make up. Settings below were checked against the official docs on 23 Oct 2026.

## Before you install anything an AI suggested

- [ ] Look the name up on the registry yourself (npmjs.com, pypi.org, packagist.org).
- [ ] Red flags: published days ago, only one release, no link to source code, unknown publisher.
- [ ] Check the name appears in the tool's official docs. Copy install commands from there, not from the AI.

## In your project

**Install only what the lockfile approves.** Commit the lockfile. In CI, use the install command
that refuses anything not in it.

| Tool | Command |
|------|---------|
| npm | `npm ci` |
| pip | `pip install --require-hashes -r requirements.txt` |
| uv | `uv sync --locked` |
| Composer | `composer install` (with `composer.lock` committed; don't run `composer update` in CI) |

**Hold back brand-new releases.** pnpm's docs note that most malicious releases are found and
removed within an hour, so even a short wait helps.

| Tool | Setting |
|------|---------|
| npm | `min-release-age=7` in `.npmrc` (days) |
| pnpm | `minimumReleaseAge: 10080` (minutes; default 1440 since pnpm 11) |
| uv | `exclude-newer = "7 days"` under `[tool.uv]` in `pyproject.toml` |
| Composer | `"config": {"policy": {"cooldown": {"period": "7 days"}}}` in `composer.json` |
| Dependabot | `cooldown: default-days: 7` in `dependabot.yml` (it already waits 3 days by default for version updates) |

**Don't let install scripts run by default.**

| Tool | Setting |
|------|---------|
| npm | `ignore-scripts=true` in `.npmrc`, then allow only the packages that truly need scripts |
| Composer | keep `allow-plugins` in `composer.json` short; unlisted plugins don't load |

## In your pipeline

- [ ] Run the install step without secrets. Hand passwords, keys and tokens only to the steps that need them.
- [ ] Prefer short-lived tokens over long-lived ones.
- [ ] A malware or CVE scanner helps, but it only knows packages someone has already reported.

## For AI tools and agents

- [ ] Add a rule to your AI tool's instructions file (for example `AGENTS.md` or `CLAUDE.md`):
      "Only use packages already in the project. Ask before adding a new one."
- [ ] Require human approval before an agent runs any install command.
- [ ] Run agents in a sandbox or container with no real passwords or keys.

## If you already installed one

1. Remove it and restore your lockfile from before it was added.
2. Assume every password, key and token that machine or pipeline could reach is stolen. Replace them all.
3. Check what else changed: lockfile changes, recent builds, new files, unexpected network traffic.
4. Report it. npm and PyPI have a "Report malware" button on the package page (PyPI needs you to be logged in). For Packagist, use its contact page.

## Not enough on its own

- CVE scanners: a brand-new fake has no report yet.
- Signatures: they prove who built a package, not that you wanted it.
- Download counts: easy to fake.
