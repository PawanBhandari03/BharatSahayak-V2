#!/usr/bin/env bash
# One-time setup of BharatSahayak on an Amazon Linux 2023 EC2 instance (t3.micro / free tier).
# Run as ec2-user:  bash deploy/setup-ec2.sh
# Afterwards put your keys in backend/.env and run:  bash deploy/update.sh
set -euo pipefail

REPO_URL="https://github.com/PawanBhandari03/BharatSahayak-Catalyst.git"
APP_DIR="$HOME/BharatSahayak-Catalyst"

echo "==> Installing Node.js 20 and git"
sudo dnf install -y git
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

echo "==> Adding 2 GB swap (the 1 GB instance needs it to build the website)"
if [ ! -f /swapfile ]; then
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
fi

echo "==> Installing pm2 (keeps the server running and restarts it after a reboot)"
sudo npm install -g pm2

echo "==> Getting the code"
if [ ! -d "$APP_DIR" ]; then git clone "$REPO_URL" "$APP_DIR"; fi
cd "$APP_DIR"
[ -f backend/.env ] || cp backend/.env.example backend/.env

echo
echo "Setup done. Next:"
echo "  1) nano $APP_DIR/backend/.env     (paste your keys, then Ctrl+O, Enter, Ctrl+X)"
echo "  2) bash $APP_DIR/deploy/update.sh"
