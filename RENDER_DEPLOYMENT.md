# Render.com Deployment Guide

This guide explains how to deploy the Fortnite UEFN AI Generator to Render.com.

## Architecture on Render.com

The application consists of **3 separate services**:

1. **Frontend** (Static Site) - Serves the React application
2. **Backend API** (Web Service) - Node.js/Express API server
3. **ML Service** (Web Service) - Python/FastAPI 3D asset generation service

## Deployment Methods

### Method 1: Blueprint Deployment (Recommended)

Render Blueprint deployment uses the `render.yaml` file for automatic configuration.

1. **Connect your repository** to Render.com
2. **Create a new Blueprint** from the repository
3. Render will automatically detect `render.yaml` and create all 3 services
4. **Set environment variables** (see below)

### Method 2: Manual Service Creation

Create each service manually in the Render dashboard:

#### 1. Backend API Service

- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Region**: Oregon (or your preferred region)
- **Plan**: Starter (or higher)

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=/opt/render/project/src/backend/data/uefn_generator.db
ML_SERVICE_URL=https://uefn-ml-service.onrender.com
FRONTEND_URL=https://uefn-frontend.onrender.com
SESSION_SECRET=<generate-random-secret>
```

#### 2. ML Service

- **Type**: Web Service
- **Environment**: Python 3
- **Build Command**: `cd ml-service && pip install -r requirements.txt`
- **Start Command**: `cd ml-service && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Region**: Oregon (or same as backend)
- **Plan**: Starter (or higher)

**Environment Variables:**
```
PORT=10000
ASSETS_DIR=/opt/render/project/src/ml-service/generated_assets
```

**Important**: Add a Persistent Disk for ML Service to store generated assets:
- Go to **Settings** → **Add Disk**
- Mount path: `/opt/render/project/src/ml-service`
- This ensures assets persist across deploys

#### 3. Frontend Static Site

- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Region**: Oregon (or same as other services)

**Environment Variables:**
```
VITE_API_URL=https://uefn-backend.onrender.com
```

**Note**: For Static Sites, you may need to handle API routing:
- Go to **Settings** → **Redirects/Rewrites**
- Add rewrite: `/api/*` → `https://uefn-backend.onrender.com/api/*`

## Environment Variables Reference

### Backend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `DATABASE_URL` | SQLite database path | `/opt/render/project/src/backend/data/uefn_generator.db` |
| `ML_SERVICE_URL` | ML service URL | `https://uefn-ml-service.onrender.com` |
| `FRONTEND_URL` | Frontend URL | `https://uefn-frontend.onrender.com` |
| `SESSION_SECRET` | Session encryption secret | Generate random string |
| `RENDER_DISK_PATH` | Persistent disk path (optional) | `/opt/render/project/src/backend` |
| `SERVE_STATIC` | Serve frontend from backend (optional) | `false` |

### ML Service

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `10000` |
| `ASSETS_DIR` | Generated assets directory | `/opt/render/project/src/ml-service/generated_assets` |
| `RENDER_DISK_PATH` | Persistent disk path (optional) | `/opt/render/project/src/ml-service` |

### Frontend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://uefn-backend.onrender.com` |

## Persistent Storage

### Database Storage

SQLite database files are stored in the backend service directory. For production use, consider:

1. **Render Persistent Disk**: Add a disk to the backend service
   - Mount path: `/opt/render/project/src/backend`
   - Database will persist across deploys

2. **External Database**: Replace SQLite with PostgreSQL
   - Use Render's PostgreSQL addon
   - Update `backend/src/database.ts` to use PostgreSQL

### Asset Storage

Generated 3D assets need persistent storage:

1. **Render Persistent Disk** (Recommended for ML Service):
   - Add a disk to ML service
   - Mount path: `/opt/render/project/src/ml-service`
   - Assets will persist across deploys

2. **External Storage** (Recommended for Production):
   - Use S3-compatible storage (AWS S3, Cloudflare R2, etc.)
   - Update `ml-service/services/asset_generator.py` to upload to S3
   - Store S3 URLs in database instead of local paths

## Service URLs

After deployment, update service URLs in environment variables:

1. **Backend URL**: `https://<service-name>.onrender.com`
2. **ML Service URL**: `https://<service-name>.onrender.com`
3. **Frontend URL**: `https://<service-name>.onrender.com`

Update `ML_SERVICE_URL` in backend and `VITE_API_URL` in frontend to use these URLs.

## Health Checks

Both services have health check endpoints:

- **Backend**: `https://<backend-url>/health`
- **ML Service**: `https://<ml-service-url>/ml/health`

Render will automatically ping these endpoints to verify service health.

## CORS Configuration

The backend is configured to accept requests from:
- Frontend URL (from `FRONTEND_URL` env var)
- Render.com domains (`.onrender.com`)
- Localhost (development only)

Update CORS origins in `backend/src/index.ts` if needed.

## Troubleshooting

### Services Not Communicating

1. **Check service URLs**: Ensure environment variables point to correct Render URLs
2. **Check internal URLs**: Render provides internal service URLs for faster communication
3. **Check CORS**: Verify CORS configuration allows requests

### Database Errors

1. **Check database path**: Ensure path is writable and exists
2. **Use persistent disk**: Add a disk for database storage
3. **Check permissions**: Ensure Render has write permissions

### Asset Generation Fails

1. **Check ML service URL**: Verify backend can reach ML service
2. **Check asset directory**: Ensure directory exists and is writable
3. **Check persistent disk**: Assets need persistent storage

### Frontend API Errors

1. **Check VITE_API_URL**: Must point to backend Render URL
2. **Check CORS**: Backend must allow frontend origin
3. **Check network tab**: Verify API requests are reaching backend

## Post-Deployment Checklist

- [ ] All 3 services are deployed and healthy
- [ ] Environment variables are set correctly
- [ ] Frontend can reach backend API
- [ ] Backend can reach ML service
- [ ] Database persists across deploys (if using disk)
- [ ] Assets persist across deploys (if using disk)
- [ ] CORS is configured correctly
- [ ] Health checks are passing
- [ ] Test script generation
- [ ] Test asset generation
- [ ] Test library functionality

## Scaling Considerations

- **Backend**: Can scale horizontally (multiple instances share SQLite database)
- **ML Service**: Can scale horizontally (stateless API)
- **Frontend**: Static site, automatically scales

For production with high traffic, consider:
- Moving to PostgreSQL for database
- Using external storage (S3) for assets
- Adding Redis for session management
- Implementing rate limiting
- Adding monitoring and logging

## Cost Optimization

- Use **Starter plan** for development/testing
- Add **Persistent Disks** only where needed
- Use **Auto-sleep** for services (free tier) - services wake on first request
- Consider **upgrading** for production use (no auto-sleep, better performance)

## Support

For Render.com specific issues:
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

For application issues:
- Check logs in Render dashboard
- Verify environment variables
- Test health check endpoints
