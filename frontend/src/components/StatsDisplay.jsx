npm install recharts
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const StatsDisplay = ({ originalWordCount, summaryWordCount }) => {
  const data = [
    {
      name: 'Original',
      Words: originalWordCount,
    },
    {
      name: 'Summary',
      Words: summaryWordCount,
    },
  ];

  const reductionPercentage = (
    ((originalWordCount - summaryWordCount) / originalWordCount) *
    100
  ).toFixed(2);

  const readingSpeed = 200; // words per minute
  const timeSaved = (
    (originalWordCount - summaryWordCount) /
    readingSpeed
  ).toFixed(2);

  return (
    <div>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Words" fill="#8884d8" />
      </BarChart>
      <p>Reduction Percentage: {reductionPercentage}%</p>
      <p>Estimated Time Saved: {timeSaved} minutes</p>
    </div>
  );
};

export default StatsDisplay;
