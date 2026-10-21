# 04b · KedaiKita: "Packages that are too old"

A small campus marketplace. It works fine, but `package.json` pins two old libraries the way an AI writing from memory might:

```json
"axios": "0.21.1",
"lodash": "4.17.15"
```

This folder is its own git repo. The vulnerable versions are committed, so you can always reset.

## Run

Double-click `start-demos.bat` in the project root, or run `npm run dev` here. It opens at http://localhost:5104.

## On stage (10:00–11:30)

Click the **Demo** pill (bottom right), or press **`** (the backtick key), to open the terminal. It runs the **real** commands on your laptop through the dev server and shows their real output. The header shows the versions currently in `package.json`.

1. Point at the header: `axios 0.21.1 · lodash 4.17.15`.
2. Click **npm audit**. A wall of red advisories, ending in **2 high severity vulnerabilities** (about 5 seconds). Let it sit.
   "Each line here is a published vulnerability. It took one second to find."
3. Click **Update packages**. This runs `npm install axios@latest lodash@latest` (about 15 seconds) and ends in `found 0 vulnerabilities`. The header changes to `axios ^1.20.0 · lodash ^4.18.1`.
4. Click **npm audit** again: `found 0 vulnerabilities`.
5. Mention: Python users run `pip-audit`. On GitHub, turn on **Dependabot** so updates come to you automatically.

The script says `npm audit fix`. Tested 19 Oct: `npm audit fix --force` needs **two runs** here (the first only moves axios to 0.21.4), which is why the button uses `npm install …@latest` instead. If you'd rather show `npm audit fix`, say "or `npm audit fix`, run it until audit is clean."

## Reset between rehearsals

Click **Reset** in the terminal. It runs `git checkout -- package.json package-lock.json && npm install`, puts the old versions back, and clears the output. Tested: `npm audit` shows the 2 high vulnerabilities again.

`npm audit` and the update need internet. Keep screenshots of the red output and the clean output in `backups/04b/`.
