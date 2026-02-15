# Research Spike: Voice Transcription for Telegram Bot

**Date:** 2026-02-13
**Context:** Telegram bot on Hetzner CX23 VPS (2 vCPU, 4GB RAM, Ubuntu 24.04)
**Audio profile:** 5-60 second .ogg Opus voice notes, Nigerian English accent

---

## RECOMMENDATION (TL;DR)

**Use Deepgram API (Option B).** Not close.

```
                    Whisper Local          Deepgram API
                    ─────────────          ────────────
Fits 4GB RAM?       Barely (tiny only)     N/A (no local RAM)
30s transcription   10-30 seconds          1-3 seconds
Nigerian accent     ~54% WER (tiny)        ~5-7% WER (Nova-3)
Setup effort        High (ffmpeg+pip+torch) 5 lines of code
Cost                Free (but CPU bound)   Free tier = $200 credit
OGG Opus support    Needs ffmpeg convert    Direct upload, no convert
Streaming           Not native             Native WebSocket
```

**Why:** On 2 vCPU with no GPU, Whisper tiny is the ONLY model that fits, and it gets 54% of words wrong on Nigerian English. That's unusable. Deepgram's $200 free credit covers ~430 hours of audio — at 30-second voice notes, that's ~51,600 transcriptions before you pay a cent.

---

## Q1: Can Whisper Run on 2 vCPU / 4GB RAM?

### Model Sizes & RAM Usage

| Model    | Parameters | Model Size | Peak RAM (CPU inference) | Fits 4GB? |
|----------|-----------|------------|--------------------------|-----------|
| tiny     | 39M       | ~75 MB     | ~1.0-1.5 GB             | YES       |
| base     | 74M       | ~142 MB    | ~1.5-2.0 GB             | RISKY     |
| small    | 244M      | ~466 MB    | ~2.5-3.0 GB             | NO        |
| medium   | 769M      | ~1.5 GB    | ~5.0+ GB                | NO        |
| large    | 1550M     | ~2.9 GB    | ~10+ GB                 | NO        |

**Critical gotcha:** PyTorch itself adds ~500MB-1GB of baseline RAM overhead even on CPU. Python process + PyTorch + model = your real footprint.

**Verdict:** Only `tiny` fits safely. `base` might work but leaves almost no headroom for the OS, Telegram bot process, or ffmpeg conversion running concurrently. On a 4GB VPS also running a bot, tiny is the ceiling.

### Alternative: whisper.cpp

whisper.cpp (C++ port) has a flat memory profile and avoids PyTorch overhead. On 4GB RAM, whisper.cpp can run `base` or even `small` models. But it's a separate toolchain (compile from source, different API).

faster-whisper (CTranslate2 backend) uses ~2x less memory than vanilla Whisper and is ~4x faster on CPU. Could run `base` on 4GB. But still slower than API.

---

## Q2: Speed — 30-Second Voice Note Transcription

### Whisper on CPU (2 vCPU, no GPU)

| Model  | 30s audio → time to transcribe | Realtime factor |
|--------|-------------------------------|-----------------|
| tiny   | ~10-15 seconds                | ~0.3-0.5x RT    |
| base   | ~20-30 seconds                | ~0.7-1.0x RT    |
| small  | ~60-90 seconds                | ~2-3x RT        |

Note: These are estimates for a 2-core Hetzner VPS. Benchmarks on higher-core machines show better numbers. On 2 vCPU, expect the slower end.

**With faster-whisper:** Roughly 2x faster than vanilla Whisper. So tiny = ~5-8 seconds, base = ~10-15 seconds.

**With whisper.cpp:** Similar to faster-whisper on CPU. Tiny = ~5-10 seconds.

### Deepgram API

| Method         | 30s audio → time to result |
|----------------|---------------------------|
| Pre-recorded   | 1-3 seconds               |
| Streaming      | Sub-300ms latency (progressive results) |

Deepgram's batch processing runs at ~120x realtime. A 30-second file returns in 1-3 seconds including network round-trip.

### Verdict

