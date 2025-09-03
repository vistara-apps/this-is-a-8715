/**
 * Custom hook for API interactions
 * 
 * Provides methods for interacting with the Solana PayAI API.
 * Handles authentication, request formatting, and response parsing.
 */

import { useState, useEffect, useCallback } from 'react';
import ApiService from '../api/ApiService';
import { useAuth } from '../context/AuthContext';

const useApi = (baseUrl = 'https://api.solanapayai.com') => {
  const { user } = useAuth();
  const [apiService, setApiService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize API service
  useEffect(() => {
    const service = new ApiService(baseUrl, user?.apiKey);
    setApiService(service);
  }, [baseUrl, user]);

  // Update API key when user changes
  useEffect(() => {
    if (apiService && user?.apiKey) {
      apiService.setApiKey(user.apiKey);
    }
  }, [apiService, user]);

  /**
   * Initiate a payment
   * @param {Object} paymentData - The payment data
   * @returns {Promise<Object>} - The payment response
   */
  const initiatePayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.initiatePayment(paymentData);
      return response;
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'Failed to initiate payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get payment status
   * @param {string} paymentId - The payment ID
   * @returns {Promise<Object>} - The payment status
   */
  const getPaymentStatus = useCallback(async (paymentId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getPaymentStatus(paymentId);
      return response;
    } catch (err) {
      console.error('Error getting payment status:', err);
      setError(err.message || 'Failed to get payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get payment history
   * @param {Object} params - Query parameters (limit, offset, status)
   * @returns {Promise<Object>} - The payment history
   */
  const getPaymentHistory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getPaymentHistory(params);
      return response;
    } catch (err) {
      console.error('Error getting payment history:', err);
      setError(err.message || 'Failed to get payment history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Create a payout batch
   * @param {Object} batchData - The batch data
   * @returns {Promise<Object>} - The batch response
   */
  const createPayoutBatch = useCallback(async (batchData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.createPayoutBatch(batchData);
      return response;
    } catch (err) {
      console.error('Error creating payout batch:', err);
      setError(err.message || 'Failed to create payout batch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get payout batch status
   * @param {string} batchId - The batch ID
   * @returns {Promise<Object>} - The batch status
   */
  const getPayoutBatchStatus = useCallback(async (batchId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getPayoutBatchStatus(batchId);
      return response;
    } catch (err) {
      console.error('Error getting payout batch status:', err);
      setError(err.message || 'Failed to get payout batch status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get payout batches
   * @param {Object} params - Query parameters (limit, offset, status)
   * @returns {Promise<Object>} - The payout batches
   */
  const getPayoutBatches = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getPayoutBatches(params);
      return response;
    } catch (err) {
      console.error('Error getting payout batches:', err);
      setError(err.message || 'Failed to get payout batches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get user account information
   * @returns {Promise<Object>} - The user account information
   */
  const getUserAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getUserAccount();
      return response;
    } catch (err) {
      console.error('Error getting user account:', err);
      setError(err.message || 'Failed to get user account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Update user account information
   * @param {Object} accountData - The account data to update
   * @returns {Promise<Object>} - The updated account information
   */
  const updateUserAccount = useCallback(async (accountData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.updateUserAccount(accountData);
      return response;
    } catch (err) {
      console.error('Error updating user account:', err);
      setError(err.message || 'Failed to update user account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Generate a new API key
   * @returns {Promise<Object>} - The new API key
   */
  const generateApiKey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.generateApiKey();
      return response;
    } catch (err) {
      console.error('Error generating API key:', err);
      setError(err.message || 'Failed to generate API key');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get fraud detection for a transaction
   * @param {Object} transactionData - The transaction data
   * @returns {Promise<Object>} - The fraud detection results
   */
  const getFraudDetection = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getFraudDetection(transactionData);
      return response;
    } catch (err) {
      console.error('Error getting fraud detection:', err);
      setError(err.message || 'Failed to get fraud detection');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get fee optimization recommendations
   * @param {Object} transactionData - The transaction data
   * @returns {Promise<Object>} - The fee optimization results
   */
  const getFeeOptimization = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getFeeOptimization(transactionData);
      return response;
    } catch (err) {
      console.error('Error getting fee optimization:', err);
      setError(err.message || 'Failed to get fee optimization');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  /**
   * Get analytics data
   * @param {Object} params - Query parameters (timeframe, metrics)
   * @returns {Promise<Object>} - The analytics data
   */
  const getAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!apiService) {
        throw new Error('API service not initialized');
      }
      
      const response = await apiService.getAnalytics(params);
      return response;
    } catch (err) {
      console.error('Error getting analytics:', err);
      setError(err.message || 'Failed to get analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  return {
    loading,
    error,
    initiatePayment,
    getPaymentStatus,
    getPaymentHistory,
    createPayoutBatch,
    getPayoutBatchStatus,
    getPayoutBatches,
    getUserAccount,
    updateUserAccount,
    generateApiKey,
    getFraudDetection,
    getFeeOptimization,
    getAnalytics
  };
};

export default useApi;

