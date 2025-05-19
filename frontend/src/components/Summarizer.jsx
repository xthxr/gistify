import { useState } from 'react';

const Summarizer = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="summarizer-form">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter webpage URL"
        required
      />
      <button type="submit">Summarize</button>
    </form>
  );
};

export default Summarizer;