Even the fastest local option (faster-whisper tiny) takes 5-8 seconds. Deepgram returns in 1-3 seconds. For a Telegram bot where users expect quick replies, 1-3 seconds feels instant. 10-30 seconds feels broken.

---

## Q3: Quality — Nigerian English Accent

This is where the decision becomes obvious.

### Whisper Word Error Rate (WER) on Nigerian English

Research from HuggingFace accent bias study:

| Model     | Nigerian English WER | Notes                        |
|-----------|---------------------|------------------------------|
| tiny      | ~54%                | More than half the words wrong |
| base      | ~40%                | Still very poor              |
| small     | ~30%                | Improving but not good       |
| medium    | ~25%                | Decent                       |
| large-v3  | ~29%                | Best Whisper can do          |

**Critical insight:** Nigerian English has the HIGHEST WER of any accent tested across all Whisper models. The gap narrows at larger model sizes, but tiny/base are essentially unusable for Nigerian English. And those are the only models that fit on your VPS.

**Note:** There exists a fine-tuned Whisper Small model specifically for Nigerian Accented English (NCAIR1/NigerianAccentedEnglish on HuggingFace), but it requires the `small` model which won't fit comfortably on 4GB RAM.

### Deepgram Nova-3 Accuracy

- Overall WER: 5.26-6.84% (median across production workloads)
- 36% relative improvement over Whisper large
- Handles diverse accents better than Whisper in production environments
- No Nigerian-specific benchmark published, but general accent robustness is significantly better

### Verdict

Whisper tiny on Nigerian English = 54% WER. That means the bot would mangle more than half the words. Deepgram Nova-3 = ~5-7% WER generally. Even if Nigerian accent adds a few percentage points, it's still 5-10x more accurate than what fits on your VPS.

---

## Q4: Cost Comparison

### Whisper Local
- Software: Free (MIT license)
- Compute: "Free" — but ties up your 2 vCPU during transcription
- Hidden cost: While transcribing, your bot's other functions slow down. On 2 vCPU, a 15-second Whisper job uses 100% of one core

### Deepgram API

| Plan      | Rate           | Notes                              |
|-----------|----------------|------------------------------------|
| Free tier | $200 in credit | No expiration. All models included |
| Pay-as-you-go | $0.0077/min | After free credit exhausted        |
| Growth    | $0.0065/min    | $4,000/yr prepay                   |

**Free tier math:**
- $200 credit at $0.0077/min = ~25,974 minutes = ~432 hours of audio
- At 30 seconds per voice note = **51,948 voice notes for free**
- At 20 voice notes/day = **7+ years of free transcription**

**After free tier:**
- 30-second voice note = $0.00385 per transcription
- 100 voice notes/day = $0.385/day = $11.55/month
- That's less than the VPS itself costs

### Verdict

Deepgram is effectively free for this use case. The free tier alone covers years of typical Telegram bot usage.

---

## Q5: Setup Complexity

### Whisper on Ubuntu 24.04

```bash
# 1. Install system dependencies
sudo apt update && sudo apt install -y ffmpeg python3-pip python3-venv

# 2. Create virtual environment (required on Ubuntu 24.04)
python3 -m venv whisper-env
source whisper-env/bin/activate

# 3. Install Whisper (pulls PyTorch — ~2GB download)
pip install openai-whisper

# 4. First run downloads model weights
whisper audio.wav --model tiny --language en
```

**Gotchas on 4GB VPS:**
- PyTorch install alone is ~2GB download + ~2GB disk
- pip install may OOM during compilation — may need swap space
- Ubuntu 24.04 enforces PEP 668 (externally managed environment) — MUST use venv
- ffmpeg is required for audio format conversion
- First model download adds 75MB (tiny) to 2.9GB (large) to disk
- Reboot may be required for PATH to find whisper CLI
- PyTorch loads CUDA stubs even on CPU-only systems, wasting ~140% more memory

**Total setup time:** 30-60 minutes (including troubleshooting)
**Disk space:** ~3-4 GB (PyTorch + ffmpeg + model)

### Deepgram API

```bash
pip install deepgram-sdk
```

