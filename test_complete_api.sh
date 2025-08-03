#!/bin/bash

# Comprehensive API Test Script for NTLP Conference System
# Tests all endpoints: registrations, abstracts, contacts, and admin

echo "🧪 NTLP Conference - Complete API Integration Test"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0

# Helper function to run test
run_test() {
    local test_name="$1"
    local expected_result="$2"
    local actual_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if echo "$actual_result" | grep -q "$expected_result"; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        echo -e "${RED}   Expected: $expected_result${NC}"
        echo -e "${RED}   Got: $actual_result${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 1. Testing Registration API${NC}"
echo "================================"

# Test 1: Registration submission
echo -e "${YELLOW}Testing registration submission...${NC}"
REG_RESPONSE=$(curl -s -X POST "$BASE_URL/api/registrations" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "test-'$TIMESTAMP'@example.com",
    "phone": "+256701234567",
    "organization": "Test University",
    "position": "Research Fellow",
    "district": "Kampala",
    "registrationType": "local",
    "special_needs": "No special requirements"
  }')

run_test "Registration submission" '"success":true' "$REG_RESPONSE"

# Test 2: Get registrations
echo -e "${YELLOW}Testing GET registrations...${NC}"
GET_REG_RESPONSE=$(curl -s "$BASE_URL/api/registrations")
run_test "GET registrations" '"success":true' "$GET_REG_RESPONSE"

# Test 3: Duplicate email validation
echo -e "${YELLOW}Testing duplicate email validation...${NC}"
DUP_REG_RESPONSE=$(curl -s -X POST "$BASE_URL/api/registrations" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "test-'$TIMESTAMP'@example.com",
    "phone": "+256701234568",
    "organization": "Another University",
    "position": "Professor",
    "district": "Jinja",
    "registrationType": "grad"
  }')

run_test "Duplicate email validation" '"success":false' "$DUP_REG_RESPONSE"

echo ""
echo -e "${BLUE}📄 2. Testing Abstracts API${NC}"
echo "============================="

# Test 4: Abstract submission (form data)
echo -e "${YELLOW}Testing abstract submission...${NC}"
ABS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/abstracts" \
  -F "title=Machine Learning in Healthcare Diagnostics" \
  -F "abstract_text=This study explores the application of machine learning algorithms in improving diagnostic accuracy for infectious diseases in Uganda. We analyzed over 10,000 patient records..." \
  -F "keywords=machine learning, healthcare, diagnostics, Uganda" \
  -F "category=digital_health" \
  -F "presentation_type=oral" \
  -F "primary_author_first_name=Dr. Alice" \
  -F "primary_author_last_name=Nakamura" \
  -F "primary_author_email=alice-'$TIMESTAMP'@example.com" \
  -F "primary_author_institution=Makerere University" \
  -F "primary_author_department=Computer Science" \
  -F "primary_author_position=Senior Lecturer" \
  -F "primary_author_phone=+256701234569" \
  -F "primary_author_country=Uganda" \
  -F "conflict_of_interest=None" \
  -F "funding_source=National Research Council" \
  -F "ethical_approval=true")

run_test "Abstract submission" '"success":true' "$ABS_RESPONSE"

# Test 5: Get abstracts
echo -e "${YELLOW}Testing GET abstracts...${NC}"
GET_ABS_RESPONSE=$(curl -s "$BASE_URL/api/abstracts")
run_test "GET abstracts" '"success":true' "$GET_ABS_RESPONSE"

# Test 6: Invalid category validation
echo -e "${YELLOW}Testing invalid category validation...${NC}"
INV_ABS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/abstracts" \
  -F "title=Invalid Category Test" \
  -F "abstract_text=Testing invalid category" \
  -F "category=invalid_category" \
  -F "presentation_type=oral" \
  -F "primary_author_first_name=Test" \
  -F "primary_author_last_name=User" \
  -F "primary_author_email=invalid-'$TIMESTAMP'@example.com" \
  -F "primary_author_institution=Test Institution")

run_test "Invalid category validation" '"success":false' "$INV_ABS_RESPONSE"

echo ""
echo -e "${BLUE}📞 3. Testing Contacts API${NC}"
echo "=========================="

# Test 7: Contact submission
echo -e "${YELLOW}Testing contact submission...${NC}"
CONTACT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Peter Kimbugwe",
    "email": "peter-'$TIMESTAMP'@example.com",
    "phone": "+256701234570",
    "organization": "Health Ministry",
    "subject": "Partnership Inquiry",
    "message": "We are interested in partnering with your conference to promote health initiatives in Uganda.",
    "inquiry_type": "partnership"
  }')

run_test "Contact submission" '"success":true' "$CONTACT_RESPONSE"

# Test 8: Get contacts
echo -e "${YELLOW}Testing GET contacts...${NC}"
GET_CONTACT_RESPONSE=$(curl -s "$BASE_URL/api/contacts")
run_test "GET contacts" '"success":true' "$GET_CONTACT_RESPONSE"

echo ""
echo -e "${BLUE}🔐 4. Testing Field Validations${NC}"
echo "==============================="

# Test 9: Missing required fields (registration)
echo -e "${YELLOW}Testing missing required fields validation...${NC}"
MISSING_FIELDS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/registrations" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Incomplete",
    "email": "incomplete@example.com"
  }')

run_test "Missing required fields" '"success":false' "$MISSING_FIELDS_RESPONSE"

# Test 10: Invalid registration type
echo -e "${YELLOW}Testing invalid registration type...${NC}"
INVALID_TYPE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/registrations" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Invalid",
    "last_name": "Type",
    "email": "invalid-type-'$TIMESTAMP'@example.com",
    "phone": "+256701234567",
    "organization": "Test Org",
    "position": "Tester",
    "district": "Kampala",
    "registrationType": "invalid_type"
  }')

run_test "Invalid registration type" '"success":false' "$INVALID_TYPE_RESPONSE"

echo ""
echo -e "${BLUE}📊 5. Database Schema Validation${NC}"
echo "================================"

# Test 11-15: Test all registration types with pricing
echo -e "${YELLOW}Testing all registration types...${NC}"

for reg_type in "undergrad" "grad" "local" "intl" "online"; do
    TYPE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/registrations" \
      -H "Content-Type: application/json" \
      -d '{
        "first_name": "Test",
        "last_name": "'$reg_type'",
        "email": "'$reg_type'-'$TIMESTAMP'@example.com",
        "phone": "+256701234567",
        "organization": "Test University",
        "position": "Student",
        "district": "Kampala",
        "registrationType": "'$reg_type'"
      }')
    
    run_test "Registration type: $reg_type" '"success":true' "$TYPE_RESPONSE"
done

echo ""
echo "================================================="
echo -e "${GREEN}🏁 Test Results Summary${NC}"
echo "================================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 All tests passed! Your API is fully functional.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please check the error messages above.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Start your Next.js server: npm run dev"
echo "2. Test the frontend forms manually"
echo "3. Check your database for the test data"
echo "4. Run: SELECT * FROM registrations; to see test registrations"
echo "5. Run: SELECT * FROM abstracts; to see test abstracts"
echo "6. Run: SELECT * FROM contacts; to see test contacts"
