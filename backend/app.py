from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import os

app = Flask(__name__)

# Environment variable for Deepseek API key
DEESEEK_API_KEY = os.getenv("DEESEEK_API_KEY", "sk-666bb328bd094c619cd37c64044b7355")

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing URL in request'}), 400

    url = data['url']

    # Fetch the webpage content
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        return jsonify({'error': f'Failed to fetch URL content: {str(e)}'}), 400

    # Parse the webpage content with BeautifulSoup to extract text
    soup = BeautifulSoup(resp.text, 'html.parser')

    # Extract the main text content - simplistic approach
    texts = soup.find_all('p')
    content = ' '.join([p.get_text() for p in texts])

    if not content.strip():
        return jsonify({'error': 'Could not extract content from the webpage'}), 400

    # Call the Deepseek API to summarize the content (mocked example)
    summary = call_deepseek_api(content)

    return jsonify({'summary': summary})


def call_deepseek_api(content):
    """
    Sends the content to Deepseek API and retrieves the summary.
    This is a placeholder implementation and should be adapted to your actual API specs.
    """

    api_url = "https://api.deepseek.ai/summarize"  # Hypothetical endpoint

    headers = {
        "Authorization": f"Bearer {DEESEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "text": content,
        "length": "short"  # example parameter to control summary length
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=15)
        response.raise_for_status()

        result = response.json()
        # Assuming the API returns {"summary": "..."}
        return result.get('summary', 'No summary returned by API.')

    except Exception as e:
        # In case of error, return a fallback message
        return f"Error summarizing content: {str(e)}"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

