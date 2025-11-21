# 🚀 Deploy to Render.com - Quick Guide

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd C:\Users\woode\roblox-analytics-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `roblox-analytics-dashboard`)
   - **Don't** initialize with README

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/roblox-analytics-dashboard.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Render

1. **Sign up/Login**:
   - Go to https://render.com
   - Sign up with GitHub (easiest)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `roblox-analytics-dashboard` repo

3. **Configure Settings**:
   - **Name**: `roblox-analytics-dashboard` (or any name)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install` ⚠️ **IMPORTANT**
   - **Start Command**: `node server.js`
   - **Plan**: `Free` (or paid if you want)

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add:
   
   **First, add this to skip Chromium download:**
   ```
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
   ```
   
   **Then add your game config:**
   ```
   UNIVERSE_ID = 7281007509
   ```
   
   ```
   ROBLOX_COOKIE = _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhACIhwKBGR1aWQSFDE2MTIwNDQ3NDY0Mjk2NDMxNzY4KAM.hgYyupduR7wHtXddNfKaO8d8-otDfEhlNBIBpymMr3DTBPSjAfxLMJLrwKK9iy_uwImEmO5M37vtM4EoJyNIdyFuTJAkBGW-wxuFbppAhzIBWWP5E8OBBdwNJduydm3PzycBeBhXlhhCUZN6n8RoQ6qru5lTG8lqLGZ3cG-S5ux2ereOvVGRz-En3AiNNl49Znf22S9eSaPeBjTf8lqJW_VWgbpBnmRfhhHSzLaj04XX39dF8mSfrHhWln2wc3NTFG9DRuANe7MZbTRsJ__LzGgpDJjE2FlPiN2ofN4zU1iJvrWjSQYEPtVQajC5Oes6e-gsbs63izLGFOQHK9_VoaQt9_uh_EBrFfH3KqjuMfbYbk7cr-XqnN3MlA04qnkqmbLWOt84M4shTduDtcPOkNYg_O_WUzpEEyFm8_X1uB2z2kVkzKoo_0t8J7mKGKysvP5BPyBdDVuml9_Kk8DWC5wEpfJlBh5LVhgM5nVt2eJTcJjBTfOxCt-Bzetl0Ajj2i5NdDLYbStx0DXGJz_vpvb9WoBh3HgB1qGH-fBkyHutpZuvuKWmvgBGfhIQpeneibi5OTjw3czY8TL3QDnUOpkJ0ceXmqSC_qWis5zqLE2ZIwOKy4PqPgOTyQW2lZH8MzD02crpcwMrFlYnL_Nv1revUeIw0PphoTRS6aTYyPqvwU8qzkc1FgC3l3AImuXuUMmM-f5Mup4CL0VfuXwrEY9M0XPixxBrGl-r_LFf1YGdijoBv00n6t2DMQ0sRQ6Ov72Umbsex4ngtHDmX2w-Nytgxwfaj37TNIBF349lcieCqxlsYzUcSx0XHOpLAVy49BTfjjzf-WOI5RUdMfhnar8OU2jC7mTeJWjdh9_trSTpwK3-xDeLHdHiJNDuqukexEC_qPjuKn3xwXd32liV1l2wtTots3N9u3MbP5RZ6EDq8RLF_Fzf3-TEaJLsFScH7rs2DXRiWLDJKPQYT4wAKhDbzscrxRrXdVVjFKsWvUJIx5ItVbR-P3cICaLSZlFK-J7BQItqrs7DEA6NFJ7IVAFRwhvLSMN_1-0nG4NMHU3cELw8bmtkU044gBilVI6hT7aByuQzLR2xIbDYJL059RPU9TitOvpuED5iOjeGqWDxSHBOjFaaEO7wZQcoXVYy6EWwWw
   ```

   ⚠️ **Important**: Replace the ROBLOX_COOKIE with your actual cookie value!

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes first time)
   - Your dashboard will be live at: `https://your-app-name.onrender.com`

## Step 3: Access Your Dashboard

Once deployed, visit:
```
https://your-app-name.onrender.com
```

## ⚠️ Important Notes

### Free Tier Limitations:
- **Sleeps after 15 minutes** of inactivity
- First request after sleep takes ~30 seconds (waking up)
- 750 hours/month free

### Puppeteer on Render:
- Render's free tier supports Puppeteer
- First build may take longer (downloading Chromium)
- Browser automation works on Render

### Environment Variables:
- **Never commit your cookie to Git!**
- Always use environment variables in Render dashboard
- Your cookie is stored securely in Render

## 🔧 Troubleshooting

**Build fails:**
- Check build logs in Render dashboard
- Make sure `package.json` is correct
- Verify Node.js version (Render auto-detects)

**App crashes:**
- Check logs in Render dashboard
- Verify environment variables are set
- Make sure cookie is valid

**Browser automation fails:**
- Check Render logs for Puppeteer errors
- Free tier should work, but paid tier is more reliable
- Try increasing timeout in server.js if needed

## 🎯 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables added (UNIVERSE_ID, ROBLOX_COOKIE)
- [ ] Build successful
- [ ] Dashboard accessible at Render URL

## 📝 Updating Your App

After making changes:
```bash
git add .
git commit -m "Update dashboard"
git push
```

Render will automatically redeploy!

