# Manual Render.com Setup (Without Blueprint)

If you're not using the Blueprint deployment, use this guide to manually set up each service.

## Backend Service Configuration

### Service Settings

- **Name**: `uefn-backend` (or your preferred name)
- **Type**: Web Service
- **Environment**: Node
- **Region**: Oregon (or your preference)
- **Plan**: Starter (or higher)

### Build & Start Commands

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Root Directory:** `backend`

⚠️ **Important**: Set the **Root Directory** to `backend` in the Render dashboard. This tells Render where your Node.js app is located.

### Environment Variables

```
NODE_ENV=production
DATABASE_URL=./data/uefn_generator.db
ML_SERVICE_URL=https://uefn-ml-service.onrender.com
FRONTEND_URL=https://uefn-frontend.onrender.com
SESSION_SECRET=<generate-random-string-here>
```

**Note**: 
- Replace `uefn-ml-service` and `uefn-frontend` with your actual service names after creating them
- Generate a random string for `SESSION_SECRET` (use `openssl rand -hex 32` or similar)

### Persistent Disk (Recommended)

1. Go to **Settings** → **Add Disk**
2. **Mount Path**: `/opt/render/project/src/backend`
3. **Size**: 1GB (or more if needed)
4. **Purpose**: Store SQLite database persistently

After adding the disk, update `DATABASE_URL`:
```
DATABASE_URL=/opt/render/project/src/backend/data/uefn_generator.db
```

## ML Service Configuration

### Service Settings

- **Name**: `uefn-ml-service` (or your preferred name)
- **Type**: Web Service
- **Environment**: Python 3
- **Region**: Oregon (same as backend)
- **Plan**: Starter (or higher)

### Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Root Directory:** `ml-service`

⚠️ **Important**: Set the **Root Directory** to `ml-service` in the Render dashboard.

### Environment Variables

```
PORT=10000
ASSETS_DIR=./generated_assets
```

**Note**: PORT is automatically set by Render, but you can set it explicitly.

### Persistent Disk (Required)

1. Go to **Settings** → **Add Disk**
2. **Mount Path**: `/opt/render/project/src/ml-service`
3. **Size**: 2GB or more (depending on asset storage needs)
4. **Purpose**: Store generated 3D assets persistently

After adding the disk, update `ASSETS_DIR`:
```
ASSETS_DIR=/opt/render/project/src/ml-service/generated_assets
RENDER_DISK_PATH=/opt/render/project/src/ml-service
```

## Frontend Service Configuration

### Service Settings

- **Name**: `uefn-frontend` (or your preferred name)
- **Type**: Static Site
- **Region**: Oregon (same as other services)

### Build & Publish Settings

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:** `dist`

**Root Directory:** `frontend`

⚠️ **Important**: Set the **Root Directory** to `frontend` in the Render dashboard.

### Environment Variables

```
VITE_API_URL=https://uefn-backend.onrender.com
```

**Note**: Replace `uefn-backend` with your actual backend service name.

### Redirects/Rewrites (Optional)

If you want to handle API routing through the static site:

1. Go to **Settings** → **Redirects/Rewrites**
2. Add rewrite: `/api/*` → `https://uefn-backend.onrender.com/api/*`

**Note**: This is optional if your frontend directly calls the backend URL.

## Order of Service Creation

1. **Create Backend Service First**
   - Get the backend URL
   - Note it for other services

2. **Create ML Service Second**
   - Get the ML service URL
   - Update `ML_SERVICE_URL` in backend service

3. **Create Frontend Service Last**
   - Use backend URL in `VITE_API_URL`
   - Frontend will connect to backend

## Post-Deployment Steps

### 1. Update Service URLs

After all services are deployed:

1. **Update Backend Environment Variables:**
   - Set `ML_SERVICE_URL` to your ML service URL
   - Set `FRONTEND_URL` to your frontend URL

2. **Update Frontend Environment Variables:**
   - Set `VITE_API_URL` to your backend URL

3. **Redeploy Services** after updating environment variables

### 2. Test Health Checks

- **Backend**: `https://<backend-url>/health`
- **ML Service**: `https://<ml-service-url>/ml/health`
- **Frontend**: `https://<frontend-url>`

### 3. Test Functionality

1. Open frontend URL in browser
2. Test script generation
3. Test asset generation
4. Test library functionality

## Common Issues

### Issue: "Cannot find module '/opt/render/project/src/server.js'"

**Solution:**
- Ensure **Root Directory** is set to `backend` (not the project root)
- Check that **Start Command** is `npm start`
- Verify build completed successfully

### Issue: Build Fails

**Solution:**
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check that TypeScript compiles correctly

### Issue: Services Can't Communicate

**Solution:**
- Verify service URLs are correct in environment variables
- Check that services are deployed and healthy
- Ensure URLs use `https://` (not `http://`)
- Verify CORS configuration allows your frontend URL

### Issue: Database Not Persisting

**Solution:**
- Add persistent disk to backend service
- Update `DATABASE_URL` to use disk path
- Redeploy backend service

### Issue: Assets Not Persisting

**Solution:**
- Add persistent disk to ML service
- Update `ASSETS_DIR` to use disk path
- Redeploy ML service

## Troubleshooting

1. **Check Logs**: View logs in Render dashboard for each service
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Test Health Checks**: Verify services respond to health check endpoints
4. **Check Service Status**: Ensure all services show "Live" status
5. **Verify URLs**: Test service URLs in browser

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Detailed deployment guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment checklist
