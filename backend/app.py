from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from deepseek_api import DeepSeekAI  # Assuming you have API access

app = Flask(__name__)

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        url = data['url']
        
        # Fetch webpage content
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract main text content
        text = ' '.join([p.get_text() for p in soup.find_all('p')])
        
        if not text:
            return jsonify({'error': 'No text content found'}), 400
            
        # Summarize using DeepSeek API
        deepseek = DeepSeekAI(api_key='YOUR_DEEPSEEK_API_KEY')
        summary = deepseek.summarize(
            text=text,
            max_length=200,
            temperature=0.7
        )
        
        return jsonify({
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
