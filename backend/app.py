import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import httpx
from flask_cors import CORS
import asyncio
import PyPDF2
from io import BytesIO

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

dkey = os.getenv("GEMINI_API_KEY")

@app.route('/summarize', methods=['POST'])
async def summarize():
    # Check for PDF file upload
    if 'pdf' in request.files:
        pdf_file = request.files['pdf']
        reduction = int(request.form.get('reduction', 60))
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        content = text
    else:
        data = request.get_json()
        reduction = int(data.get('reduction', 60))
        if data.get('text'):
            content = data['text']
        elif data.get('url'):
            url = data['url']
            # Fetch and extract webpage content
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=10)
                resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            content = '\n'.join([el.get_text() for tag in ['p', 'h1', 'h2', 'h3', 'article', 'div'] for el in soup.find_all(tag)])
        else:
            return jsonify({'error': 'No valid input provided'}), 400

    if not content.strip():
        return jsonify({'error': 'No content to summarize'}), 400

    original_length = len(content)
    summary = await call_gemini_api(content, reduction)
    summary_length = len(summary)
    return jsonify({
        'summary': summary,
        'original_length': original_length,
        'summary_length': summary_length
    })


async def call_gemini_api(content, reduction):
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    if not dkey:
        return "Error summarizing content: Gemini API key not configured."

    prompt = (
        f"Summarize this content to approximately {reduction}% of its original length, "
        "focusing on the most important and relevant information:\n\n"
        f"{content}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{api_url}?key={dkey}", json=payload, timeout=30)
        response.raise_for_status()
    result = response.json()
    summary = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No summary returned by API.')
    return summary

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)