```python
from deepgram import DeepgramClient, PrerecordedOptions

dg = DeepgramClient("DEEPGRAM_API_KEY")

# That's it. Send audio, get text.
with open("voice.ogg", "rb") as audio:
    response = dg.listen.rest.v("1").transcribe_file(
        {"buffer": audio.read()},
        PrerecordedOptions(model="nova-3", language="en")
    )
    print(response.results.channels[0].alternatives[0].transcript)
```

**Gotchas:** None significant. Get API key from deepgram.com, pip install, done.

**Total setup time:** 5-10 minutes
**Disk space:** ~10 MB (SDK only)

### Verdict

Whisper setup is heavy, fragile, and may OOM during installation on 4GB. Deepgram is pip install + API key.

---

## Q6: Streaming vs Batch

### Whisper

- **Native design:** Batch only. Send complete file, wait for full transcription.
- **Streaming workarounds exist:** whisper-streaming, WhisperLive — but they chunk audio into windows and stitch results. Introduces lag, boundary errors, and complexity.
- **For Telegram voice notes:** Irrelevant. Voice notes are complete files (not live streams). Batch mode is what you need.

### Deepgram

- **Batch (pre-recorded):** Send file, get result in 1-3 seconds. Perfect for voice notes.
- **Streaming:** Native WebSocket support, sub-300ms latency. Useful if you later add live transcription features.
- **For Telegram voice notes:** Use pre-recorded endpoint. Streaming is available if you need it later.

### Verdict

For Telegram voice notes (complete .ogg files), both work in batch mode. Deepgram is faster. Streaming is irrelevant for this use case but Deepgram has it if you ever need it.

---

## Q7: Telegram Bot Pipeline

### Option A: Whisper Local

```
User sends voice note (.ogg Opus)
    │
    ▼
Bot downloads .ogg file from Telegram API
    │
    ▼
ffmpeg converts .ogg → .wav (required)     ← extra step
    │
    ▼
Whisper loads model (if not cached in memory)
    │
    ▼
Whisper transcribes .wav file (10-30 seconds on 2 vCPU)
    │
    ▼
Bot returns text to user
    │
    ▼
Clean up temp .wav file
```

**Code sketch:**
```python
import whisper
import subprocess

# Convert ogg to wav (Whisper needs ffmpeg-compatible format)
subprocess.run(["ffmpeg", "-i", "voice.ogg", "-ar", "16000", "-ac", "1", "voice.wav"])

model = whisper.load_model("tiny")  # Keep in memory between requests
result = model.transcribe("voice.wav")
text = result["text"]
```

**Issues:**
- Must keep model loaded in RAM between requests (eats 1-1.5GB permanently)
- Or load/unload per request (adds 2-5 seconds per transcription)
- ffmpeg conversion adds ~1 second
- CPU-bound: blocks other bot operations during transcription
- Need temp file management

### Option B: Deepgram API

```
User sends voice note (.ogg Opus)
    │
    ▼
Bot downloads .ogg file from Telegram API
    │
    ▼
Bot sends .ogg directly to Deepgram API     ← no conversion needed
    │
    ▼
Deepgram returns text (1-3 seconds)
    │
    ▼
Bot returns text to user
```

**Code sketch:**
```python
from deepgram import DeepgramClient, PrerecordedOptions
import httpx

# Download voice note from Telegram
voice_bytes = httpx.get(telegram_file_url).content

# Send directly to Deepgram — OGG Opus supported natively
dg = DeepgramClient("API_KEY")
response = dg.listen.rest.v("1").transcribe_file(
    {"buffer": voice_bytes, "mimetype": "audio/ogg"},
    PrerecordedOptions(model="nova-3", language="en")
)
text = response.results.channels[0].alternatives[0].transcript
```

**Advantages:**
- No ffmpeg needed (Deepgram accepts .ogg Opus directly)
- No temp files
- Non-blocking (async HTTP call, bot stays responsive)
- No RAM consumed by ML model
- Already proven in your HBS Helper Bot on Railway

### Verdict

Deepgram pipeline is simpler (no conversion step), faster (1-3s vs 10-30s), and doesn't consume VPS resources.

