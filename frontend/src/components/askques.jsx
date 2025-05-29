import React, { useState } from 'react';

const AskQuestion = ({ summary }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('https://gistify-snowy.vercel.app/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary, question }),
      });

      const data = await res.json();
      setAnswer(data.answer || 'No answer received.');
    } catch (err) {
      console.error(err);
      setAnswer('❌ Failed to fetch answer.');
    }

    setLoading(false);
  };

  return (
    <div className="ask-question-container" style={{ marginTop: '2rem' }}>
      <h3>Ask a Question About the Summary</h3>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        style={{ width: '100%', padding: '10px', marginTop: '8px' }}
      />
      <button
        onClick={handleAsk}
        style={{ padding: '8px 16px', marginTop: '10px' }}
      >
        Ask
      </button>
      {loading ? (
        <p style={{ marginTop: '10px' }}>Thinking...</p>
      ) : (
        answer && <p style={{ marginTop: '10px' }}><strong>Answer:</strong> {answer}</p>
      )}
    </div>
  );
};

export default AskQuestion;
