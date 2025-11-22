#!/bin/bash

echo "========================================="
echo "  Dashboard KKI Setup Script"
echo "  GMNI DPC Depok"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB >= 6.0.0"
    echo "   On Ubuntu/Debian: sudo apt install mongodb"
    echo "   On MacOS: brew install mongodb-community"
    echo ""
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Create .env files if they don't exist
cd ..
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (please update with your configuration)"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

echo ""
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Update backend/.env with your MongoDB URI and secrets"
echo "  2. Start MongoDB: sudo systemctl start mongod"
echo "  3. Seed database: cd backend && npm run seed"
echo "  4. Start development:"
echo "     Terminal 1: cd backend && npm run dev"
echo "     Terminal 2: cd frontend && npm run dev"
echo ""
echo "Default login credentials:"
echo "  Email: superadmin@gmni-depok.org"
echo "  Password: admin123"
echo ""
