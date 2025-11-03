#!/bin/bash
# Emergency production restart script

echo "🚨 Emergency restart of VCA production server..."

# SSH into Linode and restart services
ssh $1@$2 << 'EOF'
echo "Stopping PM2 processes..."
pm2 stop all
pm2 delete all

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Starting backend with PM2..."
cd ~/voice-chat-assistant/backend
pm2 start ecosystem.config.json
pm2 save

echo "Checking status..."
pm2 list
sudo systemctl status nginx --no-pager

echo "✅ Services restarted. Waiting for health check..."
sleep 5

# Health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/health)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️ Backend health check failed with status $HTTP_STATUS"
    pm2 logs voice-backend --lines 20
fi
EOF
