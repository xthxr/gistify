const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const summarizeUrl = async (url) => {
  const response = await fetch(`${BACKEND_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to summarize');
  }
  
  return await response.json();
};
