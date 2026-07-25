# CLAUDE.md — roland-sp404mkii-controller

Single-file Web MIDI diagnostic harness for the Roland SP-404MK2. No build step, no dependencies, Chrome/Edge only.

## Run locally
```
python3 -m http.server 8404
```
Open http://localhost:8404/ in Chrome or Edge (Web MIDI needs a Chromium browser; `file://` won't work because the app `fetch`es the JSON files).

## Architecture
- `index.html` — the entire app. Panels 1-12 = MIDI test harness; panel 13 = Shortcut Finder.
- `sp404mk2-midi-map.json` — **single source of truth** for the MIDI panels. Every effect name, CC number, parameter, and note range is loaded from here at runtime. Do NOT hardcode effect names or CC values in the UI code — render from the JSON.
- `sp404mk2-shortcuts.json` — data for the Shortcut Finder (panel 13), same runtime-render pattern.
- Both JSONs were verified line-by-line against the official v5.50 manual — see `plans/MIDI-VERIFICATION.md`.

## Local-only `plans/` folder (git-ignored — NEVER pushed)
The entire `plans/` directory is in `.gitignore`. It holds reference/planning material we deliberately keep out of the public repo: `plans/manual-v550-text.txt` + `plans/manual-index.md` (grep the .txt), `plans/MIDI-VERIFICATION.md`, `plans/FUTURE-PLANS.md`, `plans/reference_ui.jpg` (the target design), and `plans/SP-404mk2_v550_reference_eng04_W.pdf` (the 26 MB Roland manual — heavy + copyrighted, never commit it). Keep adding anything that shouldn't be uploaded to `plans/`. The two runtime JSONs (`sp404mk2-midi-map.json`, `sp404mk2-shortcuts.json`) must stay in the **repo root** — the app fetches them relative to `index.html`, so moving them into `plans/` breaks the app.

## GitHub / deploy workflow — push after EVERY finished change
Don't wait to be told "push". As soon as a change is complete, do this without asking:
1. `git add -A && git commit -m "…"`
2. `git push origin main`

Pushing *is* how Roy reviews the work — GitHub Pages redeploys from `main` automatically and he looks at the live site, not localhost.

- Remote: `origin` = `git@github.com:fxcircus/roland-sp404mkii-controller.git` (SSH — this Mac pushes over SSH as `fxcircus`; no gh CLI, no tokens).
- GitHub Pages serves from branch `main`, folder `/root`. **Live site: https://fxcircus.github.io/roland-sp404mkii-controller/** — a push to `main` redeploys it automatically (no extra step). `.nojekyll` is present so Pages serves the files as-is.
- Never commit the Roland PDF (see above). It's in `.gitignore`; keep it there.

### Verifying before you push
Browser automation is **not** a gate — it's often unavailable, and Roy doesn't expect it. Verify what can be checked statically, then push:
- `node --check` the extracted inline `<script>` (the app is one file, so a syntax error takes the whole page down).
- Confirm CSS `{`/`}` balance and that every `$('id')` in the script has a matching `id="…"` in the markup.
- For visual/SVG work, render to PNG offline and actually look at it — e.g. write a standalone `.svg` and `qlmanage -t -s 1400 -o . file.svg`. This has caught real defects that reasoning alone missed.
- Say plainly what was and wasn't verified in the summary.

## Notes
- No SysEx in either direction: the app can't read the SP's current state (effect, knob positions, sample names, or audio routing). It owns its own UI state and only sends.
- Hardware bus routing (BUS 1/2 TYPE A serial vs TYPE B parallel; BUS 3/4 FAVORITE Bypass/1-16; DRY routing; Input Bus) is hardware-only and not MIDI-readable — the app cannot detect it.
