# Audio, v1.1.68

| Uploaded file | Bundled cue | Trigger |
|---|---|---|
| home.mp3 | home | Title, home, roster, gacha and quiz screens; loop |
| sentou.mp3 | battle | Battle; loop |
| botan.mp3 | button | Enabled button activation |
| kougeki2.mp3 | attack | Normal attack impact; not per victim |
| シャキーン2.mp3 | skill | Special-skill cut-in starts |
| gatya.mp3 | gacha | Gacha result reveal |
| seikai.mp3 | correct | An accepted correct answer |
| huseikai.mp3 | wrong | An accepted incorrect answer |
| kati.mp3 | win | Battle result changes to victory |
| make.mp3 | lose | Battle result changes to defeat |

The uploaded originals are untouched. Project copies are stereo MP3 at 44.1 kHz, 112 kbps for BGM and 96 kbps for effects. Per-file gain corrections target a conservative mean level, with a -4 dB peak ceiling before encoding. All final files were decoded and checked: measured peaks are at or below -3.3 dBFS. Source measurements and corrections are in `audio-levels-v184.json`.

## Mixer and lifecycle

- Default BGM 25%, effects 65%; independently adjustable, plus all-mute. Settings use a separate localStorage key and never affect progress.
- Web Audio starts only after a trusted pointer/keyboard interaction. Unsupported or failed audio never prevents gameplay.
- Home and battle loops are mutually exclusive. Late downloads cannot start an old scene's BGM. Old decoded BGM is released when switching scenes to reduce mobile memory use.
- Pause and background/portrait states stop sound. BGM position is retained for resume. Victory/defeat stop battle BGM and play a single result cue; leaving/restarting stops the old jingle.
- Attack sounds use a lower cue gain, a 160 ms throttle, at most two voices and a short faded tail. All effects together have a six-voice cap and a compressor protects mixed peaks.
- Special, gacha and answer cues briefly duck BGM. ×2 battle speed never changes audio playbackRate.
- Audio downloads are lazy and cached by the existing service worker on use. No multi-megabyte audio files are added to the initial precache shell. Previously used sounds are available offline; unvisited/undownloaded audio requires an initial connection.

## Validation

- `tests/audio-v184.test.mjs`: unlock, scene races, independent stored sliders, mute, pause/resume, hidden pages, overlapping attacks, result de-duplication, ducking and recoverable loading failures.
- `tests/audio-v184.html`: real-browser playback and settings verification without touching saved game progress.
- Audio hooks preserve existing gameplay, gacha probabilities, quiz rewards and campaign balance.
