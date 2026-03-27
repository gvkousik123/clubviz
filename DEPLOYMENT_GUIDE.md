# 🚀 ClubViz Frontend - Complete Deployment Guide

## 📌 What Are These URLs?

### **NEXT_PUBLIC_API_URL**
- **Purpose**: Base URL for all API calls to the backend server
- **Usage**: Your frontend calls this to fetch clubs, events, bookings, etc.
- **Current Value**: `https://clubwiz.in` (production backend)
- **Environment Variable**: Set at build time in Docker

### **NEXT_PUBLIC_SOCKET_URL**
- **Purpose**: WebSocket server for real-time updates (notifications, live data)
- **Usage**: Currently not actively used in the app, but configured for future use
- **Current Value**: `https://clubwiz.in` (same as API URL for simplicity)
- **Note**: Can be a separate server or same as API URL

---

## 🏗️ Project Structure

```
clubviz/
├── .dockerignore                      # Files to exclude from Docker build
├── .env.example                       # Example environment variables
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions CI/CD pipeline
├── Dockerfile                         # Docker container definition
├── docker-compose.yml                 # Local development with Docker
├── deploy/
│   └── nginx/
│       └── app.conf                   # Nginx reverse proxy config
├── package.json                       # Dependencies
├── pnpm-lock.yaml                     # Locked dependency versions (use pnpm!)
├── pnpm-workspace.yaml                # Workspace config
├── next.config.mjs                    # Next.js config
├── tsconfig.json                      # TypeScript config
└── app/, components/, hooks/, etc.    # Source code
```

---

## 🔧 Environment Files

### `.env.example` - Reference file (commited to git)
Shows all available environment variables without secrets.

### `.env.local` - Local development (git ignored)
Create this locally:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

### Docker Build Args
Set during `docker build`:
```bash
NEXT_PUBLIC_API_URL=https://clubwiz.in
NEXT_PUBLIC_SOCKET_URL=https://clubwiz.in
NEXT_PUBLIC_APP_ENV=production
```

---

## 📦 Key Files Explained

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds the Docker image with pnpm (not npm!) |
| `docker-compose.yml` | Runs frontend + nginx locally |
| `.dockerignore` | Excludes large folders from Docker build (node_modules, .git, etc.) |
| `deploy/nginx/app.conf` | Reverse proxy config with SSL support |
| `.github/workflows/deploy.yml` | Auto-build & deploy on git push |

---

## 🐳 Docker Build Configuration

### What's Included in Docker?
- ✅ Node.js 20.18.0 Alpine (lightweight)
- ✅ PNPM package manager (not npm!)
- ✅ Next.js build with TypeScript
- ✅ Health check endpoint
- ✅ Non-root user (security)
- ✅ Environment variables compiled at build time

### What's Excluded (.dockerignore)?
- ❌ node_modules (reinstalled in container)
- ❌ .git (not needed in production)
- ❌ .next (rebuilt in container)
- ❌ development files
- ❌ design screens & scripts

---

## 📋 Required Configuration Steps

### 1. GitHub Secrets (for CI/CD)
Go to **Settings → Secrets and variables → Actions** and add:

```
DOCKER_USERNAME          → Your Docker Hub username
DOCKER_PASSWORD          → Your Docker Hub token
SSH_PRIVATE_KEY          → Your EC2 SSH private key (full key including --- BEGIN/END ---)
```

✅ **API URLs are hardcoded** - No need for secrets!

### 2. Local Setup
```bash
# Copy example env file
cp .env.example .env.local

# Edit with local API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Production (on EC2)
The GitHub Actions workflow will:
1. ✅ Build Docker image with hardcoded URLs
2. ✅ Push to Docker Hub
3. ✅ SSH into EC2
4. ✅ Pull and run container with docker-compose

---

## 🚀 Deployment Methods

### Option 1: Local Development with Docker
```bash
docker-compose up
# Frontend: http://localhost:3000
# Nginx proxy: http://localhost:80
```

### Option 2: Manual Docker Build
```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://clubwiz.in \
  --build-arg NEXT_PUBLIC_SOCKET_URL=https://clubwiz.in \
  -t gvenkatakousik/clubviz:latest .

docker run -p 3000:3000 gvenkatakousik/clubviz:latest
```

### Option 3: GitHub Actions (Automatic)
```bash
git add .
git commit -m "Deploy update"
git push origin main
# ✅ Automatically builds, pushes to Docker Hub, and deploys to EC2
```

### Option 4: Manual EC2 Deployment
```bash
ssh ec2-user@13.235.40.237

# Pull latest image
docker pull gvenkatakousik/clubviz:latest

# Run with docker-compose
cd /path/to/clubviz
docker-compose up -d
```

---

## 🌐 API Integration

The frontend gets its API URL from the environment variable at **build time**.

### How it works:
1. **Build time** (in Docker):
   ```dockerfile
   ARG NEXT_PUBLIC_API_URL=https://clubwiz.in
   ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
   ```

2. **Runtime** (in browser):
   ```javascript
   // lib/api-client.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clubwiz.in';
   ```

3. **API Calls**:
   ```javascript
   // All requests to:
   GET https://clubwiz.in/clubs
   POST https://clubwiz.in/bookings
   etc.
   ```

---

## ✅ File Checklist

- ✅ `Dockerfile` - Uses pnpm, passes environment variables
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `docker-compose.yml` - Frontend + Nginx configuration
- ✅ `deploy/nginx/app.conf` - Reverse proxy with WebSocket support
- ✅ `.env.example` - Reference for environment variables
- ✅ `.github/workflows/deploy.yml` - CI/CD pipeline
- ✅ `package.json` - Dependencies (using pnpm)
- ✅ `pnpm-lock.yaml` - Locked versions

---

## 🔗 URLs Summary

| Environment | API URL | Status |
|------------|---------|--------|
| **Production (EC2)** | https://clubwiz.in | ✅ Live |
| **Production (Docker)** | https://clubwiz.in | ✅ Configured |
| **Local Dev** | http://localhost:8000 | 📝 Set in .env.local |
| **Docker Compose** | https://clubwiz.in | ✅ In docker-compose.yml |

---

## 🆘 Troubleshooting

### Docker build fails with "pnpm not found"
✅ Fixed! Dockerfile now installs pnpm@9 globally

### API calls fail in production
Check that `NEXT_PUBLIC_API_URL` is set correctly in:
- `Dockerfile` ARG
- `docker-compose.yml` build args
- GitHub Actions deploy.yml

### Health check fails
Ensure `/api/health` endpoint exists on backend at `https://clubwiz.in/api/health`

### Nginx not proxying correctly
Check that:
1. Frontend container is running (docker ps)
2. Nginx volume mount is correct
3. `app.conf` syntax is valid (test with `nginx -t`)

---

## 📞 Questions?

All important files are in place. The deployment is configured and ready to use!

**Key takeaway**: Use **pnpm**, not npm!
