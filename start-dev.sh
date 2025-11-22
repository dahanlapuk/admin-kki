#!/bin/bash

echo "Starting Dashboard KKI Development Servers..."
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "  Development Servers Running"
echo "========================================="
echo "  Backend:  http://localhost:5001"
echo "  Frontend: http://localhost:5173"
echo "  Press Ctrl+C to stop all servers"
echo "========================================="
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
