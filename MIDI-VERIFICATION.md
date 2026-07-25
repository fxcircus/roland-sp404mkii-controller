# MIDI map verification against the official manual

Cross-checked `sp404mk2-midi-map.json` line-by-line against the **SP-404MK2 Reference Manual v5.50** (chart dated Jul 01 2025, version 5). Source text extracted to `manual-v550-text.txt` (see `manual-index.md` for section/page pointers).

**Result: one substantive error found and fixed (pad note↔number mapping). Everything else in the map is correct, including the two items previously flagged as "inferred" — both are now confirmed by the manual.**

## Errors found and fixed

### 1. Pad note → pad-number mapping was wrong (fixed)
The old map claimed `note = 36 + pad_index` (note 36 = Pad 1, 37 = Pad 2 …). The manual's MIDI note map (pp.170-172) shows the pads are **not** in note order — they are grouped by physical row:

| notes | pads | row |
|---|---|---|
| 36 37 38 39 | 13 14 15 16 | top |
| 40 41 42 43 | 9 10 11 12 | |
| 44 45 46 47 | 5 6 7 8 | |
| 48 49 50 51 | 1 2 3 4 | bottom |

So pressing what the app called "Pad 1" (note 36) actually triggered the device's **Pad 13**. Fixed in both the JSON (`pad_note_map` added as the authoritative table; formula corrected) and the app (grid now labels each button with the real pad number and lays them out in hardware order — pad 1 bottom-left). This is almost certainly the "some things don't work as expected" you saw.

## Previously "inferred", now confirmed by the manual

### 2. Ctrl 4/5/6 = CC 80/81/82 = the 4th/5th/6th listed parameter — CONFIRMED
- Manual p.33 "Editing the effects": **CTRL 1-3 edit the main parameters; holding [VALUE] + CTRL 1-3 edits the sub-parameters.**
- The MFX List (pp.143-157) prints each effect's parameters in that exact order — main (1-3) then sub (4-6).
- Implementation chart (p.168) example: `0xB2 50 7F` = "BUS 3 **Ctrl 4**=127", pinning **CC80 = Ctrl 4** (hence 81 = Ctrl 5, 82 = Ctrl 6).
- The `*7` table (p.169) lists CC16/17/18 = Ctrl 1/2/3 and CC80/81/82 = Ctrl 4/5/6 explicitly.

### 3. The SP transmits Ctrl 4-6 CCs (held-VALUE combos) — CONFIRMED
Implementation chart: `CC#80–83  o  o` — the first column (Transmitted) is **o = yes**. With only three physical CTRL knobs, the transmitted CC80-82 can only originate from held-VALUE + CTRL 1-3 moves. So the SP does mirror Ctrl 4-6 on its MIDI out.

## Verified correct (no change needed)

- **Channels** — CH1-4 = BUS 1-4, CH5 = INPUT, CH11 = Vocoder (notes 0-127 + pitch bend), CH16 = chromatic (notes 36-60). Pad banks CH1-10 = Bank A-J. (chart p.167, `*7` p.169)
- **EFX control CCs** — CC19 switch (0-63 OFF / 64-127 ON), CC83 select, CC16/17/18 = Ctrl 1-3, CC80/81/82 = Ctrl 4-6. (p.169)
- **CC#83 effect-select tables** — all three tables match exactly: bus_1_2 (0-42, ends 42 DJFX Delay), bus_3_4 (0-40, ends 40 DJFX Delay), input_fx (0-17, ends 17 Compressor). (pp.157-160)
- **All 46 effect parameter lists** — every parameter name, order, and value range checked against the MFX List (pp.143-157). All match. (Minor cosmetic shortenings only, e.g. Resonator CHORD list and Tape Echo MODE combos are abbreviated in the map.)
- **Looper CCs** — CC88 REC (127 start / 0 stop), CC89 overdub, CC87 delete, CC91 (127 UNDO / 0 REDO), CC90 BPM/PLAY-RATE, CC85 stop all, CC86 tempo reset. (pp.169-170)
- **DJ mode** — recognized: CC7 volume on CH1/CH2/CH3, CC8 X-FADE on CH1 only. Transmit-only: CC20-27. (`*8` p.169)
- **Pattern launch** — Program Change 0-15 = Pattern 1-16, channel selects bank; chart example `0xC3 0F` = Bank D Pattern 16. (p.170)
- **EXT SOURCE** — note 35 (B1) in Mode A, note 0 in Mode B; TOGGLE/GATE/THROUGH behavior. (note map p.172)
- **System realtime** — Clock/Start/Stop recognized in remote mode; All Sound Off recognized in chromatic mode (CH16); Active Sensing both ways. (chart p.168)
- **Not MIDI-controllable / transmit-only** items — consistent with the chart's `x` entries and the DJ transmit-only note.
