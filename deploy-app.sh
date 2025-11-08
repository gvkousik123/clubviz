#!/bin/bash

# Development ClubWiz Frontend Deployment
set -e

echo "🚀 Deploying ClubWiz Frontend (Development Setup)..."

# Clean up first to save space
echo "🧹 Cleaning up Docker cache..."
docker system prune -f || true

# Check if clubwiz-network exists
if ! docker network ls | grep -q "clubwiz-network"; then
    echo "⚠️ clubwiz-network not found. Creating it..."
    docker network create clubwiz-network
fi

# Stop existing frontend if running
echo "🛑 Stopping existing frontend..."
docker-compose down 2>/dev/null || true

# Remove any existing frontend images to save space
docker rmi clubwiz-frontend_clubwiz-frontend 2>/dev/null || true
docker rmi clubwiz-frontend 2>/dev/null || true

# Build with limited memory and no cache for development
echo "🔨 Building frontend for development..."
docker build --no-cache --memory=512m -t clubwiz-frontend .

# Tag for docker-compose
docker tag clubwiz-frontend clubwiz-frontend_clubwiz-frontend

# Start frontend in development mode
echo "🚀 Starting frontend in development mode..."
docker-compose up -d

# Wait for startup
echo "⏳ Waiting for frontend to start..."
sleep 30

# Health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend deployed successfully!"
    echo "🌐 Frontend is running on http://localhost:3000"
    echo "� Development mode with hot reload enabled"
    echo "�📋 Container status:"
    docker ps | grep clubwiz-frontend
else
    echo "❌ Frontend failed to start. Checking logs..."
    docker-compose logs clubwiz-frontend
fi

echo ""
echo "💡 Development setup complete!"
echo "   - Frontend: http://localhost:3000"
echo "   - Hot reload enabled via volume mounts"
echo "   - Use 'docker-compose logs -f clubwiz-frontend' to view logs"