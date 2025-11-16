#!/bin/bash

echo "Starting Shopease Application..."
echo ""

# Start Backend
echo "Starting Backend Server..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend Server..."
cd frontend
python -m http.server 8000 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Application Started!"
echo "========================================"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

