#!/bin/bash
# Deploy and migrate script for ntlp-frontend abstracts update
# 1. Pull latest code
# 2. Run DB migration for subcategory
# 3. Build and restart app

set -e

REMOTE_DIR="/var/www/ntlp-frontend"
MIGRATION="database/migration_002_add_subcategory_to_abstracts.sql"

# 1. Pull latest code
echo "[1/4] Pulling latest code from git..."
git pull

# 2. Run DB migration
echo "[2/4] Running database migration for subcategory..."
if [ -f "$MIGRATION" ]; then
  sudo mysql -u root conf < "$MIGRATION"
else
  echo "Migration file not found: $MIGRATION"
  exit 1
fi

# 3. Install dependencies
echo "[3/4] Installing/updating dependencies..."
npm install

# 4. Build and restart app
echo "[4/4] Building and restarting app..."
npm run build
pm2 restart ntlp-frontend

echo "✅ Deployment and migration complete."
