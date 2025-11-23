# PowerShell setup script for Windows

Write-Host "🎮 Setting up Fortnite UEFN AI Generator..." -ForegroundColor Cyan

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Create environment files
Write-Host "⚙️  Creating environment files..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created backend/.env" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Created frontend/.env" -ForegroundColor Green
}

if (-not (Test-Path "ml-service\.env")) {
    Copy-Item "ml-service\.env.example" "ml-service\.env"
    Write-Host "✅ Created ml-service/.env" -ForegroundColor Green
}

# Create directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "backend\data" | Out-Null
New-Item -ItemType Directory -Force -Path "ml-service\generated_assets" | Out-Null

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Cyan
Write-Host "  1. Terminal 1: npm run dev:backend"
Write-Host "  2. Terminal 2: cd ml-service && python -m uvicorn main:app --reload --port 8000"
Write-Host "  3. Terminal 3: npm run dev:frontend"
