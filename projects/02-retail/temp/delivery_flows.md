# Delivery Flow Options

## 1. Telegram-only Flow
```
Learner pays invoice/Paystack → Bot grants access
     ↓
Day-0 Welcome message + orientation PDF
     ↓
Daily drip:
   • Video link (YouTube embed token)
   • 3-question quiz (inline buttons)
     ↓
Bot records score to Google Sheet via Apps Script
     ↓
Weekly checkpoint:
   • Reflection prompt → learner voice note
   • Manager rubric (optional)
     ↓
Sheet hits 100 % → Bot issues certificate (PDF link)
```
**Pros**: works on any phone, push notifications, full analytics.  
**Cons**: Q&A limited to pre-set options.

---

## 2. Custom GPT-only Flow
```
Learner opens ChatGPT Team workspace → Selects "Retail Coach GPT"
     ↓
GPT serves module reading + asks scenario questions
     ↓
Learner free-types answers; GPT gives instant feedback
     ↓
Completion check recorded manually (or via Zapier API)
```
**Pros**: rich open-ended coaching, branches easily.  
**Cons**: no push, harder to track cohorts; OpenAI paywall & data silo.

---

## 3. Hybrid Flow (Recommended – One-Tap AI)
```
Telegram Bot handles: payments, daily drip, quizzes, progress.
      ↓  “Practise Role-play” button (Telegram Web App)
Embedded mini-webapp opens inside Telegram (React + OpenAI API)
      ↓
Learner chats / records voice with GPT agent (Retail Coach)
      ↓
Webapp posts JSON summary back to Bot via HTTPS → stored in Sheet
```
Implementation notes:
* Uses Telegram **Web App** feature (2023) — no context-switch; stays inside Telegram.
* OpenAI key called server-side; front-end only handles UI.
* Works on Android/iOS & Telegram Desktop.

---

## 4. Telegram-only+GPT Inline (Simplest AI)
```
Bot sends /scenario → user enters role-play as voice or text
     ↓
Bot relays prompt to OpenAI API in backend
     ↓
OpenAI returns coaching feedback → Bot replies inline
     ↓
Score + notes pushed to Google Sheet
```
**Pros**: one app, still rich AI feedback, no external workspace.  
**Cons**: requires OpenAI key on backend; slightly higher hosting cost.