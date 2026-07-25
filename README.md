# SP-404MK2 MIDI Test Harness

A single-file Web MIDI diagnostic UI to hardware-test every receivable MIDI function of the Roland SP-404MK2. No build step, no dependencies. Everything (effect tables, parameter names, CC numbers, note ranges) is loaded at runtime from `sp404mk2-midi-map.json` — the map is the single source of truth.

## Run

```
python3 -m http.server 8404
```

Then open http://localhost:8404/ in **Chrome or Edge** (Web MIDI required; `file://` won't work because the app fetches the JSON map).

## Panels

1. **MIDI setup** — output/input port pickers with connection lamp; selection persists in localStorage.
2. **Effects test** — one column per bus (BUS 1-4 = ch1-4, INPUT = ch5): EFX on/off (CC19), effect dropdown from the bus's CC83 table, six Ctrl sliders (CC16/17/18/80/81/82) relabeled per effect with unused ones disabled.
3. **Looper** (ch1) — rec start/stop (CC88), overdub (CC89), delete (CC87), undo/redo (CC91), stop all (CC85), tempo reset (CC86), rate slider (CC90).
4. **Pad grid** (MIDI Mode A) — bank A-J selector (ch1-10), 4×4 pads laid out in hardware order (pad 1 bottom-left … pad 16 top-right) sending the correct note per the manual's note map, with velocity slider and note-off on release, plus an EXT SOURCE button (note 35) in toggle or gate mode.
5. **Chromatic keyboard** (ch16) — notes 36-60 as clickable keys, plus All Sound Off (CC120).
6. **Pattern launch** — bank selector plus 16 Program Change buttons (PC 0-15).
7. **DJ mode** — the recognized CCs only: CC7 volume on ch1/2/3, CC8 x-fade on ch1.
8. **Realtime** — Start (FA), Stop (FC), Continue (FB, untested), and a 24 ppqn F8 clock generator with BPM input.
9. **Vocoder input** (ch11) — small keyboard plus a pitch-bend slider that snaps back to center on release.
10. **MIDI monitor** — timestamped log of all IN/OUT messages with hex and a JSON-resolved decode (e.g. `ch1 CC17=64 → BUS1 Ctrl2 (FEEDBACK)`); filter box (regex or substring), clear button, optional clock/active-sensing suppression.
11. **Raw sender** — three hex byte fields for ad-hoc messages.
12. **Verification checklist** — the two hardware questions from the map's meta (both now resolved by the manual — see `MIDI-VERIFICATION.md`), each with a scripted Test button and a persisted pass/fail + notes field for optional hardware re-confirmation.
13. **Shortcut Finder** — searchable reference of the SP-404MK2's hardware button combos (from `sp404mk2-shortcuts.json`), grouped by category with a search box and filters. Each entry shows the combo as key badges, what it does, and whether this app can reproduce it over MIDI (App: full / App: partial / Hardware only — hover for how), with a deep link to Roland's manual page.

Every control shows the hex bytes of its last sent message.

## Reference material

- `sp404mk2-midi-map.json` — the runtime MIDI map; single source of truth for the test panels.
- `sp404mk2-shortcuts.json` — the runtime data for the Shortcut Finder (panel 13).
- `MIDI-VERIFICATION.md` — cross-check of every map value against the official manual (what was verified, the one error fixed).
- `manual-v550-text.txt` + `manual-index.md` — full searchable manual text with a section/page index.
- `SP-404mk2_v550_reference_eng04_W.pdf` — the original manual.
