# Manual text index (`manual-v550-text.txt`)

Full text of the SP-404MK2 Reference Manual v5.50, extracted from the PDF (174 pages, `===== PAGE n =====` markers). Grep it directly — e.g. `grep -n "Tape Echo" manual-v550-text.txt`. Key sections for MIDI/effects work:

| Topic | Manual page | approx. line in .txt |
|---|---|---|
| Editing the effects (CTRL 1-3 main / hold-VALUE sub) | 33 | ~994 |
| Main vs sub parameter sharing across buses | 33 | ~1009 |
| Looper mode operation | — | ~1360 |
| MIDI settings (PAD/SEQ Note Out, PC Rx, MIDI Mode, Note offset) | — | ~4145 |
| **MFX List** — every effect's parameters + ranges | 143-157 | ~4385 |
| Filter+Drive / Resonator / Sync Delay / Isolator / DJFX Looper | 143-144 | ~4386 |
| Tape Echo / TimeCtrlDly / Super Filter / vinyl & cassette sims | 147-149 | ~4596 |
| Reverb / Chorus / Flanger / Phaser / Wah / Slicer / Tremolo-Pan | 150-152 | ~4709 |
| Equalizer / Compressor / SX / Cloud Delay / Back Spin / DJFX Delay | 154-155 | ~4892 |
| INPUT FX (Auto Pitch, Vocoder, Harmony, Gt Amp Sim) | 156-157 | ~4989 |
| **Control change → effects (CC#83 select tables per bus)** | 157-160 | ~5073 |
| Shortcut keys (SHIFT/REMAIN/VALUE/DEL/COPY) | 161-163 | ~5199 |
| **MIDI implementation chart** | 167-168 | ~5567 |
| `*7` MIDI channels + EFX control CCs (CC16-19/80-83) | 169 | ~5662 |
| `*8` DJ mode CC table (CC7/8/20-27) | 169 | ~5678 |
| `*8` Looper mode CC table (CC85-91) | 169-170 | ~5720 |
| Program change → patterns (PC0-15) | 170 | ~5743 |
| **MIDI note map** (pad↔note per bank, Mode A/B, EXT SOURCE) | 170-172 | ~5754 |

The original PDF is kept alongside as `SP-404mk2_v550_reference_eng04_W.pdf`.
