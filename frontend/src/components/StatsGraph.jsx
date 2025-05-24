import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StatsGraph = ({ originalLength, summaryLength }) => {
  const reductionPercentage = Math.round(
    (1 - summaryLength / originalLength) * 100
  );

  const readingSpeed = 200; // words per minute
  const wordsOriginal = originalLength / 5;
  const wordsSummary = summaryLength / 5;
  const timeSaved = ((wordsOriginal - wordsSummary) / readingSpeed).toFixed(2);

  const chartData = [
    {
      name: 'Original',
      Words: wordsOriginal,
    },
    {
      name: 'Summary',
      Words: wordsSummary,
    },
  ];

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Words" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 20 }}>
        <p>📄 Original Length: {originalLength} characters</p>
        <p>✂️ Summary Length: {summaryLength} characters</p>
        <p>🔻 Reduction: {reductionPercentage}%</p>
        <p>🕒 Estimated Time Saved: {timeSaved} minutes</p>
      </div>
    </div>
  );
};

export default StatsGraph;
