#!/usr/bin/env bash
# Pull the latest code, rebuild the website and (re)start the server.
# Run on the EC2 instance:  bash deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only

echo "==> Backend dependencies"
(cd backend && npm install --omit=dev)

echo "==> Building the website (same-origin API: VITE_API_URL is empty)"
(cd frontend && npm install && VITE_API_URL= npm run build)

echo "==> Starting the server with pm2"
cd backend
if pm2 describe bharatsahayak >/dev/null 2>&1; then
  pm2 restart bharatsahayak --update-env
else
  pm2 start server.js --name bharatsahayak
fi
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null 2>&1 || true

sleep 3
echo "==> Health check"
curl -s localhost:5000/health && echo
