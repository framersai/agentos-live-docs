# DNS Setup Guide for gitpaywidget.com

This guide walks you through configuring your domain (purchased on Porkbun) to work with Cloudflare DNS and point to your Linode server.

---

## Prerequisites

- Domain `gitpaywidget.com` registered on **Porkbun**
- Linode VPS running at **50.116.33.200** (IPv4) and **2600:3c02::2000:a4ff:feba:6730** (IPv6)
- Cloudflare account (free tier works)

---

## Step 1: Add Domain to Cloudflare

1. **Login to Cloudflare**: https://dash.cloudflare.com
2. **Add a Site**:
   - Click **"Add a site"**
   - Enter `gitpaywidget.com`
   - Choose **Free** plan
3. **Cloudflare will scan** existing DNS records (likely empty since it's new)
4. **Continue** to next step

---

## Step 2: Configure DNS Records in Cloudflare

Add the following records in **Cloudflare DNS**:

### A Record (IPv4)

| Type | Name | Content       | Proxy Status | TTL  |
| ---- | ---- | ------------- | ------------ | ---- |
| A    | @    | 50.116.33.200 | Proxied ☁️   | Auto |

### AAAA Record (IPv6)

| Type | Name | Content                        | Proxy Status | TTL  |
| ---- | ---- | ------------------------------ | ------------ | ---- |
| AAAA | @    | 2600:3c02::2000:a4ff:feba:6730 | Proxied ☁️   | Auto |

### CNAME for www (optional)

| Type  | Name | Content          | Proxy Status | TTL  |
| ----- | ---- | ---------------- | ------------ | ---- |
| CNAME | www  | gitpaywidget.com | Proxied ☁️   | Auto |

**Important:**

- ✅ Enable **"Proxied"** (orange cloud) for DDoS protection, caching, and SSL
- 🔒 If you want full control over SSL (e.g., Let's Encrypt on Linode), use **"DNS only"** (gray cloud)

---

## Step 3: Update Nameservers on Porkbun

Cloudflare will show you **2 nameservers** like:

```
anya.ns.cloudflare.com
nash.ns.cloudflare.com
```

1. **Login to Porkbun**: https://porkbun.com/account/domainsSpeedy
2. **Find** `gitpaywidget.com` → click **"Details"**
3. **Scroll to Nameservers** → select **"Use Custom Nameservers"**
4. **Paste** the 2 Cloudflare nameservers
5. **Submit**

**⏱️ Propagation**: Takes 5-60 minutes. Cloudflare will email you when it's active.

---

## Step 4: Configure Cloudflare SSL

1. **Go to** SSL/TLS tab in Cloudflare
2. **Set mode**:
   - **Full (strict)** if you'll run certbot on Linode (recommended)
   - **Flexible** if Nginx only serves HTTP internally (Cloudflare terminates SSL)

3. **Enable** "Always Use HTTPS" (SSL/TLS → Edge Certificates)

---

## Step 5: Verify DNS Propagation

```bash
# Check A record
nslookup gitpaywidget.com

# Should return:
# Non-authoritative answer:
# Name:    gitpaywidget.com
# Address: 50.116.33.200
```

Or use: https://dnschecker.org/#A/gitpaywidget.com

---

## Step 6: SSL Certificate on Linode (if using "Full" mode)

SSH into your Linode:

```bash
ssh -i ~/.ssh/linode_root root@50.116.33.200
```

Install certbot + get certificate:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d gitpaywidget.com -d www.gitpaywidget.com
```

Certbot will:

- Auto-detect your Nginx config
- Obtain SSL cert from Let's Encrypt
- Update `/etc/nginx/sites-available/default` to use HTTPS
- Set up auto-renewal

Test renewal:

```bash
certbot renew --dry-run
```

---

## Step 7: Update Nginx Config (if needed)

Edit `deployment/nginx.conf` to handle both HTTP→HTTPS redirect and proper proxying:

```nginx
server {
  listen 80;
  server_name gitpaywidget.com www.gitpaywidget.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name gitpaywidget.com www.gitpaywidget.com;

  ssl_certificate /etc/letsencrypt/live/gitpaywidget.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/gitpaywidget.com/privkey.pem;

  location / {
    proxy_pass http://app:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Reload Nginx:

```bash
nginx -t
systemctl reload nginx
```

---

## Step 8: Test Your Site

Visit:

- https://gitpaywidget.com → should load the landing page
- https://gitpaywidget.com/dashboard → should redirect to login
- https://gitpaywidget.com/widget-demo → should show the demo

---

## Cloudflare Optimizations (Optional)

### Page Rules

Create rules to optimize caching:

1. **Cache static assets**:
   - URL: `gitpaywidget.com/*.js`, `*.css`, `*.png`, `*.svg`
   - Cache Level: Standard
   - Edge Cache TTL: 1 month

2. **Bypass cache for API**:
   - URL: `gitpaywidget.com/api/*`
   - Cache Level: Bypass

### Firewall Rules

Block bad bots:

- Challenge traffic from countries you don't expect
- Rate-limit `/api/checkout` to prevent abuse

---

## Troubleshooting

### DNS not resolving

- Wait up to 24 hours for full propagation
- Check nameservers: `dig gitpaywidget.com NS`
- Ensure Porkbun shows Cloudflare nameservers

### SSL errors

- If using Cloudflare proxy: set SSL mode to **Full (strict)**
- Run certbot on Linode: `certbot --nginx -d gitpaywidget.com`
- Check cert expiry: `certbot certificates`

### 502 Bad Gateway

- Ensure Docker containers are running: `docker-compose -f docker-compose.prod.yml ps`
- Check app logs: `docker-compose -f docker-compose.prod.yml logs -f app`
- Verify Nginx is proxying to correct port (3000)

---

## Need Help?

Contact **team@manic.agency** with:

- Domain name
- Error screenshots
- Output of `docker-compose logs`

---

**Built by** Manic Agency LLC
