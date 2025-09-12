#!/bin/bash

echo "🚀 Starting Welltick Development Environment..."

# Check if environment files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Run 'npm run setup' first."
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ Frontend .env file not found. Run 'npm run setup' first."
    exit 1
fi

# Build shared types if needed
echo "🔨 Building shared types..."
cd shared && npm run build && cd ..

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

trap cleanup INT

# Wait for user to stop
wait