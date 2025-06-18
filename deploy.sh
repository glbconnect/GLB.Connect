#!/bin/bash

echo "🚀 QNA Threads Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Please create a .env file with your environment variables"
else
    echo "✅ .env file found"
fi

# Check if client/.env file exists
if [ ! -f "client/.env" ]; then
    echo "⚠️  Warning: client/.env file not found"
    echo "Please create client/.env file with your frontend environment variables"
else
    echo "✅ client/.env file found"
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd client
npm run build
cd ..

echo "✅ Build completed successfully!"

echo ""
echo "🎯 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/qna-threads.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy backend to Railway/Render/Heroku"
echo "3. Deploy frontend to Vercel/Netlify"
echo "4. Set up environment variables on your hosting platforms"
echo "5. Set up PostgreSQL database"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 