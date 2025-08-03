#!/bin/bash

# Test script for registration API integration
# Run this after setting up the database and starting the Next.js server

echo "🧪 Testing NTLP Conference Registration API Integration"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test data
TEST_EMAIL="test-$(date +%s)@example.com"
API_URL="http://localhost:3000/api/registrations"

echo -e "${YELLOW}📝 Testing registration form submission...${NC}"

# Test successful registration
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "'$TEST_EMAIL'",
    "phone": "+256701234567",
    "organization": "Test University",
    "position": "Research Fellow",
    "district": "Kampala",
    "registrationType": "local",
    "special_needs": "No special requirements"
  }')

# Check if the response contains success
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Registration submission: PASSED${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}❌ Registration submission: FAILED${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo -e "${YELLOW}📊 Testing GET endpoint...${NC}"

# Test GET endpoint
GET_RESPONSE=$(curl -s "$API_URL")

if echo "$GET_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ GET registrations: PASSED${NC}"
    echo "Found $(echo "$GET_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2) total registrations"
else
    echo -e "${RED}❌ GET registrations: FAILED${NC}"
    echo "Response: $GET_RESPONSE"
fi

echo ""
echo -e "${YELLOW}🔍 Testing duplicate email validation...${NC}"

# Test duplicate email
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "'$TEST_EMAIL'",
    "phone": "+256701234568",
    "organization": "Another University",
    "position": "Professor",
    "district": "Jinja",
    "registrationType": "grad"
  }')

if echo "$DUPLICATE_RESPONSE" | grep -q '"success":false' && echo "$DUPLICATE_RESPONSE" | grep -q "already registered"; then
    echo -e "${GREEN}✅ Duplicate email validation: PASSED${NC}"
else
    echo -e "${RED}❌ Duplicate email validation: FAILED${NC}"
    echo "Response: $DUPLICATE_RESPONSE"
fi

echo ""
echo -e "${YELLOW}❌ Testing missing fields validation...${NC}"

# Test missing required fields
MISSING_FIELDS_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "email": "incomplete@example.com"
  }')

if echo "$MISSING_FIELDS_RESPONSE" | grep -q '"success":false' && echo "$MISSING_FIELDS_RESPONSE" | grep -q "Missing required fields"; then
    echo -e "${GREEN}✅ Missing fields validation: PASSED${NC}"
else
    echo -e "${RED}❌ Missing fields validation: FAILED${NC}"
    echo "Response: $MISSING_FIELDS_RESPONSE"
fi

echo ""
echo -e "${YELLOW}🎫 Testing invalid registration type...${NC}"

# Test invalid registration type
INVALID_TYPE_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Invalid",
    "last_name": "Type",
    "email": "invalid-'$(date +%s)'@example.com",
    "phone": "+256701234567",
    "organization": "Test Org",
    "position": "Tester",
    "district": "Kampala",
    "registrationType": "invalid_type"
  }')

if echo "$INVALID_TYPE_RESPONSE" | grep -q '"success":false' && echo "$INVALID_TYPE_RESPONSE" | grep -q "Invalid registration type"; then
    echo -e "${GREEN}✅ Invalid registration type validation: PASSED${NC}"
else
    echo -e "${RED}❌ Invalid registration type validation: FAILED${NC}"
    echo "Response: $INVALID_TYPE_RESPONSE"
fi

echo ""
echo -e "${GREEN}🏁 API Integration Testing Complete!${NC}"
echo "=================================================="

# Instructions
echo ""
echo -e "${YELLOW}📋 Manual Testing Instructions:${NC}"
echo "1. Start your Next.js development server: npm run dev"
echo "2. Visit: http://localhost:3000/register"
echo "3. Fill out the registration form and submit"
echo "4. Check your database for the new registration entry"
echo "5. Visit: http://localhost:3000/admin to view registrations"
echo ""
echo -e "${YELLOW}💾 Database Query to Check Registration:${NC}"
echo "SELECT * FROM registrations WHERE email = '$TEST_EMAIL';"
