# Serving Frontend from Backend on Render.com

I've configured the backend to build and serve the frontend, so you only need one service instead of three.

## What Changed

1. **Backend now builds frontend** during the build process
2. **Backend serves frontend static files** automatically
3. **Updated render.yaml** to build both frontend and backend
4. **Frontend uses relative API paths** (`/api`) so it works when served from backend

## Render.com Configuration

### Backend Service Settings

Your backend service should have:

**Root Directory:** `.` (project root, not `backend`)

**Build Command:**
```bash
cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

This will:
1. Build the backend TypeScript code
2. Build the frontend React app
3. Backend serves the frontend files automatically

### How It Works

1. During build, both frontend and backend are compiled
2. Frontend build output goes to `frontend/dist/`
3. Backend automatically detects and serves `frontend/dist/` in production
4. All routes except `/api/*` and `/health` serve the React app

## Update Your Render Service

If you already have a backend service deployed:

1. **Go to your backend service** in Render dashboard
2. **Update these settings:**

   - **Root Directory**: Change from `backend` to `.` (project root)
   - **Build Command**: 
     ```
     cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build
     ```
   - **Start Command**: 
     ```
     cd backend && npm start
     ```

3. **Save and redeploy**

## After Deployment

Once deployed, your backend URL will serve:
- **Root (`/`)**: Your React frontend application
- **API routes (`/api/*`)**: Backend API endpoints
- **Health check (`/health`)**: Service health status

You only need **2 services** now:
1. **Backend** (serves frontend + API)
2. **ML Service** (for 3D asset generation)

## Testing

After deployment:

1. Visit your backend URL (e.g., `https://uefn-backend.onrender.com`)
2. You should see the landing page (not JSON)
3. Try generating a script - it should work!
4. API calls will go to `/api/*` automatically

## Troubleshooting

### Still seeing JSON instead of frontend?

1. **Check build logs**: Look for frontend build output
   - Should see: `VITE build completed`
   - Should see: `dist/` folder created

2. **Check backend logs**: Should see:
   ```
   📦 Serving frontend from: /opt/render/project/src/frontend/dist
   ```

3. **Verify build command**: Make sure it builds both backend AND frontend

### Frontend shows but API calls fail?

1. **Check frontend API client**: Should use `/api` (relative path)
2. **Check CORS**: Backend should allow requests from same origin
3. **Check browser console**: Look for API errors

### Build fails?

1. **Check Node version**: Both backend and frontend need compatible Node versions
2. **Check dependencies**: Both `package.json` files need all dependencies listed
3. **Check build logs**: See which step fails

## Alternative: Separate Frontend Service

If you prefer separate services, you can still deploy the frontend as a static site:
- Uncomment the frontend service in `render.yaml`
- Frontend will be a separate static site
- You'll have 3 services total

But serving from backend is simpler and cheaper! 💰

## Summary

✅ **Backend service now serves everything**
✅ **Only 2 services needed** (Backend + ML Service)
✅ **Frontend automatically built and served**
✅ **API works with relative paths**

Just update your Render backend service settings and redeploy!
