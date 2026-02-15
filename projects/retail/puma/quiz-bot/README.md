# FORJE Quiz Bot

Telegram quiz engine for retail training. Sends quiz polls, tracks scores, exports CSV.

## Setup

```bash
# 1. Get bot token from @BotFather on Telegram
#    - Open @BotFather, send /newbot
#    - Name: "FORJE Training Quiz"
#    - Username: forje_quiz_bot (or whatever's available)
#    - Copy the token

# 2. Install
pip install -r requirements.txt

# 3. Run
TELEGRAM_BOT_TOKEN="your-token-here" python bot.py
```

## Commands

| Command | What it does |
|---------|-------------|
| `/start` | Show help |
| `/quiz` | Start Mission 1 quiz (5 questions) |
| `/quiz 2` | Start Mission 2 quiz |
| `/quiz 3` | Start Mission 3 quiz |
| `/quiz all` | All 15 questions |
| `/leaderboard` | Best scores per person |
| `/export` | Download CSV of all results |

## How it works

1. User types `/quiz` in group or DM
2. Bot sends quiz polls one at a time (30s timer each)
3. Correct answer = confetti, wrong = explanation shown
4. Score posted when done (80% = pass)
5. All results saved to `scores.json`
6. `/export` generates CSV for weekly reports

## Files

- `bot.py` — Bot code
- `questions.json` — 15 questions (3 missions x 5 each)
- `scores.json` — Persistent score data (auto-created)
- `requirements.txt` — Python deps

## VPS Deploy

```bash
# On VPS (after SSH + Python setup from vps-setup-map.md)
mkdir -p /opt/quiz-bot
# Copy files to VPS
scp -r quiz-bot/* root@YOUR_IP:/opt/quiz-bot/

# Install deps
cd /opt/quiz-bot
pip install -r requirements.txt

# Run with systemd (see vps-setup-map.md pattern)
# Set TELEGRAM_BOT_TOKEN in /opt/quiz-bot/.env
```
