from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Web summarizer is running!"}

@app.post("/summarize")
async def summarize_url(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        return {"error": "URL is required"}

    try:
        # Fetch and parse content
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        paragraphs = soup.find_all("p")
        content = ' '.join(p.get_text() for p in paragraphs)[:4000]  # GPT limit

        # Summarize using GPT
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Summarize the content of the webpage in 5 bullet points."},
                {"role": "user", "content": content}
            ]
        )

        summary = response.choices[0].message.content.strip()
        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
