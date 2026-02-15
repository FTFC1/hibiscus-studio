# Voice-to-Correction Tools Research

**Date:** 2026-02-15
**Purpose:** Find tools for the workflow: open visual artifact (HTML) in browser -> record voice review -> process transcription into structured corrections -> apply to artifact
**Platform:** macOS (Darwin 23.5.0, Apple Silicon), zsh, ffmpeg + whisper available

---

## TL;DR — Recommended Stack

The exact "voice review -> structured corrections" tool does not exist as a single open-source project. The workflow needs to be assembled from components. Here is the recommended stack, ordered by effort:

### Quick Win (Today)
1. **lightning-whisper-mlx** (transcription) + **Claude Code /process-convo** (structuring)
   - You already have /process-convo. Upgrade transcription speed with MLX-native whisper.
   - `pip install lightning-whisper-mlx` -> transcribe -> pipe to Claude for structured corrections

### Medium Build (1-2 hours)
2. **whisper-writer** with LLM post-processing (TomFrankly fork)
   - Dictation app with hotkey trigger + auto-sends transcript to Claude/GPT for structured output
   - Supports custom system prompts = "extract corrections as JSON"

### Full Solution (Half-day)
3. **Scriberr** (self-hosted web UI) + custom post-processing script
   - Record in browser, auto-transcribe, folder watcher for new files
   - Post-process with Claude API to extract structured corrections

---

## LAYER 1: Transcription Engines (Voice -> Raw Text)

### Tier A: Apple Silicon Optimized (Fastest on your machine)

#### lightning-whisper-mlx
- **URL:** https://github.com/mustafaaljadery/lightning-whisper-mlx
- **Stars:** 872
- **What:** Extremely fast Whisper implementation optimized for Apple Silicon using MLX framework. 10x faster than whisper.cpp, 4x faster than standard mlx-whisper.
- **Install:** `pip install lightning-whisper-mlx`
- **Complexity:** Very low (pip install)
- **macOS:** Native Apple Silicon optimization. This is what you want.
- **Fit:** Drop-in replacement for your current whisper setup. Fastest local option.

#### WhisperKit
- **URL:** https://github.com/argmaxinc/WhisperKit
- **Stars:** 5,600
- **What:** On-device speech recognition specifically for Apple Silicon. Real-time streaming, word timestamps, voice activity detection. Swift-native.
- **Install:** Swift Package Manager / Xcode
- **Complexity:** Medium (Swift ecosystem, not Python)
- **macOS:** Native. Built specifically for Apple devices.
- **Fit:** Best if building a native macOS app. Overkill for CLI workflow.

#### mlx-audio
- **URL:** https://github.com/Blaizzy/mlx-audio
- **Stars:** 5,941
- **What:** Full audio toolkit on MLX — STT + TTS + voice-to-voice. Supports Qwen3-ASR with word-level alignment. Fastest growing in this space.
- **Install:** `pip install mlx-audio`
- **Complexity:** Low (pip install)
- **macOS:** Native Apple Silicon.
- **Fit:** If you want more than just transcription (TTS for reading corrections back, etc.)

### Tier B: High Accuracy (Best transcription quality)

#### faster-whisper
- **URL:** https://github.com/SYSTRAN/faster-whisper
- **Stars:** 20,949
- **What:** 4x faster than OpenAI whisper, same accuracy, less memory. CTranslate2 backend. 8-bit quantization on CPU.
- **Install:** `pip install faster-whisper`
- **Complexity:** Low
- **macOS:** Yes, CPU mode. No GPU acceleration on Mac (CTranslate2 = CUDA focused).
- **Fit:** Gold standard for accuracy. Slightly slower than MLX options on Mac but proven reliable.

#### WhisperX
- **URL:** https://github.com/m-bain/whisperX
- **Stars:** 20,142
- **What:** Whisper + word-level timestamps + speaker diarization. 70x realtime with batched inference. Uses faster-whisper backend.
- **Install:** `pip install whisperx` + HuggingFace token for pyannote
- **Complexity:** Medium (needs HF token, pyannote agreement)
- **macOS:** Yes, but GPU features limited to CUDA. CPU works.
- **Fit:** Best if you need word-level timestamps or multi-speaker separation. Useful if recording two people reviewing together.

#### whisper.cpp
- **URL:** https://github.com/ggml-org/whisper.cpp
- **Stars:** 46,730
- **What:** C/C++ port of Whisper. The most popular implementation. Core Metal acceleration on Mac.
- **Install:** `brew install whisper-cpp` or build from source
- **Complexity:** Low (brew) to Medium (source build)
- **macOS:** Excellent. Core Metal GPU acceleration.
- **Fit:** You likely already have this or something based on it. Solid baseline.

