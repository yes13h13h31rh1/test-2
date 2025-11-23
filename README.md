# Fortnite UEFN AI Generator

A production-ready web application for AI-generating Fortnite UEFN scripts and 3D assets.

## Features

- **UEFN Script Generator**: Generate valid Verse code for gameplay systems, devices, abilities, 
  game modes, and more
- **3D Asset Generator**: AI-powered 3D mesh generation for props, weapons, buildings, 
  and environment pieces
- **Asset & Script Library**: Browse, filter, and manage all your generated content

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **ML Service**: Python + FastAPI
- **Database**: SQLite (can be upgraded to PostgreSQL)

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Install Python dependencies for ML service:
```bash
cd ml-service
python -m pip install -r requirements.txt
cd ..
```

Alternatively, use the setup script:
- **Linux/Mac**: `bash setup.sh`
- **Windows**: `powershell -ExecutionPolicy Bypass -File setup.ps1`

3. Set up environment variables:

**Backend** (`backend/.env`):
```
PORT=3001
DATABASE_URL=./data/uefn_generator.db
ML_SERVICE_URL=http://localhost:8000
SESSION_SECRET=your-secret-key-change-in-production
```

**ML Service** (`ml-service/.env`):
```
PORT=8000
ASSETS_DIR=./generated_assets
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3001
```

4. Run all services:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - ML Service:**
```bash
cd ml-service
python -m uvicorn main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```bash
npm run dev:frontend
```

5. Open your browser to `http://localhost:5173` (or the port shown by Vite)

## Deployment to Render.com

This application is configured for easy deployment to Render.com. See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for complete deployment instructions.

### Quick Render Deployment

1. **Connect your repository** to Render.com
2. **Create a Blueprint** from the repository (uses `render.yaml`)
3. Render will automatically create all 3 services:
   - Frontend (Static Site)
   - Backend API (Web Service)
   - ML Service (Web Service)
4. **Set environment variables** as described in `RENDER_DEPLOYMENT.md`
5. **Add Persistent Disks** for database and asset storage

For detailed instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

## Project Structure

```
.
├── frontend/          # React + TypeScript frontend
├── backend/           # Express API server
├── ml-service/        # Python FastAPI ML service
├── render.yaml        # Render.com Blueprint configuration
└── README.md
```

## API Endpoints

### Backend (Port 3001 locally, or Render URL)

- `POST /api/generate-script` - Generate UEFN/Verse script
- `GET /api/scripts` - List user scripts
- `GET /api/scripts/:id` - Get script by ID
- `DELETE /api/scripts/:id` - Delete script

- `POST /api/assets` - Request asset generation (forwards to ML service)
- `GET /api/assets` - List user assets
- `GET /api/assets/:id` - Get asset metadata
- `GET /api/assets/:id/download` - Download asset file

- `POST /api/users/session` - Create session
- `GET /api/users/me` - Get current user

### ML Service (Port 8000 locally, or Render URL)

- `POST /ml/generate-asset` - Generate 3D asset
- `GET /ml/health` - Health check

## Development

### Adding a Real ML Model

The ML service is architected for easy integration. To add a real 3D generation model:

1. Replace the placeholder generation in `ml-service/services/asset_generator.py`
2. Implement the `generate_mesh()` method with your model
3. Update `requirements.txt` with model dependencies
4. Add model weights/files to `ml-service/models/`

### Extending Script Templates

Script templates are in `backend/src/services/scriptGenerator.ts`. To add new templates:

1. Add template functions for new script types
2. Update the `ScriptType` enum
3. Wire up in the generation endpoint

### Upgrading to PostgreSQL

For production, you may want to upgrade from SQLite to PostgreSQL:

1. Add PostgreSQL database to your Render services
2. Update `backend/src/database.ts` to use PostgreSQL (pg library)
3. Update environment variables with PostgreSQL connection string

## Environment Variables

All services use environment variables for configuration. See `.env.example` files in each service directory for required variables.

### Production Environment Variables

For Render.com deployment, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for a complete list of production environment variables.

## License

MIT

## Support

- **Local Development**: See [QUICK_START.md](./QUICK_START.md)
- **Render Deployment**: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Issues**: Check application logs and health check endpoints