import os
import json
from groq import Groq
from tqdm import tqdm
from typing import Union

# === CONFIG ===
MODEL = "llama3-70b-8192"
client = Groq(api_key="")

def groq_predict_label(text):
    """Classify text as ham, spam, or smishing using Groq."""
    prompt = f"""
    Given the following message, classify it as one of: spam, ham, or Smishing.
    Return only the label, nothing else.

    Message: {text}
    """
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL
    )
    label = response.choices[0].message.content.strip().lower()
    if "smishing" in label:
        return "smishing"
    elif "spam" in label:
        return "spam"
    elif "ham" in label:
        return "ham"
    else:
        return "spam"

def process_json(data: dict, source: str = "input"):
    """Process a single JSON object, update flag_label if flagged is True."""
    if not data.get("flagged", False):
        print(f"\n🟡 {source}: flagged = false, skipping")
        print(json.dumps(data, indent=2))
        return

    combined_message = " ".join(m.get("message", "") for m in data.get("messages", []))
    predicted_label = groq_predict_label(combined_message)

    original_label = data.get("flag_label", "")
    data["flag_label"] = predicted_label

    print(f"\n📄 {source}")
    print(f"🟡 Original label: {original_label} → 🟢 New label: {predicted_label}")
    print(json.dumps(data, indent=2))

def main(input: Union[str, dict]):
    """Main entry: process either a JSON string or a directory path."""
    if isinstance(input, dict):
        process_json(input, source="JSON object")
    elif os.path.isdir(input):
        print(f"📂 Processing directory: {input}")
        for filename in tqdm(os.listdir(input)):
            if filename.endswith(".json"):
                path = os.path.join(input, filename)
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                process_json(data, source=filename)
    else:
        try:
            data = json.loads(input)
            process_json(data, source="JSON string")
        except json.JSONDecodeError:
            print("❌ Invalid input. Provide a valid JSON string or directory path.")

# === Example usage:
main(r"C:\Users\domin\OneDrive\Documents\Elderly_Hackathon\family-chat-alert\Json")
# or:
# main('{ "flagged": true, "flag_label": "scam", "messages": [ {"message": "You won a prize!"} ] }')
