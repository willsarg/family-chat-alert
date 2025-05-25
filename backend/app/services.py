from typing import Dict, Any
from groq import Groq
import os

# === CONFIG ===
MODEL = "llama3-70b-8192"
client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))  # Get API key from environment variable

def groq_predict_label(text: str) -> str:
    """Classify a message using the Groq LLM."""
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

def handle_text(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Accepts a JSON dict, classifies messages, updates flag_label, flagged, and risk_level.
    Returns the updated dict in original format.
    """
    # Combine all messages into one string
    combined_text = " ".join(msg.get("message", "") for msg in data.get("messages", []))

    # Predict label
    predicted_label = groq_predict_label(combined_text)
    data["flag_label"] = predicted_label

    # Update flagged and risk_level based on label
    if predicted_label == "smishing":
        data["flagged"] = True
        data["risk_level"] = "high"
    elif predicted_label == "spam":
        data["flagged"] = True
        data["risk_level"] = "medium"
    elif predicted_label == "ham":
        data["flagged"] = False
        data["risk_level"] = "low"
    else:
        data["flagged"] = True
        data["risk_level"] = "medium"

    return data