#!/usr/bin/env bash
# Gebruik: ./deploy/deploy.sh user@server
# Bouwt de frontend lokaal en deployt alles naar de VPS.
set -euo pipefail

TARGET="${1:?Geef server op: ./deploy.sh user@server}"

echo "==> Frontend bouwen…"
cd "$(dirname "$0")/.."
npx vite build

echo "==> Frontend uploaden naar /var/www/idid.here…"
ssh "$TARGET" "mkdir -p /var/www/idid.here"
rsync -az --delete dist/ "$TARGET:/var/www/idid.here/"

echo "==> Backend uploaden naar /opt/ididhere/backend…"
ssh "$TARGET" "mkdir -p /opt/ididhere/backend/src/routes"
rsync -az --exclude node_modules --exclude .env \
  backend/ "$TARGET:/opt/ididhere/backend/"

echo "==> Bun installeren + dependencies op server…"
ssh "$TARGET" "
  command -v bun || curl -fsSL https://bun.sh/install | bash
  cd /opt/ididhere/backend && \$HOME/.bun/bin/bun install --production
"

echo "==> Nginx-configs plaatsen…"
scp deploy/nginx-frontend.conf "$TARGET:/etc/nginx/sites-available/idid.here"
scp deploy/nginx-backend.conf  "$TARGET:/etc/nginx/sites-available/api.idid.here"
ssh "$TARGET" "
  ln -sf /etc/nginx/sites-available/idid.here     /etc/nginx/sites-enabled/idid.here
  ln -sf /etc/nginx/sites-available/api.idid.here /etc/nginx/sites-enabled/api.idid.here
  nginx -t && systemctl reload nginx
"

echo "==> SSL-certificaten aanvragen (als nog niet aanwezig)…"
ssh "$TARGET" "
  command -v certbot || apt install -y certbot python3-certbot-nginx
  certbot --nginx -d idid.here -d www.idid.here -d api.idid.here --non-interactive --agree-tos -m perry.smit@gmail.com || true
"

echo "==> Systemd service installeren en starten…"
scp deploy/gansjeTippy.service "$TARGET:/etc/systemd/system/gansjeTippy.service"
ssh "$TARGET" "
  systemctl daemon-reload
  systemctl enable gansjeTippy
  systemctl restart gansjeTippy
  systemctl status gansjeTippy --no-pager
"

echo ""
echo "✅ Deploy klaar!"
echo "   Frontend: https://idid.here"
echo "   Backend:  https://api.idid.here/health"
