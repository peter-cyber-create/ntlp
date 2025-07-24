#!/bin/bash

# MySQL Database Setup Script for NTLP Conference 2025
# This script sets up the MySQL database and tables

echo "🔧 Setting up MySQL database for NTLP Conference 2025..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="ntlp_conference_2025"
SCHEMA_FILE="database/schema.sql"

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed or not in PATH${NC}"
    echo "Please install MySQL first:"
    echo "  Ubuntu/Debian: sudo apt install mysql-server"
    echo "  macOS: brew install mysql"
    echo "  Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}❌ Schema file not found: $SCHEMA_FILE${NC}"
    exit 1
fi

# Function to run MySQL command
run_mysql() {
    local command="$1"
    local description="$2"
    
    echo -e "${YELLOW}🔄 $description...${NC}"
    
    if mysql -u root -p -e "$command" 2>/dev/null; then
        echo -e "${GREEN}✅ $description completed${NC}"
        return 0
    else
        echo -e "${RED}❌ $description failed${NC}"
        return 1
    fi
}

# Function to run MySQL script file
run_mysql_file() {
    local file="$1"
    local description="$2"
    
    echo -e "${YELLOW}🔄 $description...${NC}"
    
    if mysql -u root -p < "$file" 2>/dev/null; then
        echo -e "${GREEN}✅ $description completed${NC}"
        return 0
    else
        echo -e "${RED}❌ $description failed${NC}"
        return 1
    fi
}

echo "Please enter your MySQL root password when prompted."
echo ""

# Test MySQL connection
echo -e "${YELLOW}🔄 Testing MySQL connection...${NC}"
if mysql -u root -p -e "SELECT 1;" &>/dev/null; then
    echo -e "${GREEN}✅ MySQL connection successful${NC}"
else
    echo -e "${RED}❌ Failed to connect to MySQL${NC}"
    echo "Please check your MySQL installation and credentials."
    exit 1
fi

# Create database and run schema
echo ""
echo -e "${YELLOW}🔄 Setting up database schema...${NC}"
if run_mysql_file "$SCHEMA_FILE" "Database schema setup"; then
    echo -e "${GREEN}✅ Database setup completed successfully!${NC}"
else
    echo -e "${RED}❌ Database setup failed${NC}"
    exit 1
fi

# Verify tables were created
echo ""
echo -e "${YELLOW}🔄 Verifying database setup...${NC}"
TABLE_COUNT=$(mysql -u root -p -D "$DB_NAME" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null)

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Database verification successful${NC}"
    echo -e "${GREEN}📊 Created $TABLE_COUNT tables in database '$DB_NAME'${NC}"
    
    echo ""
    echo -e "${YELLOW}📋 Tables created:${NC}"
    mysql -u root -p -D "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null
    
    echo ""
    echo -e "${GREEN}🎉 MySQL database setup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Update your .env.local file with the database credentials:"
    echo "   DB_HOST=localhost"
    echo "   DB_PORT=3306"
    echo "   DB_USER=root"
    echo "   DB_PASSWORD=your_mysql_password"
    echo "   DB_NAME=$DB_NAME"
    echo ""
    echo "2. Start your Next.js application:"
    echo "   npm run dev"
    echo ""
    echo "3. Test the database connection at:"
    echo "   http://localhost:3000/database-test"
    
else
    echo -e "${RED}❌ Database verification failed${NC}"
    exit 1
fi
