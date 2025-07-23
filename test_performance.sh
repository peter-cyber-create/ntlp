#!/bin/bash

# Performance test for abstract submission
echo "🚀 Testing Abstract Submission Performance..."

# Test 1: Basic API Response Time
echo "📊 Testing API response time..."
time curl -s -o /dev/null -w "Connect: %{time_connect}s\nTime to first byte: %{time_starttransfer}s\nTotal time: %{time_total}s\n" http://localhost:3000/api/abstracts/ -X GET

echo ""

# Test 2: Full submission test
echo "📝 Testing full abstract submission..."
./test_submission.sh | grep -E "(time_|success|message)"

echo ""

# Test 3: Database connection test
echo "💾 Testing database connection speed..."
time curl -s http://localhost:3000/api/database/test | jq '.connectionTime // "N/A"'

echo ""
echo "✅ Performance testing complete!"
echo ""
echo "🔧 Performance Optimization Tips:"
echo "1. Database connections are pooled for efficiency"
echo "2. File operations run in parallel with database queries"
echo "3. Form submissions use optimized fetch with timeout"
echo "4. Loading states provide user feedback"
echo "5. Admin dashboard loads data in parallel"
