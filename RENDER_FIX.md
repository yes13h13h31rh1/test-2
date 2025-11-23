# Render.com Deployment Fix

## Issue Fixed

The error `Cannot find module '/opt/render/project/src/server.js'` was occurring because Render was trying to run `node server.js` from the project root instead of using the configured start command.

## Solution

Updated `render.yaml` to use `rootDir` for each service, which tells Render where each service's root directory is located.

### Changes Made

1. **Added `rootDir` to all services** in `render.yaml`:
   - Backend: `rootDir: backend`
   - ML Service: `rootDir: ml-service`
   - Frontend: `rootDir: frontend`

2. **Simplified build/start commands** (no need for `cd` commands):
   - Before: `cd backend && npm install && npm run build`
   - After: `npm install && npm run build`

3. **Updated database path** to be relative:
   - Before: `/opt/render/project/src/backend/data/uefn_generator.db`
   - After: `./data/uefn_generator.db` (relative to backend root)

## How to Deploy

### Option 1: Blueprint Deployment (Recommended)

1. Push updated code to your repository
2. In Render dashboard, create a new Blueprint
3. Connect your repository
4. Render will detect `render.yaml` and use the `rootDir` settings
5. Deploy!

### Option 2: Manual Service Setup

If you're setting up manually, **CRITICAL**: Set the **Root Directory** for each service:

#### Backend Service
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### ML Service
- **Root Directory**: `ml-service`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Frontend Service
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

See [RENDER_MANUAL_SETUP.md](./RENDER_MANUAL_SETUP.md) for complete manual setup instructions.

## Verifying the Fix

After deployment, check the logs:

1. **Backend logs** should show:
   ```
   ✅ Database initialized
   🚀 Backend server running on http://0.0.0.0:10000
   Environment: production
   ```

2. **ML service logs** should show:
   ```
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:10000
   ```

3. **Health checks** should return 200:
   - Backend: `https://<backend-url>/health`
   - ML Service: `https://<ml-service-url>/ml/health`

## Still Having Issues?

1. **Check Root Directory**: Ensure Root Directory is set correctly in Render dashboard
2. **Check Build Logs**: Verify TypeScript compiles successfully
3. **Check Start Command**: Ensure it's `npm start` (not `node server.js`)
4. **Check Environment Variables**: Verify all required variables are set

## Files Updated

- `render.yaml` - Added `rootDir` for all services
- `backend/package.json` - Added `postinstall` script (optional)
- `RENDER_MANUAL_SETUP.md` - New file with manual setup guide
- `RENDER_FIX.md` - This file (deployment fix documentation)

Your deployment should now work correctly! 🚀
