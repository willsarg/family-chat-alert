from flask import Blueprint, request, jsonify
from .services import handle_text

bp = Blueprint("api", __name__)

@bp.route("/receiveText", methods=["POST"])
def receive_text():
    data = request.get_json() or {}
    result = handle_text(data)
    return jsonify({"status": "ok", "result": result}), 200