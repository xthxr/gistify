from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests as req
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

@app.route('/')
def home():
    return "DeepSeek Summarizer Backend Running"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        page = req.get(url, timeout=10)
        soup = BeautifulSoup(page.text, 'html.parser')
        text = soup.get_text()
    except Exception as e:
        return jsonify({"error": f"Failed to fetch webpage: {str(e)}"}), 400

    prompt = f"Summarize the following webpage content in short:\n\n{text[:4000]}"

    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful summarizer."},
            {"role": "user", "content": prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        summary = response.json()['choices'][0]['message']['content']
        return jsonify({"summary": summary})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
