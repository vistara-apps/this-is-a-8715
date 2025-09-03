/**
 * Payment Context
 * 
 * Provides payment state and methods for the application.
 * Handles payment creation, status checking, and history.
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import Transaction from '../models/Transaction';
import { useAuth } from './AuthContext';
import ApiService from '../api/ApiService';

// Create context
const PaymentContext = createContext();

// Custom hook for using the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

// Payment provider component
export const PaymentProvider = ({ children }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize API service
  const apiService = new ApiService();
  if (user?.apiKey) {
    apiService.setApiKey(user.apiKey);
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - The payment data
   * @returns {Promise<Transaction>} - The created payment
   */
  const createPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to create the payment
      // For demo purposes, we'll create a mock transaction
      const mockTransaction = new Transaction({
        userId: user?.userId,
        senderAddress: user?.walletAddress,
        recipientAddress: paymentData.recipient,
        amount: paymentData.amount,
        token: paymentData.token || 'SOL',
        memo: paymentData.memo || '',
        timestamp: new Date().toISOString(),
        status: 'pending',
        fraudScore: Math.random() * 0.3, // Random low fraud score for demo
        estimatedFee: (parseFloat(paymentData.amount) * 0.0001).toFixed(6)
      });
      
      // Add to payments state
      setPayments(prevPayments => [mockTransaction, ...prevPayments]);
      
      return mockTransaction;
    } catch (err) {
      console.error('Payment creation error:', err);
      setError(err.message || 'Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Get payment status
   * @param {string} paymentId - The payment ID
   * @returns {Promise<Transaction>} - The payment with updated status
   */
  const getPaymentStatus = useCallback(async (paymentId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the payment in state
      const payment = payments.find(p => p.transactionId === paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // In a real app, this would make an API call to get the status
      // For demo purposes, we'll simulate a status update
      const updatedPayment = { ...payment };
      
      // Simulate status progression
      if (payment.status === 'pending') {
        updatedPayment.status = 'processing';
        updatedPayment.signature = '5J7KL8M9...P2Q3R4S5';
      } else if (payment.status === 'processing') {
        updatedPayment.status = 'completed';
        updatedPayment.confirmations = 32;
        updatedPayment.blockHeight = 123456789;
        updatedPayment.completedAt = new Date().toISOString();
        updatedPayment.actualFee = (parseFloat(payment.estimatedFee) * 0.8).toFixed(6);
        updatedPayment.feeOptimization = '20.00';
      }
      
      // Update payments state
      setPayments(prevPayments => 
        prevPayments.map(p => 
          p.transactionId === paymentId ? new Transaction(updatedPayment) : p
        )
      );
      
      return new Transaction(updatedPayment);
    } catch (err) {
      console.error('Payment status error:', err);
      setError(err.message || 'Failed to get payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payments]);

  /**
   * Get payment history
   * @param {Object} filters - Optional filters (status, dateRange, etc.)
   * @returns {Promise<Array<Transaction>>} - The payment history
   */
  const getPaymentHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to get the history
      // For demo purposes, we'll generate mock transactions if none exist
      if (payments.length === 0) {
        const mockPayments = Array(10).fill().map((_, i) => {
          const status = ['completed', 'pending', 'processing', 'failed'][Math.floor(Math.random() * 4)];
          const amount = (Math.random() * 10 + 0.1).toFixed(2);
          const timestamp = new Date(Date.now() - i * 86400000).toISOString();
          
          return new Transaction({
            userId: user?.userId,
            senderAddress: user?.walletAddress,
            recipientAddress: `7xKXtg2aB5nC8dE9fGhIjK${i}...`,
            amount,
            token: Math.random() > 0.2 ? 'SOL' : 'USDC',
            memo: `Payment ${i + 1}`,
            timestamp,
            status,
            fraudScore: Math.random() * 0.3,
            estimatedFee: (parseFloat(amount) * 0.0001).toFixed(6),
            ...(status === 'completed' && {
              signature: `5J7KL8M9...P2Q3R4S${i}`,
              confirmations: 32,
              blockHeight: 123456789 + i,
              completedAt: new Date(Date.parse(timestamp) + 60000).toISOString(),
              actualFee: (parseFloat(amount) * 0.0001 * 0.8).toFixed(6),
              feeOptimization: '20.00'
            }),
            ...(status === 'failed' && {
              failureReason: 'Insufficient funds'
            })
          });
        });
        
        setPayments(mockPayments);
        return mockPayments;
      }
      
      // Apply filters if provided
      let filteredPayments = [...payments];
      
      if (filters.status) {
        filteredPayments = filteredPayments.filter(p => p.status === filters.status);
      }
      
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        filteredPayments = filteredPayments.filter(p => {
          const date = new Date(p.timestamp);
          return date >= start && date <= end;
        });
      }
      
      if (filters.minAmount) {
        filteredPayments = filteredPayments.filter(p => parseFloat(p.amount) >= filters.minAmount);
      }
      
      if (filters.maxAmount) {
        filteredPayments = filteredPayments.filter(p => parseFloat(p.amount) <= filters.maxAmount);
      }
      
      if (filters.token) {
        filteredPayments = filteredPayments.filter(p => p.token === filters.token);
      }
      
      return filteredPayments;
    } catch (err) {
      console.error('Payment history error:', err);
      setError(err.message || 'Failed to get payment history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payments, user]);

  /**
   * Get payment analytics
   * @param {string} timeframe - The timeframe for analytics (day, week, month, year)
   * @returns {Promise<Object>} - The payment analytics
   */
  const getPaymentAnalytics = useCallback(async (timeframe = 'month') => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to get analytics
      // For demo purposes, we'll calculate analytics from the payments state
      
      // Get payments for the specified timeframe
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'day':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case 'month':
          startDate = new Date(now.setDate(1));
          break;
        case 'year':
          startDate = new Date(now.setMonth(0, 1));
          break;
        default:
          startDate = new Date(now.setDate(1)); // Default to month
      }
      
      const timeframePayments = payments.filter(p => new Date(p.timestamp) >= startDate);
      
      // Calculate analytics
      const totalAmount = timeframePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const completedPayments = timeframePayments.filter(p => p.status === 'completed');
      const pendingPayments = timeframePayments.filter(p => p.status === 'pending' || p.status === 'processing');
      const failedPayments = timeframePayments.filter(p => p.status === 'failed');
      
      const totalFees = completedPayments.reduce((sum, p) => sum + parseFloat(p.actualFee || p.estimatedFee), 0);
      const feeSavings = completedPayments.reduce((sum, p) => {
        if (p.estimatedFee && p.actualFee) {
          return sum + (parseFloat(p.estimatedFee) - parseFloat(p.actualFee));
        }
        return sum;
      }, 0);
      
      // Group by day for chart data
      const chartData = [];
      const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const dayPayments = timeframePayments.filter(p => {
          const paymentDate = new Date(p.timestamp);
          return paymentDate.getDate() === date.getDate() && 
                 paymentDate.getMonth() === date.getMonth() &&
                 paymentDate.getFullYear() === date.getFullYear();
        });
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          count: dayPayments.length,
          amount: dayPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
        });
      }
      
      return {
        totalAmount,
        totalCount: timeframePayments.length,
        completedCount: completedPayments.length,
        pendingCount: pendingPayments.length,
        failedCount: failedPayments.length,
        totalFees,
        feeSavings,
        chartData
      };
    } catch (err) {
      console.error('Payment analytics error:', err);
      setError(err.message || 'Failed to get payment analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payments]);

  // Context value
  const value = {
    payments,
    loading,
    error,
    createPayment,
    getPaymentStatus,
    getPaymentHistory,
    getPaymentAnalytics
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;

