#!/bin/bash

# Quick deployment script for the route fix
# This copies the fixed route.ts file to production

echo "🚀 Quick Deploy: Fixing abstracts download route..."

# Check if we have the fixed file
if [ ! -f "app/api/abstracts/download/route.ts" ]; then
    echo "❌ Error: route.ts not found"
    exit 1
fi

# Verify the fix is applied
if grep -q "export const dynamic = 'force-dynamic'" app/api/abstracts/download/route.ts; then
    echo "✅ Fix confirmed in local file"
else
    echo "❌ Fix not found in local file"
    exit 1
fi

echo "📋 Manual deployment steps:"
echo ""
echo "1. Copy the fixed file to production:"
echo "   scp app/api/abstracts/download/route.ts root@172.27.0.9:/var/www/ntlp-frontend/app/api/abstracts/download/"
echo ""
echo "2. Rebuild on production server:"
echo "   ssh root@172.27.0.9"
echo "   cd /var/www/ntlp-frontend"
echo "   npm run build"
echo "   pm2 restart ntlp-frontend"
echo ""
echo "The fix changes:"
echo "  - OLD: new URL(request.url)"
echo "  - NEW: request.nextUrl.searchParams"
echo "  - ADDED: export const dynamic = 'force-dynamic'"
echo ""
echo "After deployment, the build should complete with 15/15 pages successfully."
