import ReactMarkdown from 'react-markdown';
import { useRef, useState } from 'react';

const Result = ({ data }) => {
  const utteranceRef = useRef(null);
  const [readingAloud, setReadingAloud] = useState(false);

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([data.summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const readAloud = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = new window.SpeechSynthesisUtterance(data.summary);
    window.speechSynthesis.speak(utteranceRef.current);
    setReadingAloud(true);
  };

  const stopDictation = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setReadingAloud(false);
  };

  return (
    <div className="result-container">
      <h2>Summarization Result</h2>
      <div className="summary-text">
        <ReactMarkdown>{data.summary}</ReactMarkdown>
      </div>
      <div className="stats">
        <p>Original length: {data.original_length} characters</p>
        <p>Summary length: {data.summary_length} characters</p>
        <p>Reduction: {Math.round((1 - data.summary_length / data.original_length) * 100)}%</p>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
        <button onClick={downloadSummary}>Download Summary</button>
        <button onClick={readingAloud ? stopDictation : readAloud}>
          {readingAloud ? '🔇 Stop Dictation' : '🔉 Read Aloud'}
        </button>
      </div>
    </div>
  );
};

export default Result;
