import ReactMarkdown from 'react-markdown';

const Result = ({ data }) => {
  return (
    <div className="result-container">
      <h2>Summarization Result</h2>
      {/* Use ReactMarkdown to render the summary with Markdown formatting */}
      <div className="summary-text">
        <ReactMarkdown>{data.summary}</ReactMarkdown>
      </div>
      <div className="stats">
        <p>Original length: {data.original_length} characters</p>
        <p>Summary length: {data.summary_length} characters</p>
        <p>Reduction: {Math.round((1 - data.summary_length/data.original_length)*100)}%</p>
      </div>
    </div>
  );
};

export default Result;

const styles = {
  resultContainer: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  summaryText: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  stats: {
    fontSize: '14px',
    color: '#999',
  }
}