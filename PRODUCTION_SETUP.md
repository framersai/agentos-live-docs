# Production Setup Guide

## Quick Start

```bash
# 1. Build the frontend
cd frontend && npm run build && cd ..

# 2. Enable frontend serving in .env
# Set SERVE_FRONTEND=true in your .env file

# 3. Start the production server
npm run start

# 4. Access the application
# Open http://localhost:3001 (NOT 3000!)
```

## Understanding the Ports

### Development Mode (`npm run dev`)
- Frontend: http://localhost:3000 (Vite dev server)
- Backend API: http://localhost:3001 (Express server)
- Two separate processes running

### Production Mode (`npm run start`)
- Everything: http://localhost:3001
- Backend serves both API and static frontend files
- Single process, optimized for deployment

## Step-by-Step Production Setup

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
Edit `.env` file:
```env
# Required for production
SERVE_FRONTEND=true
PORT=3001
NODE_ENV=production

# Your API keys
OPENAI_API_KEY=your_key_here
# ... other keys
```

### 3. Build Frontend
```bash
cd frontend
npm run build
# This creates frontend/dist with static files
cd ..
```

### 4. Start Production Server
```bash
npm run start
```

### 5. Access Application
Open browser to: **http://localhost:3001**

## CI/CD via GitHub Actions

The repository ships with a deploy workflow located at `.github/workflows/deploy.yml`. It packages the built frontend, backend, and prompt files, then uploads them to the Linode box and restarts the PM2 process. To use it:

1. In GitHub, go to **Settings > Secrets and variables > Actions** and create/update the secret named `ENV`.  
   Paste your production `.env` content (multi-line) into that secret. At minimum include:
   ```
   PORT=3333
   NODE_ENV=production
   FRONTEND_URL=https://app.vca.chat
   APP_URL=https://app.vca.chat
   SERVE_FRONTEND=true
   OPENAI_API_KEY=...
   ROUTING_LLM_PROVIDER_ID=openai
   ROUTING_LLM_MODEL_ID=gpt-4o-mini
   AUTH_JWT_SECRET=...
   GLOBAL_ACCESS_PASSWORD=...
   ```
   Add any additional keys you rely on in production (database, Pinecone, Lemon Squeezy, etc.). The workflow writes this secret verbatim to `~/voice-coding-assistant/.env` on the server.

2. Commit and push to `master` (the workflow trigger), or manually run **Deploy Voice Coding Assistant to Linode (Nginx only)** from the Actions tab.

3. Watch the run. It will stop/start PM2 and verify `/health` on port `3333`. If the job succeeds, the app is live at `https://app.vca.chat`.

If the workflow fails, SSH into the server and check `pm2 logs voice-backend` plus `sudo systemctl status nginx` for details.

## Troubleshooting

### "localhost:3000 refused to connect"
- In production, the app runs on port 3001, not 3000
- Use http://localhost:3001

### Frontend not loading
- Ensure `SERVE_FRONTEND=true` in .env
- Check that `frontend/dist` exists (run build first)
- Verify `frontend/dist/index.html` exists

### API not working
- Check your API keys in .env
- Ensure backend is running (check console output)
- Verify PORT=3001 in .env

- Hit `curl http://localhost:3001/api/system/llm-status` (or the deployed URL) to confirm an LLM provider is configured. A 200 response means the assistant can start; a 503 response includes details about missing API keys.

## Docker Deployment

For containerized deployment:
```bash
docker-compose up -d
```

## Process Management (PM2)

For production servers:
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start backend/dist/server.js --name voice-chat

# Save PM2 config
pm2 save
pm2 startup
```

## Nginx Reverse Proxy

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables Reference

Key production variables:
- `SERVE_FRONTEND=true` - Enable static file serving
- `PORT=3001` - Server port
- `NODE_ENV=production` - Production mode
- `FRONTEND_URL` - Not needed when SERVE_FRONTEND=true
