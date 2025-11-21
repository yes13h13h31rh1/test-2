# Roblox Analytics Dashboard - Browser Automation Edition

This dashboard automatically fetches Roblox game revenue data using **browser automation** (like databots.super02.me), intercepting API calls from the Roblox developer dashboard.

## 🚀 How It Works

Instead of web scraping or manual CSV uploads, this solution:

1. **Uses Puppeteer** to automate a browser session
2. **Logs into Roblox** using your cookie
3. **Intercepts network requests** to find the actual API endpoints
4. **Extracts revenue data** from API responses and page state
5. **Updates every 30 seconds** automatically

This is the same method used by professional Roblox analytics dashboards!

## 📦 Installation

```bash
cd C:\Users\woode\roblox-analytics-dashboard
npm install
```

**Note:** Puppeteer will download Chromium automatically (~170MB). This is normal.

## ⚙️ Configuration

Your `server.js` already has your universe ID and cookie configured. If you need to change them:

```javascript
const CONFIG = {
  universeId: '7281007509',  // Your game's universe ID
  robloxCookie: 'your_cookie_here'  // Your .ROBLOSECURITY cookie
};
```

## 🏃 Running

```bash
npm start
```

Then visit: **http://localhost:3000**

## 🔧 How It Fetches Data

1. **Browser Automation** (Primary Method)
   - Launches a headless Chrome browser
   - Sets your Roblox cookie
   - Navigates to the monetization page
   - Intercepts all API calls
   - Extracts revenue data from responses

2. **Direct API Calls** (Fallback)
   - Tries known API endpoints directly
   - Uses your cookie for authentication

## 🎯 Features

- ✅ **Automatic revenue tracking** - No manual CSV uploads needed
- ✅ **Real-time updates** - Every 30 seconds
- ✅ **Browser automation** - Just like professional dashboards
- ✅ **API interception** - Finds the actual endpoints Roblox uses
- ✅ **Multiple fallbacks** - Ensures data is always available

## 🐛 Troubleshooting

**"Browser automation failed"**
- Make sure Puppeteer installed correctly
- Check your cookie is valid
- Try running with `headless: false` to see what's happening

**"Could not extract revenue data"**
- The page structure might have changed
- Check server console for detailed errors
- Verify you have access to the monetization page

**Browser won't start**
- On Windows, you might need Visual C++ Redistributable
- Try: `npm install puppeteer --force`

## 📝 Notes

- The browser instance is reused for efficiency
- First request may take 5-10 seconds (browser startup)
- Subsequent requests are much faster (cached browser)
- Browser closes gracefully on server shutdown

## 🔒 Security

- Never commit your cookie to Git
- Use environment variables in production
- Your cookie is only used server-side

## 🚀 Deployment

This works on any platform that supports Node.js and can run Chromium:
- Render.com
- Railway.app
- Fly.io
- DigitalOcean
- VPS (recommended for best performance)

Make sure to set environment variables:
```bash
UNIVERSE_ID=7281007509
ROBLOX_COOKIE=your_cookie_here
```

