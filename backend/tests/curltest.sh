

#!/bin/bash

# Simple curl test for /api/receiveText
curl -X POST http://localhost:5000/api/receiveText \
  -H "Content-Type: application/json" \
  -d '{
    "number": "1234567890",
    "risk_level": "low",
    "flagged": false,
    "flag_label": "scam",
    "messages": [
      {"message": "Hello, how are you?", "timestamp": "2021-01-01T00:00:00Z"},
      {"message": "I'\''m good, thank you!", "timestamp": "2021-01-01T00:01:00Z"}
    ]
  }'