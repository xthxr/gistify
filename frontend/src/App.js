import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSummary("");
    setError("");
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setError("Failed to fetch summary");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>DeepSeek Webpage Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter webpage URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
          required
        />
        <button
          type="submit"
          style={{
            marginTop: 10,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {summary && (
        <div
          style={{
            marginTop: 20,
            whiteSpace: "pre-wrap",
            backgroundColor: "#f0f0f0",
            padding: 15,
            borderRadius: 5,
          }}
        >
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
