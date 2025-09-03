/**
 * Payout Context
 * 
 * Provides payout state and methods for the application.
 * Handles payout batch creation, status checking, and history.
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import PayoutBatch from '../models/PayoutBatch';
import { useAuth } from './AuthContext';
import ApiService from '../api/ApiService';

// Create context
const PayoutContext = createContext();

// Custom hook for using the payout context
export const usePayout = () => {
  const context = useContext(PayoutContext);
  if (!context) {
    throw new Error('usePayout must be used within a PayoutProvider');
  }
  return context;
};

// Payout provider component
export const PayoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [payoutBatches, setPayoutBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize API service
  const apiService = new ApiService();
  if (user?.apiKey) {
    apiService.setApiKey(user.apiKey);
  }

  /**
   * Create a new payout batch
   * @param {Object} batchData - The batch data
   * @returns {Promise<PayoutBatch>} - The created batch
   */
  const createPayoutBatch = useCallback(async (batchData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to create the batch
      // For demo purposes, we'll create a mock batch
      const mockBatch = new PayoutBatch({
        userId: user?.userId,
        name: batchData.name || `Batch ${new Date().toLocaleDateString()}`,
        creationDate: new Date().toISOString(),
        status: 'pending',
        totalAmount: '0',
        token: batchData.token || 'SOL',
        estimatedFees: '0',
        payouts: []
      });
      
      // Add payouts to the batch
      if (batchData.recipients && Array.isArray(batchData.recipients)) {
        let totalAmount = 0;
        
        batchData.recipients.forEach(recipient => {
          mockBatch.addPayout({
            recipientAddress: recipient.address,
            amount: recipient.amount,
            memo: recipient.memo || ''
          });
          
          totalAmount += parseFloat(recipient.amount);
        });
        
        mockBatch.totalAmount = totalAmount.toString();
        mockBatch.estimatedFees = (totalAmount * 0.0001).toFixed(6);
      }
      
      // Add to payoutBatches state
      setPayoutBatches(prevBatches => [mockBatch, ...prevBatches]);
      
      return mockBatch;
    } catch (err) {
      console.error('Payout batch creation error:', err);
      setError(err.message || 'Failed to create payout batch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Get payout batch status
   * @param {string} batchId - The batch ID
   * @returns {Promise<PayoutBatch>} - The batch with updated status
   */
  const getPayoutBatchStatus = useCallback(async (batchId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the batch in state
      const batch = payoutBatches.find(b => b.batchId === batchId);
      
      if (!batch) {
        throw new Error('Payout batch not found');
      }
      
      // In a real app, this would make an API call to get the status
      // For demo purposes, we'll simulate a status update
      const updatedBatch = { ...batch };
      
      // Simulate status progression
      if (batch.status === 'pending') {
        updatedBatch.status = 'processing';
        
        // Update payout statuses
        updatedBatch.payouts = batch.payouts.map(p => ({
          ...p,
          status: 'processing'
        }));
      } else if (batch.status === 'processing') {
        // Randomly complete or fail some payouts
        updatedBatch.payouts = batch.payouts.map(p => {
          const status = Math.random() > 0.2 ? 'completed' : 'failed';
          return {
            ...p,
            status,
            ...(status === 'completed' && {
              transactionId: `tx_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`,
              signature: `5J7KL8M9...P2Q3R4S5`
            }),
            ...(status === 'failed' && {
              failureReason: 'Insufficient funds'
            })
          };
        });
        
        // Update batch status based on payout statuses
        const allCompleted = updatedBatch.payouts.every(p => p.status === 'completed');
        const allFailed = updatedBatch.payouts.every(p => p.status === 'failed');
        const someCompleted = updatedBatch.payouts.some(p => p.status === 'completed');
        const someFailed = updatedBatch.payouts.some(p => p.status === 'failed');
        
        if (allCompleted) {
          updatedBatch.status = 'completed';
          updatedBatch.completedAt = new Date().toISOString();
          updatedBatch.actualFees = (parseFloat(batch.estimatedFees) * 0.8).toFixed(6);
        } else if (allFailed) {
          updatedBatch.status = 'failed';
          updatedBatch.failureReason = 'All payouts failed';
        } else if (someCompleted && someFailed) {
          updatedBatch.status = 'partial';
          updatedBatch.actualFees = (parseFloat(batch.estimatedFees) * 0.8 * 
            (updatedBatch.payouts.filter(p => p.status === 'completed').length / updatedBatch.payouts.length)).toFixed(6);
        }
      }
      
      // Update payoutBatches state
      setPayoutBatches(prevBatches => 
        prevBatches.map(b => 
          b.batchId === batchId ? new PayoutBatch(updatedBatch) : b
        )
      );
      
      return new PayoutBatch(updatedBatch);
    } catch (err) {
      console.error('Payout batch status error:', err);
      setError(err.message || 'Failed to get payout batch status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payoutBatches]);

  /**
   * Get payout batch history
   * @param {Object} filters - Optional filters (status, dateRange, etc.)
   * @returns {Promise<Array<PayoutBatch>>} - The payout batch history
   */
  const getPayoutBatchHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to get the history
      // For demo purposes, we'll generate mock batches if none exist
      if (payoutBatches.length === 0) {
        const mockBatches = Array(5).fill().map((_, i) => {
          const status = ['completed', 'pending', 'processing', 'partial', 'failed'][Math.floor(Math.random() * 5)];
          const creationDate = new Date(Date.now() - i * 86400000 * 7).toISOString();
          const recipientCount = Math.floor(Math.random() * 5) + 1;
          const totalAmount = (Math.random() * 100 + 10).toFixed(2);
          
          const batch = new PayoutBatch({
            userId: user?.userId,
            name: `Batch ${i + 1}`,
            creationDate,
            status,
            totalAmount,
            token: Math.random() > 0.2 ? 'SOL' : 'USDC',
            estimatedFees: (parseFloat(totalAmount) * 0.0001).toFixed(6),
            ...(status === 'completed' && {
              completedAt: new Date(Date.parse(creationDate) + 3600000).toISOString(),
              actualFees: (parseFloat(totalAmount) * 0.0001 * 0.8).toFixed(6)
            }),
            ...(status === 'failed' && {
              failureReason: 'Insufficient funds'
            })
          });
          
          // Add payouts to the batch
          for (let j = 0; j < recipientCount; j++) {
            const payoutAmount = (parseFloat(totalAmount) / recipientCount).toFixed(2);
            const payoutStatus = status === 'partial' ? 
              (j < recipientCount / 2 ? 'completed' : 'failed') : 
              (status === 'processing' ? 'processing' : status);
            
            batch.addPayout({
              recipientAddress: `7xKXtg2aB5nC8dE9fGhIjK${j}...`,
              amount: payoutAmount,
              memo: `Payout ${j + 1}`
            });
            
            // Update payout status
            batch.updatePayoutStatus(batch.payouts[j].payoutId, payoutStatus, {
              ...(payoutStatus === 'completed' && {
                transactionId: `tx_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`,
                signature: `5J7KL8M9...P2Q3R4S${j}`
              }),
              ...(payoutStatus === 'failed' && {
                failureReason: 'Insufficient funds'
              })
            });
          }
          
          return batch;
        });
        
        setPayoutBatches(mockBatches);
        return mockBatches;
      }
      
      // Apply filters if provided
      let filteredBatches = [...payoutBatches];
      
      if (filters.status) {
        filteredBatches = filteredBatches.filter(b => b.status === filters.status);
      }
      
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        filteredBatches = filteredBatches.filter(b => {
          const date = new Date(b.creationDate);
          return date >= start && date <= end;
        });
      }
      
      if (filters.minAmount) {
        filteredBatches = filteredBatches.filter(b => parseFloat(b.totalAmount) >= filters.minAmount);
      }
      
      if (filters.maxAmount) {
        filteredBatches = filteredBatches.filter(b => parseFloat(b.totalAmount) <= filters.maxAmount);
      }
      
      if (filters.token) {
        filteredBatches = filteredBatches.filter(b => b.token === filters.token);
      }
      
      return filteredBatches;
    } catch (err) {
      console.error('Payout batch history error:', err);
      setError(err.message || 'Failed to get payout batch history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payoutBatches, user]);

  /**
   * Schedule a recurring payout batch
   * @param {string} batchId - The batch ID to schedule
   * @param {string} schedule - The schedule (cron expression)
   * @returns {Promise<PayoutBatch>} - The updated batch
   */
  const schedulePayoutBatch = useCallback(async (batchId, schedule) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the batch in state
      const batch = payoutBatches.find(b => b.batchId === batchId);
      
      if (!batch) {
        throw new Error('Payout batch not found');
      }
      
      // In a real app, this would make an API call to schedule the batch
      // For demo purposes, we'll update the batch in state
      const updatedBatch = { ...batch };
      
      // Calculate next scheduled date based on cron expression
      // This is a simplified example - in a real app, you'd use a cron parser
      const now = new Date();
      let nextDate;
      
      if (schedule === 'daily') {
        nextDate = new Date(now.setDate(now.getDate() + 1));
      } else if (schedule === 'weekly') {
        nextDate = new Date(now.setDate(now.getDate() + 7));
      } else if (schedule === 'monthly') {
        nextDate = new Date(now.setMonth(now.getMonth() + 1));
      } else {
        nextDate = new Date(now.setDate(now.getDate() + 1)); // Default to daily
      }
      
      updatedBatch.schedule = schedule;
      updatedBatch.nextScheduledDate = nextDate.toISOString();
      
      // Update payoutBatches state
      setPayoutBatches(prevBatches => 
        prevBatches.map(b => 
          b.batchId === batchId ? new PayoutBatch(updatedBatch) : b
        )
      );
      
      return new PayoutBatch(updatedBatch);
    } catch (err) {
      console.error('Payout batch scheduling error:', err);
      setError(err.message || 'Failed to schedule payout batch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [payoutBatches]);

  // Context value
  const value = {
    payoutBatches,
    loading,
    error,
    createPayoutBatch,
    getPayoutBatchStatus,
    getPayoutBatchHistory,
    schedulePayoutBatch
  };

  return (
    <PayoutContext.Provider value={value}>
      {children}
    </PayoutContext.Provider>
  );
};

export default PayoutContext;

