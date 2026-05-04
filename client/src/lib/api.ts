export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://ai-interview-prepration-2-nadp.onrender.com';
  }
  return 'https://ai-interview-prepration-2-nadp.onrender.com';
};
