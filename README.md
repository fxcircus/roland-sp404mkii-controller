# SP-404MK2 MIDI Test Harness

A single-file Web MIDI diagnostic UI to hardware-test every receivable MIDI function of the Roland SP-404MK2. No build step, no dependencies. Everything (effect tables, parameter names, CC numbers, note ranges) is loaded at runtime from `sp404mk2-midi-map.json` — the map is the single source of truth.

## Run

```
python3 -m http.server 8404
```

Then open http://localhost:8404/ in **Chrome or Edge** (Web MIDI required; `file://` won't work because the app fetches the JSON map).

## UI

A sketch / record-sleeve style single page with a sticky jump-menu across the top. Tweakable parameters are **knobs** (drag vertically, scroll, or double-click to reset); actions are **buttons**. Sections:

1. **Setup** — output/input port pickers, connection lamp, and a global **Panic** (all notes/sound off, all 16 channels). Port selection persists in localStorage.
2. **Effects** — a "declare your routing" bar plus one strip per bus (BUS 1-4 = ch1-4, INPUT = ch5): EFX on/off (CC19), effect selector styled as an LCD (from the bus's CC83 table), and six Ctrl **knobs** (CC16/17/18/80/81/82) relabeled per effect with unused ones dimmed. Bypassed BUS 3/4 dim with an "inactive" badge based on your declared FAVORITE setting.
3. **Pads** (MIDI Mode A) — bank A-J buttons (ch1-10), a **hardware-correct** 4×4 colour grid (pad 1 top-left … pad 16 bottom-right) each sending the right note per the manual's note map, a velocity knob, and an EXT SOURCE button (note 35) in toggle or gate mode.
4. **Keys** — chromatic keyboard (ch16, notes 36-60) + All Sound Off, and the vocoder keyboard (ch11) with a pitch-bend knob that springs back to centre on release.
5. **Patterns** — bank buttons plus 16 Program Change buttons (PC 0-15).
6. **Looper** (ch1) — rec start/stop (CC88), overdub (CC89), delete (CC87), undo/redo (CC91), stop all (CC85), tempo reset (CC86), and a rate knob (CC90).
7. **Transport** — Start (FA), Stop (FC), Continue (FB, untested), and a 24 ppqn F8 clock generator with a BPM knob.
8. **DJ mode** — the recognized CCs only, as knobs: CC7 on ch1/2/3, CC8 on ch1.
9. **Shortcut Finder** — searchable reference of the SP-404MK2's 70 hardware button combos (from `sp404mk2-shortcuts.json`), grouped by category, each showing whether the app can reproduce it over MIDI and a deep link to Roland's manual.

**Developer tools** (collapsed at the bottom, toggle open) — the diagnostic panels kept for later: **MIDI monitor** (timestamped IN/OUT log with hex + JSON-resolved decode, filter, clear), **Raw sender** (three hex byte fields), and the **Verification checklist** (the two manual-resolved hardware questions with scripted Test buttons). Every message still shows its hex in the monitor.

## Reference material

- `sp404mk2-midi-map.json` — the runtime MIDI map; single source of truth for the test panels.
- `sp404mk2-shortcuts.json` — the runtime data for the Shortcut Finder (panel 13).
- `MIDI-VERIFICATION.md` — cross-check of every map value against the official manual (what was verified, the one error fixed).
- `manual-v550-text.txt` + `manual-index.md` — full searchable manual text with a section/page index.
- `SP-404mk2_v550_reference_eng04_W.pdf` — the original manual.
