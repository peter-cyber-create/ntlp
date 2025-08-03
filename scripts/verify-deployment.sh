#!/bin/bash

# NTLP Conference 2025 - Deployment Verification Script
# Verify that the application is properly deployed and running

echo "🔍 NTLP Conference 2025 - Deployment Verification"
echo "================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_NAME="ntlp-production"
SERVER_IP="172.27.0.9"
DB_NAME="ntlp_conference_2025"
DB_USER="ntlp_user"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Testing $test_name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check service
check_service() {
    local service="$1"
    echo -n "Checking $service service... "
    
    if systemctl is-active --quiet "$service"; then
        echo -e "${GREEN}RUNNING${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}NOT RUNNING${NC}"
        ((TESTS_FAILED++))
    fi
}

echo ""
echo "🔧 System Services"
echo "-----------------"
check_service "nginx"
check_service "mysql"

echo ""
echo "📦 Application Status"
echo "--------------------"
run_test "PM2 application" "pm2 list | grep -q $APP_NAME"
run_test "Node.js application port 3000" "curl -f http://localhost:3000"
run_test "Nginx proxy port 80" "curl -f http://localhost"

echo ""
echo "🗄️  Database Connectivity"
echo "------------------------"
run_test "MySQL connection" "mysql -u $DB_USER -psecure_password_here -e 'USE $DB_NAME; SELECT 1;'"
run_test "Database tables exist" "mysql -u $DB_USER -psecure_password_here -e 'USE $DB_NAME; SHOW TABLES;' | grep -q abstracts"

echo ""
echo "📁 File System"
echo "--------------"
run_test "Application directory" "[ -d /var/www/ntlp ]"
run_test "Upload directory" "[ -d /var/www/ntlp/public/uploads ]"
run_test "Upload permissions" "[ -w /var/www/ntlp/public/uploads ]"
run_test "Nginx config" "[ -f /etc/nginx/sites-enabled/ntlp ]"

echo ""
echo "🌐 Web Application"
echo "-----------------"
run_test "Homepage loads" "curl -f http://localhost | grep -q 'Conference'"
run_test "Admin panel accessible" "curl -f http://localhost/admin"
run_test "API endpoints" "curl -f http://localhost/api/abstracts"

echo ""
echo "🔒 Security"
echo "-----------"
run_test "UFW firewall enabled" "ufw status | grep -q 'Status: active'"
run_test "No sensitive files exposed" "! curl -f http://localhost/.env"

echo ""
echo "💾 Backup System"
echo "---------------"
run_test "Backup directory exists" "[ -d /var/backups/ntlp ]"
run_test "Backup script exists" "[ -f /var/www/ntlp/scripts/backup.sh ]"
run_test "Backup script executable" "[ -x /var/www/ntlp/scripts/backup.sh ]"

echo ""
echo "📊 Performance"
echo "-------------"
echo -n "Response time (ms): "
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost | awk '{print $1*1000}')
echo "$RESPONSE_TIME"

echo -n "Memory usage: "
FREE_MEM=$(free -h | awk 'NR==2{print $3}')
echo "$FREE_MEM"

echo -n "Disk usage: "
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}')
echo "$DISK_USAGE"

echo ""
echo "================================================="
echo "📈 Test Summary"
echo "================================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Deployment is successful.${NC}"
    echo ""
    echo "🎉 Your NTLP Conference website is ready!"
    echo "🌐 Website: http://$SERVER_IP"
    echo "👨‍💼 Admin: http://$SERVER_IP/admin"
    echo ""
    echo "🔐 Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: conference2025"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the issues above.${NC}"
    echo ""
    echo "🛠️  Troubleshooting:"
    echo "   - Check PM2 status: pm2 status"
    echo "   - Check Nginx: sudo systemctl status nginx"
    echo "   - Check MySQL: sudo systemctl status mysql"
    echo "   - View logs: pm2 logs $APP_NAME"
    exit 1
fi
