# ⚡ Quick Deploy to Render.com

## 🚀 3-Step Deployment

### 1. Push to GitHub
```bash
cd C:\Users\woode\roblox-analytics-dashboard
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/roblox-analytics-dashboard.git
git push -u origin main
```

### 2. Deploy on Render
1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### 3. Add Environment Variables
In Render dashboard → Environment:
- `UNIVERSE_ID` = `7281007509`
- `ROBLOX_COOKIE` = `your_cookie_here`

**Done!** Your dashboard will be live at: `https://your-app.onrender.com`

## ⚠️ Notes
- Free tier sleeps after 15 min (first request wakes it up)
- First build takes 5-10 minutes (Puppeteer downloads Chromium)
- Never commit your cookie to Git!

See `RENDER_DEPLOY.md` for detailed instructions.

