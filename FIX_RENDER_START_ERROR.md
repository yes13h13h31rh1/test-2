# Fix: "Cannot find module '/opt/render/project/src/server.js'"

This error occurs because Render is trying to run `node server.js` from the project root instead of using your configured start command.

## Quick Fix Steps

### 1. Go to Your Backend Service in Render Dashboard

1. Log into [Render.com](https://render.com)
2. Navigate to your backend service (e.g., `uefn-backend`)
3. Click on the service name to open settings

### 2. Update Service Configuration

#### Root Directory (CRITICAL)

1. Scroll down to **Root Directory** section
2. Set it to: `backend`
   - This tells Render that your Node.js app is in the `backend/` folder
   - ⚠️ **This is the most important setting!**

#### Build Command

1. Find **Build Command** section
2. Set it to: `npm install && npm run build`
   - Remove any `cd backend` commands
   - Since Root Directory is set to `backend`, commands run from that folder

#### Start Command

1. Find **Start Command** section
2. Set it to: `npm start`
   - **NOT** `node server.js`
   - **NOT** `cd backend && npm start`
   - Just `npm start` (this runs the script in `backend/package.json`)

### 3. Save and Redeploy

1. Click **Save Changes**
2. Render will automatically trigger a new deployment
3. Watch the logs - you should see:
   ```
   ==> Running 'npm start'
   ✅ Database initialized
   🚀 Backend server running on http://0.0.0.0:10000
   ```

## Verification

After redeploying, check the logs. You should see:

✅ **Good signs:**
- `==> Running 'npm start'` (not `node server.js`)
- `✅ Database initialized`
- `🚀 Backend server running on http://0.0.0.0:10000`
- `Environment: production`

❌ **Bad signs:**
- `==> Running 'node server.js'` (means Root Directory or Start Command is wrong)
- `Cannot find module` errors
- `Exited with status 1`

## Complete Backend Service Settings

Here's what your backend service settings should look like:

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Environment** | Node |
| **Region** | Oregon (or your preference) |
| **Plan** | Starter (or higher) |
| **Root Directory** | `backend` ⚠️ **REQUIRED** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

## If You're Using Blueprint

If you deployed via Blueprint (using `render.yaml`):

1. **Delete the existing services**
2. **Create a new Blueprint** from your repository
3. Render will read `render.yaml` and create services with correct settings

Or manually update the service settings as described above.

## Troubleshooting

### Still seeing "node server.js"?

1. **Check Root Directory**: Must be exactly `backend` (no leading slash, no trailing slash)
2. **Check Start Command**: Must be exactly `npm start` (case-sensitive)
3. **Clear browser cache**: Sometimes Render dashboard caches old values
4. **Try hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Build succeeds but start fails?

1. **Check build logs**: Ensure TypeScript compiled successfully
2. **Verify `dist/index.js` exists**: Should be created during build
3. **Check `backend/package.json`**: Should have `"start": "node dist/index.js"`

### Service keeps restarting?

1. **Check health check**: Ensure `/health` endpoint responds
2. **Check logs**: Look for runtime errors after startup
3. **Check PORT**: Render sets this automatically, don't override it

## Still Having Issues?

1. **Check the exact error** in the logs
2. **Verify file structure**:
   ```
   backend/
     ├── package.json
     ├── tsconfig.json
     ├── src/
     │   └── index.ts
     └── dist/
         └── index.js  (created during build)
   ```
3. **Test locally first**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
   If this works locally, the issue is Render configuration.

## Need Help?

- Check [RENDER_MANUAL_SETUP.md](./RENDER_MANUAL_SETUP.md) for complete setup guide
- Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed deployment instructions
- Render Support: https://render.com/docs/troubleshooting-deploys

---

**Quick Checklist:**
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Saved changes
- [ ] New deployment triggered
- [ ] Logs show `npm start` (not `node server.js`)
- [ ] Logs show server running successfully
