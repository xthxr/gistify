const Result = ({ data }) => {
  return (
    <div className="result-container">
      <h2>Summary</h2>
      <p className="summary-text">{data.summary}</p>
      <div className="stats">
        <p>Original length: {data.original_length} characters</p>
        <p>Summary length: {data.summary_length} characters</p>
        <p>Reduction: {Math.round((1 - data.summary_length/data.original_length)*100)}%</p>
      </div>
    </div>
  );
};

export default Result;
