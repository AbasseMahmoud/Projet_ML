// lib/api.js (ou config/api.js)
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://projet-ml-uxvm.onrender.com',
  ENDPOINTS: {
    PREDICT: '/predict',
    STATS: '/model-stats',
    HEALTH: '/',
    MATRICES_CONFUSION: '/matrices-confusion',
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};