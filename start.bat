@echo off
REM 🚀 ClearPath - Quick Start Script

echo 🚑 ClearPath Emergency Response System
echo ======================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo 📦 Installing root dependencies...
  call npm install
)

if not exist "frontend\node_modules" (
  echo 📦 Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)

if not exist "backend\node_modules" (
  echo 📦 Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

echo.
echo ✅ Dependencies installed
echo.
echo 🚀 Starting ClearPath...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo.
echo Test locations:
echo   From: Times Square, New York, NY
echo   To:   Central Park, New York, NY
echo.

call npm run dev
