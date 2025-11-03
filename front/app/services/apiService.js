// services/apiService.js
import { API_CONFIG } from '../lib/api';

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

  async healthCheck() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }

   async getConfusionMatrices() {
     return this.request(API_CONFIG.ENDPOINTS.MATRICES_CONFUSION);
}
}

 
export const apiService = new ApiService();