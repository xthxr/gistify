import { useState } from 'react';

const Summarizer = ({ onSubmit }) => {
  const [inputType, setInputType] = useState('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [reduction, setReduction] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare payload based on input type
    if (inputType === 'url' && url.trim()) {
      onSubmit({ inputType, url, reduction });
    } else if (inputType === 'text' && text.trim()) {
      onSubmit({ inputType, text, reduction });
    } else if (inputType === 'pdf' && pdfFile) {
      onSubmit({ inputType, pdfFile, reduction });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="summarizer-form" style={{ flexDirection: 'column', gap: 16 }}>
      <label>
        <b>Input Type:</b>
        <select value={inputType} onChange={e => setInputType(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="url">Webpage URL</option>
          <option value="text">Plain Text</option>
          <option value="pdf">PDF File</option>
        </select>
      </label>

      {inputType === 'url' && (
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter webpage URL"
          required
        />
      )}

      {inputType === 'text' && (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your text here"
          rows={6}
          required
        />
      )}

      {inputType === 'pdf' && (
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setPdfFile(e.target.files[0])}
          required
        />
      )}

      <label>
        <b>Reduction Percent:</b> {reduction}%
        <input
          type="range"
          min={10}
          max={100}
          value={reduction}
          onChange={e => setReduction(Number(e.target.value))}
          style={{ marginLeft: 8, width: 200 }}
        />
      </label>

      <button type="submit">Summarize</button>
    </form>
  );
};

export default Summarizer;
