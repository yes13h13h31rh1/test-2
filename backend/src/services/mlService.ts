import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import axios from 'axios';

let mlProcess: ChildProcess | null = null;
const ML_PORT = process.env.ML_SERVICE_PORT ? parseInt(process.env.ML_SERVICE_PORT, 10) : 8001;
const ML_URL = `http://localhost:${ML_PORT}`;

export function startMLService(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (mlProcess) {
      console.log('ML service already running');
      return resolve();
    }

    // Try multiple paths for ml-service directory
    const possiblePaths = [
      path.join(__dirname, '../../../ml-service'),  // If running from backend/dist
      path.join(process.cwd(), 'ml-service'),       // From project root
      path.join(__dirname, '../../ml-service'),     // Alternative path
    ];
    
    let mlServicePath: string | null = null;
    for (const testPath of possiblePaths) {
      if (require('fs').existsSync(path.join(testPath, 'main.py'))) {
        mlServicePath = testPath;
        break;
      }
    }
    
    if (!mlServicePath) {
      throw new Error('ML service directory not found. Checked: ' + possiblePaths.join(', '));
    }
    
    // Try python3, python, or use env var
    const pythonPath = process.env.PYTHON_PATH || 'python3';

    console.log(`🚀 Starting ML service at ${ML_URL}...`);
    console.log(`ML Service path: ${mlServicePath}`);

    // Start Python ML service
    mlProcess = spawn(pythonPath, [
      '-m', 'uvicorn',
      'main:app',
      '--host', '0.0.0.0',
      '--port', ML_PORT.toString(),
      '--workers', '1'
    ], {
      cwd: mlServicePath,
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: ML_PORT.toString(),
        ASSETS_DIR: path.join(mlServicePath, 'generated_assets')
      }
    });

    mlProcess.on('error', (error) => {
      console.error('❌ Failed to start ML service:', error);
      mlProcess = null;
      reject(error);
    });

    mlProcess.on('exit', (code) => {
      console.log(`ML service exited with code ${code}`);
      mlProcess = null;
    });

    // Wait for ML service to be ready
    const maxAttempts = 30;
    let attempts = 0;

    const checkHealth = setInterval(() => {
      attempts++;
      
      axios.get(`${ML_URL}/ml/health`)
        .then(() => {
          console.log('✅ ML service is ready!');
          clearInterval(checkHealth);
          resolve();
        })
        .catch(() => {
          if (attempts >= maxAttempts) {
            clearInterval(checkHealth);
            console.error('❌ ML service failed to start after 30 seconds');
            reject(new Error('ML service failed to start'));
          }
        });
    }, 1000);
  });
}

export function stopMLService(): void {
  if (mlProcess) {
    console.log('Stopping ML service...');
    mlProcess.kill();
    mlProcess = null;
  }
}

export function getMLServiceURL(): string {
  return ML_URL;
}

// Graceful shutdown
process.on('SIGTERM', () => {
  stopMLService();
  process.exit(0);
});

process.on('SIGINT', () => {
  stopMLService();
  process.exit(0);
});
