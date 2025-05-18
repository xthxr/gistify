from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "DeepSeek summarizer backend is live!"}

@app.post("/summarize")
async def summarize_url(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        return {"error": "URL is required"}

    try:
        # Fetch webpage content
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        paragraphs = soup.find_all("p")
        content = ' '.join(p.get_text() for p in paragraphs)
        
        # Optional: Limit content length (API dependent)
        content = content[:5000]

        # Prepare request to DeepSeek API
        api_url = "https://api.deepseek.com/chat/completions"  # Replace with official endpoint if different
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "url": url,
            "task": "summarize",   # Adjust if DeepSeek uses another param for summary
            "text": content       # If DeepSeek supports sending raw text (else remove)
        }

        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()

        # Extract summary from response (check DeepSeek docs)
        summary = result.get("summary") or "No summary returned from DeepSeek."

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
