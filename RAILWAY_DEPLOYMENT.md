# Railway.app Deployment Guide

This project is configured for deployment on Railway.app. Follow these steps to deploy:

## Prerequisites
- A Railway.app account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### Option 1: Deploy from Git Repository
1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo" (or your git provider)
4. Select this repository
5. Railway will automatically detect it's a Node.js project
6. The build and deployment will start automatically

### Option 2: Using Railway CLI
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

## Configuration

### Environment Variables
If your app needs environment variables, set them in Railway dashboard:
- Go to your project dashboard
- Click on "Variables" tab
- Add your environment variables

### Custom Domain
To add a custom domain:
1. Go to your project dashboard
2. Click on "Settings"
3. Add your custom domain in the "Domains" section

## Build Process
Railway will automatically:
1. Install dependencies (`npm ci`)
2. Build the Angular app (`npm run build`)
3. Run post-build checks (`npm run postbuild`)
4. Start the Express server (`npm start`)

## Local Testing
To test the production build locally:
```bash
npm run build
npm start
```

## Files Added for Railway Deployment
- `server.js` - Express server to serve the Angular app
- `post-build.js` - Post-build validation script
- `railway.json` - Railway configuration
- `Dockerfile` - Docker configuration (alternative deployment method)
- `.dockerignore` - Docker ignore file

## Troubleshooting
- Check Railway logs in the project dashboard
- Ensure all dependencies are in `package.json` dependencies (not devDependencies)
- Verify the build output in `dist/meeting-scheduler/`
