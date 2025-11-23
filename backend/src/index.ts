import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './database';
import { setupRoutes } from './routes';

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

// Serve static files in production (if frontend is built alongside backend)
if (NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
  const staticPath = path.join(__dirname, '../frontend/dist');
  if (require('fs').existsSync(staticPath)) {
    app.use(express.static(staticPath));
    
    // Serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
        const indexPath = path.join(staticPath, 'index.html');
        if (require('fs').existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          next();
        }
      } else {
        next();
      }
    });
  }
}

// Initialize database
initDatabase();

// Routes
setupRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend' });
});

// Root route - helpful message
app.get('/', (req, res) => {
  res.json({
    message: 'UEFN AI Generator API',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: 'This is the backend API server. Access the frontend at your frontend URL.'
    },
    frontendUrl: process.env.FRONTEND_URL || 'Not configured'
  });
});

// Start server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
