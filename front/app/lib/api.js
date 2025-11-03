// config/api.js
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    PREDICT: '/predict',
    STATS: '/model-stats',
    HEALTH: '/'
  }
};