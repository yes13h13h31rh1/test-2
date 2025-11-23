# Which URL Should I Use?

You have **3 separate services** deployed on Render.com. Here's which URL to use for what:

## 🎯 Main Application (Frontend)

**Use this URL to access the full web application:**

```
https://uefn-frontend.onrender.com
```

(Replace `uefn-frontend` with your actual frontend service name)

This is where you'll see:
- Landing page
- Script Generator
- 3D Asset Generator
- Library

## 🔧 Backend API (For API Access Only)

**Backend URL:**
```
https://uefn-backend.onrender.com
```

This is an **API server only**. It doesn't serve a web interface.

- ✅ Use this for: API endpoints, health checks
- ❌ Don't use this for: Viewing the website

**Available endpoints:**
- `GET /health` - Health check
- `GET /api/scripts` - List scripts
- `POST /api/scripts/generate` - Generate script
- `GET /api/assets` - List assets
- `POST /api/assets/generate` - Generate asset

## 🤖 ML Service (For Asset Generation)

**ML Service URL:**
```
https://uefn-ml-service.onrender.com
```

This is the Python service that generates 3D assets.

- ✅ Used internally by the backend
- ❌ Not meant for direct access

## 📋 Quick Checklist

1. **To view the website:** Go to your **Frontend URL**
   - Should show the landing page with "Generate UEFN Scripts" and "Generate 3D Assets"

2. **If you see "Cannot GET /":**
   - You're on the **Backend URL** (wrong one!)
   - Go to your **Frontend URL** instead

3. **To check if services are running:**
   - Backend: `https://your-backend-url.onrender.com/health`
   - ML Service: `https://your-ml-service-url.onrender.com/ml/health`
   - Frontend: Just visit the URL (should show the app)

## 🔍 Finding Your URLs

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click on each service
3. Your service URL is displayed at the top
4. Copy the URL and use the **Frontend** URL to access the site

## 🚨 Common Issues

### "Cannot GET /" Error

**Problem:** You're accessing the backend URL instead of frontend URL

**Solution:** 
1. Find your frontend service in Render dashboard
2. Copy the frontend service URL
3. Use that URL instead

### Frontend Shows API Errors

**Problem:** Frontend can't reach backend

**Solution:**
1. Check that `VITE_API_URL` environment variable in frontend service points to backend URL
2. Verify backend is running (check `/health` endpoint)
3. Check CORS settings in backend

### Services Not Deployed

**Problem:** Only one service deployed instead of all three

**Solution:**
1. Deploy all 3 services:
   - Frontend (Static Site)
   - Backend (Web Service)
   - ML Service (Web Service)
2. Update environment variables to point to correct URLs

## 📝 Summary

- **For users:** Use **Frontend URL** ✅
- **For API access:** Use **Backend URL** 🔧
- **For debugging:** Check **Backend `/health`** and **ML Service `/ml/health`** endpoints
