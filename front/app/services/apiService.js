// services/apiService.js
import { API_CONFIG, getApiUrl } from '../lib/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Méthodes spécifiques
  async predict(data) {
    return this.request(API_CONFIG.ENDPOINTS.PREDICT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStats() {
    return this.request(API_CONFIG.ENDPOINTS.STATS);
  }

  async getConfusionMatrices() {
    return this.request(API_CONFIG.ENDPOINTS.MATRICES_CONFUSION);
  }

  async getDataDistribution() {
    return this.request(API_CONFIG.ENDPOINTS.DATA_DISTRIBUTION);
  }

  async getDataQuality() {
    return this.request(API_CONFIG.ENDPOINTS.DATA_QUALITY);
  }

  async getDoublons() {
    return this.request(API_CONFIG.ENDPOINTS.DOUBLONS);
  }

  async getValeursAberrantes() {
    return this.request(API_CONFIG.ENDPOINTS.VALEURS_ABERRANTES);
  }

  async getValeursManquantes() {
    return this.request(API_CONFIG.ENDPOINTS.VALEURS_MANQUANTES);
  }

  async getNormalisationStats() {
    return this.request(API_CONFIG.ENDPOINTS.NORMALISATION_STATS);
  }

  async getValeursAberrantesComparaison() {
    return this.request(API_CONFIG.ENDPOINTS.VALEURS_ABERRANTES_COMPARAISON);
  }

  async healthCheck() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }
}

export const apiService = new ApiService();