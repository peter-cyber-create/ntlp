#!/bin/bash

echo "🔍 Database Connection and Schema Test"
echo "===================================="

# Test MySQL connection
echo "1. Testing MySQL connection..."
mysql -u root -p -e "SELECT 'MySQL connection successful' as status;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed - please check if MySQL is running"
    echo "   Try: sudo systemctl start mysql"
    exit 1
fi

# Check if database exists
echo ""
echo "2. Checking if database exists..."
DB_EXISTS=$(mysql -u root -p -e "SHOW DATABASES LIKE 'ntlp_conference_2025';" 2>/dev/null | grep ntlp_conference_2025)

if [ -n "$DB_EXISTS" ]; then
    echo "✅ Database 'ntlp_conference_2025' exists"
else
    echo "❌ Database 'ntlp_conference_2025' does not exist"
    echo "   Creating database..."
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ntlp_conference_2025 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    echo "✅ Database created"
fi

# Check tables
echo ""
echo "3. Checking database tables..."
TABLES=$(mysql -u root -p ntlp_conference_2025 -e "SHOW TABLES;" 2>/dev/null)

if echo "$TABLES" | grep -q "registrations"; then
    echo "✅ registrations table exists"
else
    echo "❌ registrations table missing - run the schema script"
fi

if echo "$TABLES" | grep -q "abstracts"; then
    echo "✅ abstracts table exists"
else
    echo "❌ abstracts table missing - run the schema script"
fi

if echo "$TABLES" | grep -q "contacts"; then
    echo "✅ contacts table exists"
else
    echo "❌ contacts table missing - run the schema script"
fi

# Check registration types
echo ""
echo "4. Checking registration table schema..."
REG_SCHEMA=$(mysql -u root -p ntlp_conference_2025 -e "DESCRIBE registrations;" 2>/dev/null)

if echo "$REG_SCHEMA" | grep -q "district"; then
    echo "✅ district field exists"
else
    echo "❌ district field missing - schema needs update"
fi

if echo "$REG_SCHEMA" | grep -q "payment_amount"; then
    echo "✅ payment_amount field exists"
else
    echo "❌ payment_amount field missing - schema needs update"
fi

echo ""
echo "5. Environment Configuration Check"
echo "================================="

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    if grep -q "DB_HOST" .env.local; then
        echo "✅ DB_HOST configured"
    else
        echo "❌ DB_HOST not configured in .env.local"
    fi
    
    if grep -q "DB_NAME" .env.local; then
        echo "✅ DB_NAME configured"
    else
        echo "❌ DB_NAME not configured in .env.local"
    fi
else
    echo "❌ .env.local file missing"
    echo "   Creating sample .env.local..."
    cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ntlp_conference_2025
DB_USER=root
DB_PASSWORD=your_mysql_password

# For production (use connection pooling)
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
EOF
    echo "✅ Sample .env.local created - please update with your MySQL credentials"
fi

echo ""
echo "🚀 Quick Setup Commands:"
echo "========================"
echo "1. If tables are missing, run:"
echo "   mysql -u root -p ntlp_conference_2025 < MYSQL_SETUP.md"
echo ""
echo "2. If schema needs update, run:"
echo "   mysql -u root -p ntlp_conference_2025 < database/migration_001_update_registrations.sql"
echo ""
echo "3. Start the Next.js server:"
echo "   npm run dev"
echo ""
echo "4. Test the API:"
echo "   ./test_complete_api.sh"
