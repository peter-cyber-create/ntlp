#!/bin/bash

echo "🔍 Abstract Submission Debugging Script"
echo "========================================="

# Test 1: Check if abstract form page loads
echo "1. Testing abstract form page..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" http://localhost:3001/abstracts

# Test 2: Check API endpoint
echo "2. Testing API endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" http://localhost:3001/api/abstracts

# Test 3: Test with minimal valid data
echo "3. Testing minimal submission..."
RESPONSE=$(curl -s -X POST http://localhost:3001/api/abstracts/ \
  -F 'abstractData={"title":"Minimal Test","category":"Communicable Diseases","abstract":"Test abstract","keywords":"test","objectives":"Test","methodology":"Test","results":"Test","conclusions":"Test","implications":"Test","presentationType":"oral","primaryAuthor":{"firstName":"Test","lastName":"User","email":"minimal@test.com","phone":"+256700000001","affiliation":"Test Org","position":"Researcher","district":"Kampala"},"coAuthors":"","conflictOfInterest":false,"ethicalApproval":true,"consentToPublish":true}' \
  -F "abstractFile=@test_abstract.pdf")

echo "Response: $RESPONSE"

# Test 4: Check for common form validation issues
echo "4. Common form issues to check:"
echo "   - All required fields filled"
echo "   - Valid email format"
echo "   - File size under 2MB"
echo "   - Valid file type (PDF/Word)"
echo "   - No duplicate email address"
echo "   - JavaScript errors in browser console"

echo ""
echo "✅ Debugging complete. Check browser console for frontend errors."
