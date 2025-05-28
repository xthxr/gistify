import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Result = ({ data }) => {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([data.summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleReadAloud = () => {
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      utteranceRef.current = new SpeechSynthesisUtterance(data.summary);
      const voices = synth.getVoices();
      utteranceRef.current.voice = voices.find(v => v.lang === 'en-US') || voices[0];

      utteranceRef.current.onend = () => setIsSpeaking(false);
      utteranceRef.current.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      synth.speak(utteranceRef.current);
    }
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
        <button onClick={toggleReadAloud}>
          {isSpeaking ? '🛑 Stop Reading' : '🔊 Read Aloud'}
        </button>
      </div>
    </div>
  );
};

export default Result;
