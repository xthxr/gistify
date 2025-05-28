# Gistify

Gistify is a modern web application that lets you instantly summarize content from any webpage, PDF, or pasted text using the Gemini API. It not only provides concise summaries but also highlights the most important lines, offers screen reading, and gives you full control over the summary panel's appearance with warmth and light/dark modes.

---

## ✨ Features

- **One-Click Summarization**  
  Input a URL, paste text, or upload a PDF. Get a clear, concise summary in seconds.

- **Important Line Highlighting**  
  Gistify automatically detects and highlights key lines in your summary with a yellow strip for quick insight.

- **Screen Reading Mode**  
  Listen to your summary with a built-in read-aloud feature—great for accessibility and multitasking.

- **Warmth & Theme Control**  
  Adjust the summary panel’s warmth (cool/neutral/warm) and toggle between light and dark modes to match your reading comfort.

- **Download & Stats**  
  Download summaries as text files and view original vs. summary length and reduction stats.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/xthxr/gistify.git
cd gistify
```

### 2. Backend Setup

- Ensure you have Python 3.7+.
- Install dependencies:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
- Create a `.env` file with your Gemini API key:
  ```
  GEMINI_API_KEY=your_gemini_api_key
  ```
- Start the backend server:
  ```bash
  python app.py
  ```

### 3. Frontend Setup

- Ensure you have Node.js LTS.
- Install frontend dependencies:
  ```bash
  cd ../frontend
  npm install
  ```
- Create `.env` in `frontend/`:
  ```
  VITE_BACKEND_URL=http://localhost:5000
  ```
- Start the frontend:
  ```bash
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🖥️ Usage

1. Enter a URL, paste text, or upload a PDF.
2. Set your desired summary reduction.
3. Click **Summarize**.
4. View your summary, highlighted lines, and stats.
5. Use theme/warmth controls and screen reading as needed.
6. Download your summary if you wish!

---

## 🛠️ Project Structure

```
gistify/
  backend/    # Flask backend (Python) - summarization API
  frontend/   # React frontend (Vite) - user interface
```

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork this repo.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

Check the [issues](https://github.com/xthxr/gistify/issues) for things to work on or suggest your own ideas.

---

## 👤 Contributors

- [rajeet-04](https://github.com/rajeet-04)
- [xthxr](https://github.com/xthxr)
- [iankitsinghak](https://github.com/iankitsinghak)

---

## 📄 License

MIT License

---

> Made with ❤️ using Flask, React, and the Gemini API.
