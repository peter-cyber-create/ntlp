#!/bin/bash

# MySQL Database Setup Script for Conference 2025
# Single-Server Setup - Database, User, and Tables on 172.27.0.9

echo "🔧 Setting up MySQL database for Conference 2025 on single server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration for single server
DB_NAME="conf"
DB_USER="conf_user"
DB_PASSWORD="toor"
DB_HOST="127.0.0.1"  # Local MySQL on same server
SCHEMA_FILE="database/setup.sql"
SERVER_IP="172.27.0.9"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed or not in PATH"
    echo "Please install MySQL first:"
    echo "  Ubuntu/Debian: sudo apt install mysql-server"
    echo "  CentOS/RHEL: sudo yum install mysql-server"
    exit 1
fi

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

print_status "Starting MySQL setup for single-server deployment..."
print_status "Target Server: $SERVER_IP"
print_status "Database: $DB_NAME"
print_status "User: $DB_USER"

# Function to run MySQL command
run_mysql() {
    local command="$1"
    local description="$2"
    
    print_status "$description..."
    
    if mysql -u root -p -e "$command" 2>/dev/null; then
        print_success "$description completed"
        return 0
    else
        print_error "$description failed"
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
    echo "2. Build and start the application:"
    echo "   npm run build"
    echo "   npm start"
    echo ""
    echo "3. Access your application at:"
    echo "   http://localhost:3000"
    
else
    echo -e "${RED}❌ Database verification failed${NC}"
    exit 1
fi