#### Microsoft VibeVoice-ASR
- **URL:** https://github.com/microsoft/VibeVoice
- **Stars:** 23,247
- **What:** Microsoft's open-source frontier voice AI. Handles 60-min long-form audio in single pass. Outputs structured Who/When/What format. Speaker diarization built-in.
- **Install:** Python package
- **Complexity:** Medium
- **macOS:** Should work (Python-based)
- **Fit:** Very interesting for structured output — already outputs speaker-attributed, timestamped text. Newest entry, very active.

### Tier C: Whisper + LLM Post-Processing (Accuracy Enhancement)

#### WhisperGPTTranscriber
- **URL:** https://github.com/frappierer/WhisperGPTTranscriber
- **Stars:** 11
- **What:** Whisper transcription + GPT-4 post-processing. Corrects grammar, clarifies ambiguity, fixes spelling of specific terms/names.
- **Install:** `pip install` + OpenAI API key
- **Complexity:** Low
- **macOS:** Yes
- **Fit:** Closest to what you need conceptually. Small project but the pattern is exactly right: transcribe -> LLM correct -> structured output. Easy to fork/adapt with Claude instead of GPT.

---

## LAYER 2: Dictation / Recording Apps (Voice -> Text with UI)

### VoiceInk
- **URL:** https://github.com/Beingpax/VoiceInk
- **Stars:** 3,747
- **What:** Native macOS voice-to-text app. 99% accuracy claimed. 100% offline. Hotkey activated. Open source but $25 for App Store version. You can build from source free.
- **Install:** Build from source (BUILDING.md) or $25 App Store
- **Complexity:** Medium (Xcode build) or Low (App Store)
- **macOS:** Native. Built for Mac.
- **Fit:** Best "just works" dictation app for Mac. Press hotkey, speak, text appears. No structured output though — pure dictation.

#### OpenWhispr
- **URL:** https://github.com/OpenWhispr/openwhispr
- **Stars:** 1,231
- **What:** Cross-platform dictation app. Supports local Whisper + NVIDIA Parakeet + cloud models (BYOK). Custom dictionary for technical terms.
- **Install:** Download release or build from source
- **Complexity:** Low
- **macOS:** Yes
- **Fit:** Custom dictionary feature is useful — teach it your project names (PUMA, HB, FORJE) for better accuracy.

#### whisper-writer (with TomFrankly LLM post-processing fork)
- **URL:** https://github.com/savbell/whisper-writer
- **PR with LLM features:** https://github.com/savbell/whisper-writer/pull/102
- **Stars:** 1,013
- **What:** Small dictation app with hotkey activation. TomFrankly's fork adds LLM post-processing: transcript gets sent to Claude/GPT/Gemini/Groq/Ollama with custom system prompts.
- **Install:** Clone + `pip install` + configure
- **Complexity:** Medium (Python, needs config)
- **macOS:** Yes (Python app)
- **Fit:** HIGHLY RELEVANT. The LLM post-processing with custom system prompts means you can say "extract corrections as JSON" and get structured output directly from voice. Supports Claude as a provider.

#### VoiceTypr
- **URL:** https://github.com/moinulmoin/voicetypr
- **Stars:** 294
- **What:** AI-powered offline voice-to-text dictation tool. Alternative to Wispr Flow and SuperWhisper. macOS + Windows.
- **Install:** Download release
- **Complexity:** Low
- **macOS:** Yes
- **Fit:** Simple alternative if VoiceInk doesn't work for you.

#### transcribe-anything
- **URL:** https://github.com/zackees/transcribe-anything
- **Stars:** 1,203
- **What:** Multi-backend whisper CLI. Mac-arm optimized via lightning-whisper-mlx. Generates speaker.json with speaker partitioning. Input file or URL.
- **Install:** `pip install transcribe-anything`
- **Complexity:** Very low
- **macOS:** Optimized (uses lightning-whisper-mlx on Mac ARM)
- **Fit:** Best CLI tool for batch transcription. Speaker JSON output is useful for structured processing.

---

## LAYER 3: Self-Hosted Transcription Platforms (Web UI)

#### Scriberr
- **URL:** https://github.com/rishikanthc/Scriberr
- **Stars:** 2,045
- **What:** Self-hosted AI audio transcription with web UI. Speaker diarization, built-in recorder, folder watcher (auto-processes new audio files), REST API, LLM integration (Ollama/OpenAI-compatible), note-taking. PWA support.
- **Install:** Docker or bare metal
- **Complexity:** Medium (Docker) or High (bare metal)
- **macOS:** Yes (Docker)
- **Fit:** Full platform. Record voice note in browser -> auto-transcribe -> chat with LLM about transcript. Folder watcher means you can drop audio files and get transcripts automatically. API keys for programmatic access.

