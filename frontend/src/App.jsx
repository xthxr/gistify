import { useState } from 'react';
import Summarizer from './components/Summarizer';
import Result from './components/Result';
import './styles.css';

function App() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async (url) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://your-render-backend-url/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize');
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Webpage Summarizer</h1>
      <Summarizer onSubmit={handleSummarize} />
      {loading && <p>Summarizing...</p>}
      {error && <p className="error">{error}</p>}
      {summary && <Result data={summary} />}
    </div>
  );
}

export default App;
