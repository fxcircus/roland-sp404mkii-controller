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
- Both JSONs were verified line-by-line against the official v5.50 manual — see `MIDI-VERIFICATION.md`.

## Reference material (searchable, committed)
- `manual-v550-text.txt` + `manual-index.md` — full extracted manual text with a section/page index. Grep the .txt.
- `SP-404mk2_v550_reference_eng04_W.pdf` — the original 26 MB Roland manual. **This PDF is git-ignored and must NEVER be committed/pushed** (it's heavy and it's Roland's copyrighted doc). It stays local only; the extracted text is the substitute.

## GitHub / deploy workflow — when Roy says "push"
Do this every time, no need to ask:
1. `git add -A && git commit -m "…"`
2. `git push origin main`

- Remote: `origin` = `git@github.com:fxcircus/roland-sp404mkii-controller.git` (SSH — this Mac pushes over SSH as `fxcircus`; no gh CLI, no tokens).
- GitHub Pages serves from branch `main`, folder `/root`. **Live site: https://fxcircus.github.io/roland-sp404mkii-controller/** — a push to `main` redeploys it automatically (no extra step). `.nojekyll` is present so Pages serves the files as-is.
- Never commit the Roland PDF (see above). It's in `.gitignore`; keep it there.

## Notes
- No SysEx in either direction: the app can't read the SP's current state (effect, knob positions, sample names, or audio routing). It owns its own UI state and only sends.
- Hardware bus routing (BUS 1/2 TYPE A serial vs TYPE B parallel; BUS 3/4 FAVORITE Bypass/1-16; DRY routing; Input Bus) is hardware-only and not MIDI-readable — the app cannot detect it.
