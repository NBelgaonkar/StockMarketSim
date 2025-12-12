/**
 * API Client
 * 
 * This module provides a centralized API client for making requests to the backend.
 * Currently, all requests are mocked and resolve with simulated data.
 * 
 * Future Django Backend:
 * - Base URL: process.env.REACT_APP_API_URL or '/api'
 * - All endpoints follow REST conventions
 * - Authentication via JWT tokens stored in localStorage
 */

// Simulated network delay (ms)
const MOCK_DELAY = 300;

// Base API URL - for future Django integration
// const BASE_API_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Simulates an API request with configurable delay
 * @param {any} data - The data to resolve with
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} shouldFail - Whether the request should fail
 * @returns {Promise<any>}
 */
export const mockRequest = (data, delay = MOCK_DELAY, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('API request failed'));
      } else {
        resolve({ data, status: 200 });
      }
    }, delay);
  });
};

/**
 * API Client class for future real implementation
 * 
 * Future implementation will use:
 * - fetch() or axios for HTTP requests
 * - JWT tokens from localStorage for authentication
 * - Error handling and retry logic
 */
class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Future implementation for real API calls
   * Currently not used - all calls go through mock functions
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    // For future use with real backend
    // const response = await fetch(url, options);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return response.json();
    
    console.log(`[Mock API] ${method} ${url}`, data);
    return null;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

