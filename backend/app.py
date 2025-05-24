import os
from pathlib import Path
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import httpx
from flask_cors import CORS # Import CORS
# import requests # We will remove requests as we are using httpx for both
import asyncio # Import asyncio for sleep

# Import pathlib to construct the path
from pathlib import Path

# Define the path to the .env file relative to the current script
# This assumes your .env file is in the same directory as app.py
env_path = Path('.') / '.env'

# Load environment variables from .env file, specifying the path
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app) # Enable CORS for all origins

# Environment variable for Gemini API key
# Ensure you set this in your backend/.env file, e.g., GEMINI_API_KEY='your_api_key_here'
dkey = os.getenv("GEMINI_API_KEY")

@app.route('/summarize', methods=['POST'])
async def summarize(): # Make the route function async
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL not provided'}), 400

    content = ''
    attempts = 0
    max_attempts = 15
    delay = 2 # seconds

    while attempts < max_attempts:
        attempts += 1
        print(f"Attempt {attempts} to fetch URL: {url}")
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=10)
                resp.raise_for_status() # Raise an exception for bad status codes (like 404, 500)

            print("Response:", resp.text)

            soup = BeautifulSoup(resp.text, 'html.parser')
            # Attempt to extract content - this is where the error might occur if structure is unexpected
            extracted_content = ''
            for tag in ['p', 'h1', 'h2', 'h3', 'article', 'div']:
                for element in soup.find_all(tag):
                    extracted_content += element.get_text() + '\n'

            # If content was successfully extracted, break the loop
            if extracted_content.strip(): # Check if extracted content is not empty
                 content = extracted_content
                 print(f"Successfully fetched content on attempt {attempts}.")
                 break
            else:
                 print(f"No relevant content found on attempt {attempts}. Retrying...")

        except httpx.RequestError as e:
            print(f"Attempt {attempts} failed: An error occurred while requesting {e.request.url!r}: {e}")
        except Exception as e:
            # Catch other potential errors, e.g., during BeautifulSoup parsing
            print(f"Attempt {attempts} failed: An unexpected error occurred during processing: {e}")

        # Wait before the next attempt, unless it's the last one
        if attempts < max_attempts:
            await asyncio.sleep(delay)

    if not content.strip():
         return jsonify({'error': f'Failed to fetch relevant content after {max_attempts} attempts.'}), 500

    try:
        # Calculate original content length before cleaning
        original_length = len(content)

        # Call the Gemini API with the extracted content
        content = content.strip() # remove leading blank next lines
        content = content.replace('\n', ' ') # replace new lines with spaces
        content = content.replace('\r', ' ') # replace carriage returns with spaces
        content = content.replace('\t', ' ') # replace tabs with spaces
        content = content.replace('  ', ' ') # replace double spaces with single spaces

        summary = await call_gemini_api(content) # Updated function call

        # Calculate summary length
        summary_length = len(summary)

        # Include original_length and summary_length in the response
        return jsonify({'summary': summary, 'original_length': original_length, 'summary_length': summary_length})

    except Exception as e:
        print(f"An unexpected error occurred during API call: {e}")
        return jsonify({'error': f'An unexpected error occurred during summarization: {e}'}), 500


async def call_gemini_api(content): # Renamed function

    # Gemini API endpoint URL
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    if not dkey:
        return "Error summarizing content: Gemini API key not configured."
    
    # Gemini API uses key in query parameters, not Authorization header
    # headers = {
    #     "Content-Type": "application/json"
    # }

    # Payload for Gemini API
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": content # Use the extracted content here
                    }
                ]
            }
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            # Pass API key as a query parameter
            response = await client.post(f"{api_url}?key={dkey}", json=payload, timeout=30) # Use await with httpx.post
            response.raise_for_status() # Raise an exception for bad status codes

        result = response.json()
        
        # Extract summary from Gemini API response structure
        summary = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No summary returned by API.')
        
        return summary

    except httpx.RequestError as e:
        # Catch specific httpx exceptions for better error handling
        return f"Error summarizing content: {str(e)}"
    except Exception as e:
        # Catch any other potential errors during JSON parsing or processing
        return f"Error summarizing content: An unexpected error occurred - {str(e)}"


if __name__ == '__main__':
    # In a production environment, you might use a production-ready server like Gunicorn
    # For local development, app.run() is fine.
    app.run(debug=True, host='0.0.0.0', port=5000)

