import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './database';
import { setupRoutes } from './routes';
import { startMLService, stopMLService } from './services/mlService';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration for Render.com
const frontendUrls = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (frontendUrls.some(url => origin.startsWith(url))) {
      return callback(null, true);
    }
    
    // In development, allow localhost
    if (NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Allow Render.com origins
    if (origin.includes('.onrender.com')) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all for now, restrict in production if needed
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Initialize database
initDatabase();

// Start ML service (if not using external service)
if (!process.env.ML_SERVICE_URL) {
  startMLService().catch((error) => {
    console.error('Failed to start ML service:', error);
    console.log('Continuing without ML service. Set ML_SERVICE_URL to use external service.');
  });
}

// Health check (register before other routes)
app.get('/health', async (req, res) => {
  const mlServiceStatus = process.env.ML_SERVICE_URL ? 'external' : 'integrated';
  res.json({ 
    status: 'ok', 
    service: 'backend',
    mlService: mlServiceStatus
  });
});

// API Routes (MUST be registered before static file serving)
setupRoutes(app);

// Root route - fallback message (will be overridden by static files if they exist)
app.get('/', (req, res) => {
  res.json({
    message: 'UEFN AI Generator API',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      note: 'If frontend is built, it should be served automatically.'
    }
  });
});

// Serve static files in production (serve frontend from backend)
// IMPORTANT: This must be AFTER API routes to avoid intercepting /api/* requests
if (NODE_ENV === 'production') {
  // Try multiple possible paths for frontend build
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),  // If frontend is in repo root
    path.join(__dirname, '../frontend/dist'),     // If frontend is in backend parent
    path.join(__dirname, './frontend/dist'),      // If frontend is in backend folder
    path.join(process.cwd(), 'frontend/dist'),    // Relative to current working directory
  ];
  
  let staticPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (require('fs').existsSync(testPath)) {
      staticPath = testPath;
      break;
    }
  }
  
  if (staticPath) {
    console.log(`📦 Serving frontend from: ${staticPath}`);
    // Serve static files (but Express will only serve if file exists)
    app.use(express.static(staticPath));
    
    // Serve index.html for all routes that don't start with /api or /health
    // This must be last to catch remaining routes
    app.get('*', (req, res, next) => {
      // Skip if it's an API or health route (shouldn't happen, but just in case)
      if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return next();
      }
      
      const indexPath = path.join(staticPath!, 'index.html');
      if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        next();
      }
    });
  } else {
    console.log('⚠️  Frontend static files not found. API-only mode.');
  }
}

// Start server
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`ML Service: ${process.env.ML_SERVICE_URL || 'Integrated (running as subprocess)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  stopMLService();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  stopMLService();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});