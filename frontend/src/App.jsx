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
      
      console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL); // Log the backend URL t
      // Use the environment variable for the backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL; // Provide a fallback for safety
      
      const response = await fetch(`${backendUrl}/summarize`, {
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
      console.log('Received data:', data); // Add this line
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
