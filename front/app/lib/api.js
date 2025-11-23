// lib/api.js
export const API_CONFIG = {
  BASE_URL: 'https://projet-ml-uxvm.onrender.com', //  BACKEND FLASK
  ENDPOINTS: {
    PREDICT: '/api/predict',
    STATS: '/api/analyse-metrics',
    HEALTH: '/api/hello',
    MATRICES_CONFUSION: '/api/matrices-confusion',
    DATA_DISTRIBUTION: '/api/data-distribution',
    DATA_QUALITY: '/api/data-quality',
    DOUBLONS: '/api/doublons',
    VALEURS_ABERRANTES: '/api/valeurs-aberrantes',
    VALEURS_MANQUANTES: '/api/valeurs-manquantes',
    NORMALISATION_STATS: '/api/statistiques-normalisation',
    VALEURS_ABERRANTES_COMPARAISON: '/api/valeurs-aberrantes-comparaison'
  }
};

export function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}