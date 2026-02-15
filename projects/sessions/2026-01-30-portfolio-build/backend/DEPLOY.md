# Deploy to Render

## 1. Get Telegram Bot Token

1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Follow prompts (name: "Portfolio Leads Bot" or similar)
4. Copy the bot token (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

## 2. Get Your Chat ID

1. Search for `@userinfobot` in Telegram
2. Start a chat with it
3. It will send your Chat ID (number like: `123456789`)

## 3. Deploy to Render

### Option A: Deploy from this folder

1. Go to [render.com](https://render.com) (sign up with GitHub if needed)
2. Click "New +" → "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Connect your GitHub repo (or create one for this project)
5. Push this `backend` folder to the repo

### Option B: Quick deploy (manual)

1. Create new Web Service on Render
2. Choose "Public Git repository" or connect your GitHub
3. Settings:
   - **Name:** `portfolio-leads` (or whatever you want)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or path to this backend folder)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. Add Environment Variables (click "Environment" tab):
   - `TELEGRAM_BOT_TOKEN` = your bot token from step 1
   - `TELEGRAM_CHAT_ID` = your chat ID from step 2

5. Click "Create Web Service"

## 4. Update Portfolio HTML

After deployment, Render will give you a URL like:
```
https://portfolio-leads-xyz.onrender.com
```

Update `portfolio-v3-responsive.html` line ~710:
```javascript
const response = await fetch('https://YOUR_RENDER_URL.onrender.com/submit-lead', {
```

Replace `YOUR_RENDER_URL` with your actual Render URL.

## 5. Test

1. Open portfolio HTML in browser
2. Fill out form
3. Submit
4. Check your Telegram for notification

---

## Local Testing (Optional)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your actual credentials
node server.js
```

Open portfolio HTML and change API URL to `http://localhost:3000/submit-lead`

---

## Free Tier Notes

Render free tier:
- ✅ Spins down after 15 min of inactivity
- ✅ First request after spin-down takes ~30-60 seconds (cold start)
- ✅ Fine for portfolio forms (low traffic)
- ✅ 750 hours/month free (enough for 24/7)

If form submission is slow first time, that's normal (cold start). Add a loading message in the UI.

---

## Troubleshooting

**Telegram not sending?**
- Check bot token is correct
- Make sure you've sent at least 1 message to your bot first (so it can message you back)
- Check Render logs: Dashboard → your service → Logs

**Form not submitting?**
- Open browser console (F12)
- Check for CORS errors
- Make sure Render URL in HTML matches deployed URL

**Cold start too slow?**
- Upgrade to paid Render plan ($7/month - no cold starts)
- OR add a cron job to ping your server every 10 minutes (keeps it warm)
