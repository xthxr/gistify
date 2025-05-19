// File: frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + '/summarize',
        { url }
      );
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>DeepSeek Webpage Summarizer</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && <p className="summary">{summary}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
