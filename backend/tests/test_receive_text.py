from run import app
import json

def test_receive_text():
    client = app.test_client()
    resp = client.post("/api/receiveText",
                       data=json.dumps({"message": "hello"}),
                       content_type="application/json")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["result"]["received"] == "hello"