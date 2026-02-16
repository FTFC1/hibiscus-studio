#!/bin/bash
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit backend/.env and add your GEMINI_API_KEY"
    exit 1
fi

echo "Starting backend server..."
uvicorn main:app --reload --port 8000
