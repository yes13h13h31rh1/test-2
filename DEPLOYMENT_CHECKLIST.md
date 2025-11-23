# Render.com Deployment Checklist

Use this checklist when deploying to Render.com to ensure everything is configured correctly.

## Pre-Deployment

- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] All environment variables documented
- [ ] Database schema is final
- [ ] ML service dependencies are in `requirements.txt`
- [ ] Backend dependencies are in `package.json`
- [ ] Frontend dependencies are in `package.json`

## Blueprint Deployment (Recommended)

- [ ] Connect repository to Render.com
- [ ] Create new Blueprint from repository
- [ ] Verify `render.yaml` is detected
- [ ] Review service configuration in Blueprint preview
- [ ] Deploy Blueprint

## Manual Service Setup

### Backend Service

- [ ] Create Web Service
- [ ] Set Environment: Node
- [ ] Set Build Command: `cd backend && npm install && npm run build`
- [ ] Set Start Command: `cd backend && npm start`
- [ ] Set Region (e.g., Oregon)
- [ ] Set Plan (Starter or higher)
- [ ] Add Persistent Disk (recommended for database)
  - [ ] Mount path: `/opt/render/project/src/backend`
- [ ] Set Environment Variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `DATABASE_URL=/opt/render/project/src/backend/data/uefn_generator.db`
  - [ ] `ML_SERVICE_URL=https://uefn-ml-service.onrender.com`
  - [ ] `FRONTEND_URL=https://uefn-frontend.onrender.com`
  - [ ] `SESSION_SECRET=<generate-random-string>`

### ML Service

- [ ] Create Web Service
- [ ] Set Environment: Python 3
- [ ] Set Build Command: `cd ml-service && pip install -r requirements.txt`
- [ ] Set Start Command: `cd ml-service && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Set Region (same as backend)
- [ ] Set Plan (Starter or higher)
- [ ] Add Persistent Disk (required for asset storage)
  - [ ] Mount path: `/opt/render/project/src/ml-service`
- [ ] Set Environment Variables:
  - [ ] `PORT=10000`
  - [ ] `ASSETS_DIR=/opt/render/project/src/ml-service/generated_assets`
  - [ ] `RENDER_DISK_PATH=/opt/render/project/src/ml-service` (if using disk)

### Frontend Service

- [ ] Create Static Site
- [ ] Set Build Command: `cd frontend && npm install && npm run build`
- [ ] Set Publish Directory: `frontend/dist`
- [ ] Set Region (same as other services)
- [ ] Set Environment Variables:
  - [ ] `VITE_API_URL=https://uefn-backend.onrender.com`
- [ ] Configure Redirects/Rewrites:
  - [ ] `/api/*` → `https://uefn-backend.onrender.com/api/*`
  - [ ] `/*` → `/index.html` (for React Router)

## Post-Deployment Verification

### Service Health Checks

- [ ] Backend health check: `https://<backend-url>/health`
  - [ ] Returns: `{"status":"ok","service":"backend"}`
- [ ] ML service health check: `https://<ml-service-url>/ml/health`
  - [ ] Returns: `{"status":"ok","service":"ml-service"}`
- [ ] Frontend loads: `https://<frontend-url>`
  - [ ] Landing page displays correctly

### Service Communication

- [ ] Frontend can reach backend API
  - [ ] Test: Open browser console, check for API errors
  - [ ] Test: Try generating a script
- [ ] Backend can reach ML service
  - [ ] Test: Try generating a 3D asset
  - [ ] Check backend logs for ML service connection

### Functionality Tests

- [ ] **Script Generation**
  - [ ] Navigate to Script Generator
  - [ ] Enter description
  - [ ] Select script type
  - [ ] Generate script
  - [ ] Code displays correctly
  - [ ] Download button works

- [ ] **Asset Generation**
  - [ ] Navigate to 3D Asset Generator
  - [ ] Enter prompt
  - [ ] Select options
  - [ ] Generate asset
  - [ ] Metadata displays
  - [ ] Download button works

- [ ] **Library**
  - [ ] View generated scripts
  - [ ] View generated assets
  - [ ] Filter/search works
  - [ ] Delete functionality works
  - [ ] Download functionality works

### Database & Storage

- [ ] Database persists across deploys
  - [ ] Generate content
  - [ ] Redeploy backend
  - [ ] Content still exists
- [ ] Assets persist across deploys
  - [ ] Generate asset
  - [ ] Redeploy ML service
  - [ ] Asset still downloadable

### CORS Configuration

- [ ] Frontend can make authenticated requests to backend
  - [ ] Check browser Network tab
  - [ ] Cookies are sent/received correctly
- [ ] No CORS errors in console

## Production Optimizations

- [ ] **Security**
  - [ ] `SESSION_SECRET` is strong random string
  - [ ] CORS origins are restricted (if needed)
  - [ ] HTTPS is enabled (automatic on Render)
  - [ ] Environment variables are not exposed

- [ ] **Performance**
  - [ ] Database queries are optimized
  - [ ] Asset files are compressed (if applicable)
  - [ ] Frontend build is optimized (minified)

- [ ] **Monitoring**
  - [ ] Health checks are configured
  - [ ] Logs are accessible
  - [ ] Error tracking is set up (optional)

- [ ] **Scaling**
  - [ ] Plan is appropriate for traffic
  - [ ] Persistent disks are sized correctly
  - [ ] Consider PostgreSQL for database (high traffic)

## Troubleshooting

If services fail health checks or don't communicate:

1. **Check Logs**
   - [ ] Backend logs: Check for errors
   - [ ] ML service logs: Check for errors
   - [ ] Frontend build logs: Check for build errors

2. **Check Environment Variables**
   - [ ] All required variables are set
   - [ ] URLs are correct (https://)
   - [ ] Ports match service configuration

3. **Check Service URLs**
   - [ ] Services are deployed and running
   - [ ] URLs are accessible from browser
   - [ ] Health checks return 200 OK

4. **Check Database/Storage**
   - [ ] Database path is writable
   - [ ] Persistent disks are mounted correctly
   - [ ] Directories exist and have permissions

5. **Check CORS**
   - [ ] Backend allows frontend origin
   - [ ] Cookies are sent with credentials: true
   - [ ] Headers are properly configured

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Detailed deployment guide
- [README.md](./README.md) - General project documentation

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Production URL**: _______________
