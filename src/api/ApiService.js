/**
 * API Service
 * 
 * Provides methods for interacting with the Solana PayAI API.
 * Handles authentication, request formatting, and response parsing.
 */

import axios from 'axios';

class ApiService {
  constructor(baseUrl = 'https://api.solanapayai.com', apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add request interceptor for authentication
    this.api.interceptors.request.use(config => {
      if (this.apiKey) {
        config.headers.Authorization = `Bearer ${this.apiKey}`;
      }
      return config;
    });
    
    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        // Handle API errors
        const errorResponse = {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'An unknown error occurred',
          code: error.response?.data?.code || 'unknown_error',
          data: error.response?.data || null
        };
        
        console.error('API Error:', errorResponse);
        return Promise.reject(errorResponse);
      }
    );
  }

  /**
   * Set the API key
   * @param {string} apiKey - The API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Initiate a payment
   * @param {Object} paymentData - The payment data
   * @returns {Promise<Object>} - The payment response
   */
  async initiatePayment(paymentData) {
    try {
      const response = await this.api.post('/api/v1/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   * @param {string} paymentId - The payment ID
   * @returns {Promise<Object>} - The payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await this.api.get(`/api/v1/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * Get payment history
   * @param {Object} params - Query parameters (limit, offset, status)
   * @returns {Promise<Object>} - The payment history
   */
  async getPaymentHistory(params = {}) {
    try {
      const response = await this.api.get('/api/v1/payments', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  /**
   * Create a payout batch
   * @param {Object} batchData - The batch data
   * @returns {Promise<Object>} - The batch response
   */
  async createPayoutBatch(batchData) {
    try {
      const response = await this.api.post('/api/v1/payouts', batchData);
      return response.data;
    } catch (error) {
      console.error('Error creating payout batch:', error);
      throw error;
    }
  }

  /**
   * Get payout batch status
   * @param {string} batchId - The batch ID
   * @returns {Promise<Object>} - The batch status
   */
  async getPayoutBatchStatus(batchId) {
    try {
      const response = await this.api.get(`/api/v1/payouts/${batchId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payout batch status:', error);
      throw error;
    }
  }

  /**
   * Get payout batches
   * @param {Object} params - Query parameters (limit, offset, status)
   * @returns {Promise<Object>} - The payout batches
   */
  async getPayoutBatches(params = {}) {
    try {
      const response = await this.api.get('/api/v1/payouts', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting payout batches:', error);
      throw error;
    }
  }

  /**
   * Get user account information
   * @returns {Promise<Object>} - The user account information
   */
  async getUserAccount() {
    try {
      const response = await this.api.get('/api/v1/account');
      return response.data;
    } catch (error) {
      console.error('Error getting user account:', error);
      throw error;
    }
  }

  /**
   * Update user account information
   * @param {Object} accountData - The account data to update
   * @returns {Promise<Object>} - The updated account information
   */
  async updateUserAccount(accountData) {
    try {
      const response = await this.api.patch('/api/v1/account', accountData);
      return response.data;
    } catch (error) {
      console.error('Error updating user account:', error);
      throw error;
    }
  }

  /**
   * Generate a new API key
   * @returns {Promise<Object>} - The new API key
   */
  async generateApiKey() {
    try {
      const response = await this.api.post('/api/v1/account/api-keys');
      return response.data;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  }

  /**
   * Get fraud detection for a transaction
   * @param {Object} transactionData - The transaction data
   * @returns {Promise<Object>} - The fraud detection results
   */
  async getFraudDetection(transactionData) {
    try {
      const response = await this.api.post('/api/v1/ai/fraud-detection', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error getting fraud detection:', error);
      throw error;
    }
  }

  /**
   * Get fee optimization recommendations
   * @param {Object} transactionData - The transaction data
   * @returns {Promise<Object>} - The fee optimization results
   */
  async getFeeOptimization(transactionData) {
    try {
      const response = await this.api.post('/api/v1/ai/fee-optimization', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error getting fee optimization:', error);
      throw error;
    }
  }

  /**
   * Get analytics data
   * @param {Object} params - Query parameters (timeframe, metrics)
   * @returns {Promise<Object>} - The analytics data
   */
  async getAnalytics(params = {}) {
    try {
      const response = await this.api.get('/api/v1/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
}

export default ApiService;

