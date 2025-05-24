import { useEffect, useState } from 'react';
import StatsGraph from './StatsGraph';

const Result = ({ data }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!data.summary) return;

    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + data.summary[i]);
      i++;
      if (i >= data.summary.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [data.summary]);

  return (
    <div className="result-container">
      <h2>✨ Summarization Result</h2>

      {/* Animated summary typing */}
      <div className="summary-text" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {displayedText}
        <span className="blinking-cursor">|</span>
      </div>

      {/* Stats & Chart */}
      <StatsGraph
        originalLength={data.original_length}
        summaryLength={data.summary_length}
      />
    </div>
  );
};

export default Result;
