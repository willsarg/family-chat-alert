from flask import Blueprint, request, jsonify
from .services import handle_text
import json

bp = Blueprint("api", __name__)

#
@bp.route("/receiveText", methods=["POST"])
def receive_text():
    data = request.get_json() or {}
    result = handle_text(data)
    return jsonify(result), 200


# Example JSON payload
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