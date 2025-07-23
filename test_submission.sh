#!/bin/bash

# Create test data in the format expected by the API
TEST_DATA='{
  "title": "Test Abstract Submission",
  "category": "Communicable Diseases",
  "abstract": "This is a test abstract for submission validation and debugging purposes.",
  "keywords": "test, abstract, validation",
  "objectives": "To test the abstract submission functionality",
  "methodology": "Using curl to simulate form submission",
  "results": "Should receive successful submission response",
  "conclusions": "API submission works correctly",
  "implications": "Users can successfully submit abstracts",
  "presentationType": "oral",
  "primaryAuthor": {
    "firstName": "John",
    "lastName": "Doe", 
    "email": "test@example.com",
    "phone": "+256123456789",
    "affiliation": "Test University",
    "position": "Researcher",
    "district": "Kampala"
  },
  "coAuthors": "Jane Smith, Bob Johnson",
  "conflictOfInterest": false,
  "ethicalApproval": true,
  "consentToPublish": true
}'

curl -X POST http://localhost:3000/api/abstracts/ \
  -F "abstractData=$TEST_DATA" \
  -F "abstractFile=@test_abstract.pdf" \
  -v