#### Whishper
- **URL:** https://github.com/pluja/whishper
- **Stars:** 2,914
- **What:** 100% local transcription with web UI. Translate, edit subtitles. Powered by whisper models.
- **Install:** Docker compose
- **Complexity:** Medium (Docker)
- **macOS:** Yes (Docker)
- **Fit:** Simpler than Scriberr. Good web UI for transcription management. No LLM integration built-in.

#### WhisperLive
- **URL:** https://github.com/collabora/WhisperLive
- **Stars:** 3,802
- **What:** Near-real-time Whisper implementation. Live microphone transcription + pre-recorded files. WebSocket-based streaming.
- **Install:** `pip install whisper-live`
- **Complexity:** Medium
- **macOS:** Yes
- **Fit:** Real-time transcription while you speak. Could show corrections appearing as you review a page.

#### whisply
- **URL:** https://github.com/tsmdt/whisply
- **Stars:** 89
- **What:** CLI + GUI for batch transcription/translation/speaker annotation. Supports Apple MLX, Nvidia GPU, CPU. Combines faster-whisper + insanely-fast-whisper + mlx-whisper + WhisperX + pyannote.
- **Install:** `pip install whisply`
- **Complexity:** Low
- **macOS:** Yes (MLX support)
- **Fit:** Swiss-army knife for transcription. Good if you want one tool that wraps all backends.

---

## LAYER 4: Screen Recording + Voice (Visual Review Capture)

#### Screenity
- **URL:** https://github.com/alyssaxuu/screenity
- **Stars:** 17,928
- **What:** Chrome extension. Screen recorder with annotation (draw, text, arrows, shapes). Microphone recording with push-to-talk. Blur sensitive content. Trim/crop. No limits.
- **Install:** Chrome Web Store (free)
- **Complexity:** Very low (browser extension install)
- **macOS:** Yes (Chrome)
- **Fit:** Record your screen while reviewing the HTML artifact + speak corrections. Gives you a video artifact of the review. Does NOT auto-transcribe.

#### Cap
- **URL:** https://github.com/CapSoftware/Cap
- **Stars:** 16,972
- **What:** Open source Loom alternative. Screen recording with auto-generated titles, summaries, transcriptions, clickable chapters. Thread commenting on recordings. Self-hostable.
- **Install:** Download desktop app or Docker (self-host)
- **Complexity:** Low (app) or Medium (self-host)
- **macOS:** Yes (native app)
- **Fit:** HIGHLY RELEVANT. Record screen + voice -> auto-transcription -> auto-summary -> shareable with thread comments. If you self-host, the transcription data could be piped to structured correction extraction.

---

## LAYER 5: Voice-to-Structured Data (Intent Extraction)

#### voice2json
- **URL:** https://github.com/synesthesiam/voice2json
- **Stars:** 1,107
- **What:** Offline voice command -> structured JSON. Define voice command templates -> get JSON intents with slots. Re-training in <5 seconds. Unix pipe friendly.
- **Install:** Docker or Debian package
- **Complexity:** Medium
- **macOS:** Limited (primarily Linux, Docker works)
- **Fit:** Interesting concept but designed for voice COMMANDS (predefined patterns), not free-form voice REVIEW. Would need heavy templating to work for corrections.

#### Pipecat
- **URL:** https://github.com/pipecat-ai/pipecat
- **Stars:** 10,288
- **What:** Open source framework for voice + multimodal conversational AI. Orchestrates audio, AI services, transports, conversation flows. Pipecat Flows for state management.
- **Install:** `pip install pipecat-ai`
- **Complexity:** High (framework, not a tool)
- **macOS:** Yes
- **Fit:** Overkill for this use case. Building a full conversational agent. But the architecture is interesting for a future "review assistant" that guides you through corrections interactively.

---

## LAYER 6: Browser Extensions for Voice Annotation

#### Talk & Comment
- **URL:** Chrome Web Store (not open source)
- **What:** Add voice comments to any webpage. Record voice, attach to specific page elements. Share via link.
- **Fit:** Closest to "annotate webpage with voice" but not open source and not structured output.

#### GitHub Voice Notes
- **URL:** https://github.com/RyanSept/Github-Voice-Notes
- **What:** Record and attach voice comments on GitHub PR reviews. Chromium only.
- **Fit:** Wrong context (GitHub PRs, not HTML artifacts) but interesting pattern.

---

## GAP ANALYSIS: What Doesn't Exist Yet

No single open-source tool does this complete workflow:

