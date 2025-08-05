#!/bin/bash

# Quick deployment script to fix the abstracts download route
# This script deploys only the critical fix for the Next.js build error

echo "🚀 Deploying critical fix for abstracts download route..."

# Check if we're in the right directory
if [ ! -f "app/api/abstracts/download/route.ts" ]; then
    echo "❌ Error: route.ts file not found. Please run this script from the ntlp project root."
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo "🔍 Checking if the fix is applied locally..."

# Verify the fix is in place locally
if grep -q "export const dynamic = 'force-dynamic'" app/api/abstracts/download/route.ts && grep -q "request.nextUrl" app/api/abstracts/download/route.ts; then
    echo "✅ Fix confirmed in local file"
else
    echo "❌ Fix not found in local file. Please ensure the route.ts file has been updated."
    exit 1
fi

echo "📋 Instructions for manual deployment:"
echo ""
echo "1. Copy the fixed file to production server:"
echo "   scp app/api/abstracts/download/route.ts root@172.27.0.9:/var/www/ntlp-frontend/app/api/abstracts/download/"
echo ""
echo "2. SSH into production server and rebuild:"
echo "   ssh root@172.27.0.9"
echo "   cd /var/www/ntlp-frontend"
echo "   npm run build"
echo "   pm2 restart ntlp-frontend"
echo ""
echo "3. Alternative: Use the fresh deployment script:"
echo "   ./fresh-deploy.sh"
echo ""

# Create a backup of the fixed file
echo "💾 Creating backup of fixed route.ts..."
cp app/api/abstracts/download/route.ts route-fixed-backup.ts
echo "✅ Backup created: route-fixed-backup.ts"

echo ""
echo "🔧 Summary of the fix applied:"
echo "   - Added: export const dynamic = 'force-dynamic'"
echo "   - Changed: new URL(request.url) → request.nextUrl.searchParams"
echo "   - This resolves the Next.js static generation error"
echo ""
echo "📊 After deployment, you should see all pages (15/15) generate successfully"
