def handle_text(data):
    # e.g., inspect data["message"], alert logic, DB save, etc.
    message = data.get("message", "")
    return {"received": message}

"""
{
  "number": "1234567890",
  "risk_level": "low",
  "flagged": false,
  "flag_label": "scam",
  "messages": [
    {
      "message": "Hello, how are you?",
      "timestamp": "2021-01-01T00:00:00Z"
    },
    {
      "message": "I'm good, thank you!",
      "timestamp": "2021-01-01T00:01:00Z"
    }
  ]
}
"""