```
1. Open HTML page in browser
2. Press hotkey to start recording
3. Speak corrections while looking at specific sections
4. Tool captures: timestamp + what you said + (optionally) what part of page you were looking at
5. Transcribes with high accuracy
6. LLM processes transcript into structured corrections:
   {section: "header", action: "change", from: "current text", to: "new text"}
7. Applies corrections to the HTML file
```

The closest you can get today is assembling steps:
- **Step 2-3:** Screenity or Cap (record screen + voice)
- **Step 5:** lightning-whisper-mlx or faster-whisper (transcribe)
- **Step 6:** Claude API with custom prompt (structure)
- **Step 7:** Claude Code or custom script (apply)

---

## RECOMMENDED BUILD: Voice Review Pipeline

### Option A: Minimal (use what you have)
```
Record voice note (any recorder)
    |
    v
whisper (you already have this)
    |
    v
/process-convo skill (you already have this)
    |
    v
Structured corrections in markdown
    |
    v
Claude Code applies corrections
```
**Effort:** 0 additional setup. Just use existing tools differently.
**Gap:** Whisper accuracy could be better. No visual context (which part of page).

### Option B: Upgraded Transcription
```
Record voice note
    |
    v
lightning-whisper-mlx (pip install, 10x faster)
    |
    v
Claude API post-process (custom prompt: "extract corrections as JSON")
    |
    v
JSON corrections file
    |
    v
Custom script or Claude Code applies to HTML
```
**Effort:** 30 min setup. `pip install lightning-whisper-mlx`.
**Gap:** Still manual recording step.

### Option C: Full Loop (build a small script)
```bash
#!/bin/bash
# voice-review.sh — Record, transcribe, structure, apply

# 1. Record (sox or ffmpeg)
echo "Recording... Press Ctrl+C to stop"
ffmpeg -f avfoundation -i ":0" -t 300 /tmp/review.wav

# 2. Transcribe (lightning-whisper-mlx)
python3 -c "
from lightning_whisper_mlx import LightningWhisperMLX
w = LightningWhisperMLX(model='distil-large-v3', batch_size=12)
result = w.transcribe('/tmp/review.wav')
print(result['text'])
" > /tmp/review-transcript.txt

# 3. Structure with Claude (via API or Claude Code)
# Feed transcript + original HTML to Claude with prompt:
# "Extract all corrections from this voice review as structured JSON"

# 4. Apply corrections
# Claude Code reads JSON + HTML, applies edits
```
**Effort:** 1-2 hours to build and test.
**Benefit:** One command to go from voice to structured corrections.

### Option D: whisper-writer + Claude (Best UX)
```
Install whisper-writer (TomFrankly fork)
    |
    v
Configure LLM post-processing with Claude API
    |
    v
Set system prompt: "You receive voice review transcripts of HTML pages.
  Extract corrections as structured JSON:
  {corrections: [{section, action, description, priority}]}"
    |
    v
Press hotkey -> speak -> structured corrections appear
```
**Effort:** 1 hour setup.
**Benefit:** Hotkey-driven. Speak and get JSON. Best developer UX.

---

## APPENDIX: Star Count Summary (sorted by popularity)

| Tool | Stars | Category |
|------|-------|----------|
| whisper.cpp | 46,730 | Transcription engine |
| VibeVoice (Microsoft) | 23,247 | Transcription engine |
| faster-whisper | 20,949 | Transcription engine |
| WhisperX | 20,142 | Transcription + diarization |
| Screenity | 17,928 | Screen recording + annotation |
| Cap | 16,972 | Screen recording (Loom alt) |
| Pipecat | 10,288 | Voice AI framework |
| mlx-audio | 5,941 | Apple Silicon audio toolkit |
| WhisperKit | 5,600 | Apple Silicon transcription |
| WhisperLive | 3,802 | Real-time transcription |
| VoiceInk | 3,747 | macOS dictation app |
| Whishper | 2,914 | Self-hosted transcription UI |
| Scriberr | 2,045 | Self-hosted transcription platform |
| OpenWhispr | 1,231 | Cross-platform dictation |
| transcribe-anything | 1,203 | CLI transcription multi-backend |
| voice2json | 1,107 | Voice -> structured JSON (commands) |
| whisper-writer | 1,013 | Dictation + LLM post-processing |
| lightning-whisper-mlx | 872 | Fastest Apple Silicon whisper |
| VoiceTypr | 294 | Offline dictation tool |
| whisply | 89 | CLI batch transcription |

---

## Sources (80/20)

- 40% — GitHub API (star counts, repo metadata)
- 30% — GitHub search results and READMEs
- 20% — Web search (comparisons, reviews, documentation)
- 10% — awesome-whisper curated list (https://github.com/sindresorhus/awesome-whisper)
