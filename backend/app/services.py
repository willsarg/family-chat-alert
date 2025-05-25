def handle_text(data):
    # e.g., inspect data["message"], alert logic, DB save, etc.
    message = data.get("message", "")
    # ... do something ...
    return {"received": message}