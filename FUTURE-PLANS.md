# Future plans — reference notes

Parking lot for UI/feature directions to revisit during future polishing sessions. Nothing here is committed work — it's options and context so we can pick up any thread without re-deriving it. Ask me about any section by name.

Last updated: 2026-07-25.

---

## 1. UI direction (the big fork — undecided)

The current app is a deliberately unstyled, send-only diagnostic harness (13 panels). "Working on the UI" could mean any of these. This decision shapes how everything else is structured, so pick it first.

- **A. Polish the diagnostic harness.** Keep all 13 panels and the send-only model; make it clean and usable — tabs/sections, better layout, readable styling. Lowest risk; stays a complete test tool.
- **B. Two-way controller.** Panels reflect the SP's live state via MIDI IN (knobs/effects/pads mirror the hardware, not just send). Biggest payoff, bigger build. See §2 for how it works.
- **C. Focused performance UI.** Pick the subset actually used live (e.g. effects + pads + pattern launch), design that well, hide/drop the rest of the diagnostic panels.

Not mutually exclusive long-term: could polish (A) now and layer mirroring (B) later.

---

## 2. Two-way mirroring — how it would work (mechanism settled, build not started)

Reflecting the SP's state in the UI, not just sending to it.

- **Mechanism:** listen on **MIDI IN** (already wired — it's what feeds the monitor). When you operate the SP it *transmits* MIDI: effect knobs/switches send CC16-19/80-83, pads send note-ons (if PAD Note Out on), DJ controls send CC7/8/20-27, clock sends F8. Mirroring = route those already-decoded incoming messages to the matching UI control instead of only logging them.
- **Hard limit — no snapshot.** The SP-404MK2 has **no SysEx and no state readback**. You cannot query "what effect is loaded" or "what's the knob at." Mirroring is *passive*: it reflects changes made *after* the app is listening; it can't pull the current state. First move of a knob syncs it; before that the app is guessing. This is inherent to the device, not a limitation we can engineer away.
- **Depends on SP transmit settings** being on: PAD Note Out, SEQ Note Out, MIDI Sync Out (device menu).
- **USB-C vs 5-pin DIN:** same messages, different plumbing. **USB-C** = the SP appears as both MIDI input and output on one cable; pick it as the input, done (the easy path, what we'd target). **DIN/TRS** = the browser can't see the SP's MIDI OUT directly; you'd need SP MIDI OUT → a USB-MIDI interface → computer, and select that interface as the input.
- **Suggested proof-of-concept first step (low risk):** wire only the **effects panel** to mirror incoming CC16-19/80-83 — sliders + effect dropdown follow the SP's knobs — then decide whether to extend mirroring to pads/DJ/etc. `busEffect[ch]` state and the monitor's `describe()` decoding already do most of the parsing.

---

## 3. Constraints (no preference stated yet)

- **Single-file / no-build** is the current default and the project's ethos (same as the VG800 app). Keep unless a build step clearly pays for itself.
- **Installable + offline (PWA)?** The VG800 app is a PWA (manifest + service worker). Could add the same here so it installs and works offline. Open question.
- **Build step?** Only if component/bundler tooling makes the UI work meaningfully easier. Not needed today.

---

## 4. Deferred: hardware smoke test

Not critical per Roy, but the cheapest insurance before building UI on top of the MIDI layer. ~5 minutes with the current harness + monitor:
- **Pad remap** (recently fixed): tap the app's "Pad 1" (bottom-left) → does the SP trigger *its* pad 1? Spot-check a few.
- **Routing states** (recently added): set FAVORITE 1-16 on the SP → do BUS 3/4 actually come alive? Set Bypass → silent?
- **Core sends:** effect CC on each bus lands; looper CCs (in Looper mode); pattern Program Change (with PC Rx on); DJ CC7/8.
- Everything is manual-verified but not yet hardware-verified. Ask me for a printable checklist when ready.

---

## Already shipped (context, not a to-do)

- 13-panel diagnostic harness, all values driven from `sp404mk2-midi-map.json` and `sp404mk2-shortcuts.json`, verified line-by-line against the v5.50 manual (see `MIDI-VERIFICATION.md`).
- Pad note↔number mapping fixed (note 36 = Pad 13, not Pad 1).
- Declared audio-routing bar with per-bus active/inactive states (BUS 3/4 dim when FAVORITE = Bypass).
- Shortcut Finder (panel 13) — 70 hardware combos, searchable, categorized.
- Global Panic button (all notes/sound off, all 16 channels).
- Live on GitHub Pages: https://fxcircus.github.io/roland-sp404mkii-controller/ (auto-redeploys on push to `main`).
