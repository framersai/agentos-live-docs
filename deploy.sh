#!/bin/bash
# Simple deployment script
echo "Deploying to Linode..."

ssh root@172.236.30.83 << 'EOF'
cd /root/voice-chat-assistant
git pull origin master
cp .env backend/.env
cd frontend
npm install
npm run build
cp -r dist/* /var/www/voice-chat-assistant/
cd ../backend
npm install
npm run build
pm2 restart voice-backend
echo "Deployment complete!"
pm2 status
EOF
