export const summarizeUrl = async (url) => {
  const response = await fetch('https://your-render-backend-url/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to summarize');
  }
  
  return await response.json();
};
