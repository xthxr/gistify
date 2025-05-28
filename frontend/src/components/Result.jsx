import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const getLinesWithKeywords = (text, keywords) => {
  if (!keywords || keywords.length === 0) return text.split('\n').map(line => ({ text: line, highlight: false }));
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
  return text.split('\n').map(line => ({
    text: line,
    highlight: regex.test(line),
  }));
};

const themeStyles = {
  light: {
    background: '#fff',
    color: '#222'
  },
  dark: {
    background: '#222',
    color: '#f0f0f0'
  }
};

const warmthStyles = {
  neutral: {},
  warm: { filter: 'sepia(0.3) brightness(1.07)' },
  cool: { filter: 'hue-rotate(210deg) brightness(0.96)' }
};

const Result = ({ data }) => {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [warmth, setWarmth] = useState('neutral');

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

  // New: Highlight lines with keywords
  const lines = getLinesWithKeywords(data.summary, data.keywords);

  // Theme & warmth
  const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const handleWarmthChange = (e) => setWarmth(e.target.value);

  return (
    <div
      className={`result-container ${theme} ${warmth}`}
      style={{
        ...themeStyles[theme],
        ...warmthStyles[warmth],
        transition: 'all 0.3s'
      }}
    >
      <h2>Summarization Result</h2>

      {/* Theme & Warmth Controls */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
        <button onClick={handleThemeToggle}>
          {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
        <label>
          Warmth:&nbsp;
          <select value={warmth} onChange={handleWarmthChange}>
            <option value="neutral">Neutral</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
          </select>
        </label>
      </div>

      <div className="summary-text">
        {lines.map((line, idx) =>
          line.highlight ? (
            <div key={idx} className="highlight-line">
              <ReactMarkdown>{line.text}</ReactMarkdown>
            </div>
          ) : (
            <div key={idx}>
              <ReactMarkdown>{line.text}</ReactMarkdown>
            </div>
          )
        )}
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
