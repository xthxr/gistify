import { useState } from 'react';
import Summarizer from './components/Summarizer';
import Result from './components/Result';
import './styles.css';

function App() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      setSummary(null);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      let response;

      if (payload.inputType === 'pdf') {
        const formData = new FormData();
        formData.append('pdf', payload.pdfFile);
        formData.append('reduction', payload.reduction);

        response = await fetch(`${backendUrl}/summarize`, {
          method: 'POST',
          body: formData,
        });
      } else {
        const body =
          payload.inputType === 'url'
            ? { url: payload.url, reduction: payload.reduction }
            : { text: payload.text, reduction: payload.reduction };

        response = await fetch(`${backendUrl}/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to summarize');
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
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
