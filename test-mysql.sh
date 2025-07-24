#!/bin/bash

# Quick MySQL Connection Test
# This script tests if the MySQL database is properly configured

echo "🔍 Testing MySQL connection and database setup..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Database configuration
DB_NAME="ntlp_conference_2025"

# Test MySQL connection
echo -e "${YELLOW}Testing MySQL connection...${NC}"
if mysql -u root -p -e "SELECT 1;" &>/dev/null; then
    echo -e "${GREEN}✅ MySQL connection successful${NC}"
else
    echo -e "${RED}❌ MySQL connection failed${NC}"
    echo "Please check your MySQL installation and credentials."
    exit 1
fi

# Test database exists
echo -e "${YELLOW}Checking if database exists...${NC}"
if mysql -u root -p -e "USE $DB_NAME;" &>/dev/null; then
    echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
else
    echo -e "${RED}❌ Database '$DB_NAME' not found${NC}"
    echo "Please run: ./setup-mysql.sh"
    exit 1
fi

# Test tables exist
echo -e "${YELLOW}Checking database tables...${NC}"
TABLE_COUNT=$(mysql -u root -p -D "$DB_NAME" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null)

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $TABLE_COUNT tables in database${NC}"
    echo ""
    echo -e "${YELLOW}Tables:${NC}"
    mysql -u root -p -D "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null
else
    echo -e "${RED}❌ No tables found in database${NC}"
    echo "Please run: ./setup-mysql.sh"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 MySQL setup verification completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy .env.example to .env.local and update with your credentials"
echo "2. Start the application: npm run dev"
echo "3. Test the connection: http://localhost:3000/database-test"