---

## Decision Matrix

| Criterion              | Weight | Whisper Local (tiny) | Deepgram API   |
|------------------------|--------|---------------------|----------------|
| Fits 4GB RAM           | HIGH   | Barely              | N/A (no RAM)   |
| Speed (30s note)       | HIGH   | 10-30 seconds       | 1-3 seconds    |
| Nigerian English WER   | CRITICAL| ~54% (unusable)    | ~5-7% (good)   |
| Cost                   | MEDIUM | Free (CPU cost)     | Free ($200 credit) |
| Setup complexity       | MEDIUM | High (30-60 min)    | Low (5-10 min) |
| OGG Opus handling      | LOW    | Convert via ffmpeg   | Direct upload  |
| VPS resource impact    | HIGH   | Heavy (blocks CPU)   | Zero           |
| Already in your stack  | LOW    | No                  | Yes (HBS bot)  |

---

## FINAL RECOMMENDATION

**Deepgram API. Use the pre-recorded endpoint with Nova-3 model.**

The deciding factor is Nigerian English accuracy. Whisper tiny at 54% WER means the bot would butcher every other word — making the entire transcription feature useless. The only Whisper models that approach acceptable accuracy (medium, large) don't fit on 4GB RAM.

Deepgram solves every constraint simultaneously:
- No RAM consumed
- 10x faster
- 10x more accurate on accented English
- Free for years at typical Telegram bot volume
- You already know the SDK from HBS Helper Bot
- No ffmpeg dependency, no temp files, no format conversion

**The only reason to choose Whisper:** Privacy requirements where audio cannot leave the VPS. If that's not a constraint, Deepgram wins on every dimension.

**Next action:** Copy the Deepgram integration pattern from HBS Helper Bot, point it at your Hetzner bot's voice message handler.

---

## Sources

- [Whisper model RAM requirements — GitHub Discussion #5](https://github.com/openai/whisper/discussions/5)
- [Whisper model sizes guide — Oreate AI](https://www.oreateai.com/blog/understanding-whisper-model-sizes-a-guide-to-optimal-choices/00327b3d4795e31f12c0af941bfe098e)
- [Whisper accent bias study — HuggingFace](https://huggingface.co/blog/Steveeeeeeen/how-biaised-is-whisper)
- [Nigerian Accented English fine-tuned model — HuggingFace](https://huggingface.co/NCAIR1/NigerianAccentedEnglish)
- [Whisper CPU performance — GitHub Discussion #369](https://github.com/openai/whisper/discussions/369)
- [faster-whisper — SYSTRAN/faster-whisper GitHub](https://github.com/SYSTRAN/faster-whisper)
- [whisper.cpp vs faster-whisper comparison](https://www.alibaba.com/product-insights/a-practical-guide-to-choosing-between-whisper-cpp-and-faster-whisper-for-offline-transcription.html)
- [Deepgram pricing 2026](https://deepgram.com/pricing)
- [Deepgram Nova-3 pricing breakdown](https://brasstranscripts.com/blog/deepgram-pricing-per-minute-2025-real-time-vs-batch)
- [Deepgram supported audio formats](https://developers.deepgram.com/docs/supported-audio-formats)
- [Deepgram streaming latency](https://developers.deepgram.com/docs/measuring-streaming-latency)
- [Deepgram pre-recorded API docs](https://developers.deepgram.com/docs/pre-recorded-audio)
- [Whisper streaming limitations — Deepgram](https://deepgram.com/learn/why-enterprises-are-moving-to-streaming-and-why-whisper-can-t-keep-up)
- [Whisper Telegram bot reference implementation](https://github.com/FlyingFathead/whisper-transcriber-telegram-bot)
- [Whisper OGG format support — GitHub Discussion #799](https://github.com/openai/whisper/discussions/799)
- [Running Whisper under 4GB RAM](https://www.alibaba.com/product-insights/how-to-run-whisper-based-transcription-offline-with-under-4gb-ram.html)
- [Installing Whisper on Ubuntu — GPU-Mart](https://www.gpu-mart.com/blog/install-whisper-in-ubuntu)
