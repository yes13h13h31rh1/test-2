#!/bin/bash

echo "🎮 Setting up Fortnite UEFN AI Generator..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files
echo "⚙️  Creating environment files..."

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✅ Created frontend/.env"
fi

if [ ! -f ml-service/.env ]; then
  cp ml-service/.env.example ml-service/.env
  echo "✅ Created ml-service/.env"
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p backend/data
mkdir -p ml-service/generated_assets

echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "  1. Terminal 1: npm run dev:backend"
echo "  2. Terminal 2: cd ml-service && python -m uvicorn main:app --reload --port 8000"
echo "  3. Terminal 3: npm run dev:frontend"
