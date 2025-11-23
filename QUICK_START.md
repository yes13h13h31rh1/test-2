# Quick Start Guide

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ and pip
- Three terminal windows/tabs

## Setup (One-Time)

### Option 1: Automated Setup Script

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

**Linux/Mac:**
```bash
bash setup.sh
```

### Option 2: Manual Setup

1. **Install Node dependencies:**
   ```bash
   npm run install:all
   ```

2. **Install Python dependencies:**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   cd ..
   ```

3. **Create environment files** (copy from .env.example in each directory):
   - `backend/.env`
   - `frontend/.env`
   - `ml-service/.env`

4. **Create directories:**
   ```bash
   mkdir -p backend/data
   mkdir -p ml-service/generated_assets
   ```

## Running the Application

Open **3 separate terminals**:

### Terminal 1: Backend API (Port 3001)
```bash
npm run dev:backend
```
or
```bash
cd backend
npm run dev
```

### Terminal 2: ML Service (Port 8000)
```bash
cd ml-service
python -m uvicorn main:app --reload --port 8000
```

### Terminal 3: Frontend (Port 5173)
```bash
npm run dev:frontend
```
or
```bash
cd frontend
npm run dev
```

## Accessing the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **ML Service**: http://localhost:8000
- **API Health Check**: http://localhost:3001/health
- **ML Health Check**: http://localhost:8000/ml/health

## Testing

1. Navigate to http://localhost:5173
2. Try generating a script:
   - Go to "Script Generator"
   - Enter a description (e.g., "wave-based enemy spawner")
   - Select a script type
   - Click "Generate Script"

3. Try generating a 3D asset:
   - Go to "3D Asset Generator"
   - Enter a prompt (e.g., "low-poly sci-fi crate")
   - Select options and click "Generate Asset"

4. View your library:
   - Go to "Library"
   - Browse generated scripts and assets

## Troubleshooting

### Port Already in Use
- Change ports in `.env` files or kill processes using those ports

### Python Dependencies Fail
- Try: `python -m pip install --upgrade pip`
- Then: `pip install -r requirements.txt`

### Database Errors
- Delete `backend/data/uefn_generator.db` to reset
- Restart backend server

### CORS Errors
- Ensure all services are running
- Check that frontend is using correct API URL in `.env`

## Architecture

```
┌─────────────┐      HTTP/REST      ┌─────────────┐
│   Frontend  │ ───────────────────> │   Backend   │
│  (React)    │ <─────────────────── │  (Express)  │
│  Port 5173  │      JSON/Cookies    │  Port 3001  │
└─────────────┘                      └──────┬──────┘
                                            │ HTTP
                                            ▼
                                    ┌─────────────┐
                                    │ ML Service  │
                                    │  (FastAPI)  │
                                    │  Port 8000  │
                                    └─────────────┘
```

All communication happens via HTTP/REST APIs. The backend stores data in SQLite and forwards asset generation requests to the ML service.
