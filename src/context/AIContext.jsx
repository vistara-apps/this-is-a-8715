/**
 * AI Context
 * 
 * Provides AI-powered functionality for the application.
 * Handles fraud detection and fee optimization.
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import AIService from '../services/AIService';
import { useAuth } from './AuthContext';

// Create context
const AIContext = createContext();

// Custom hook for using the AI context
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

// AI provider component
export const AIProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize AI service
  const aiService = new AIService(process.env.OPENAI_API_KEY);

  /**
   * Detect potential fraud in a transaction
   * @param {Object} transaction - The transaction to analyze
   * @param {Array} userHistory - The user's transaction history
   * @returns {Promise<Object>} - The fraud detection results
   */
  const detectFraud = useCallback(async (transaction, userHistory = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has access to fraud detection
      if (user && !user.hasFeatureAccess('basic_fraud_detection')) {
        return {
          fraudScore: 0,
          isFraudulent: false,
          reasons: ['Fraud detection not available on your plan']
        };
      }
      
      // Use advanced fraud detection for pro users
      const useAdvanced = user && user.hasFeatureAccess('advanced_fraud_detection');
      
      // Call AI service
      const result = await aiService.detectFraud(transaction, userHistory);
      
      return result;
    } catch (err) {
      console.error('Fraud detection error:', err);
      setError(err.message || 'Failed to detect fraud');
      
      // Return a safe default
      return {
        fraudScore: 0,
        isFraudulent: false,
        reasons: ['Error in fraud detection']
      };
    } finally {
      setLoading(false);
    }
  }, [aiService, user]);

  /**
   * Optimize transaction fees based on network conditions
   * @param {number} baseFee - The base fee estimate
   * @param {Object} networkConditions - Current network conditions
   * @returns {Promise<Object>} - The optimized fee recommendations
   */
  const optimizeFees = useCallback(async (baseFee, networkConditions) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has access to fee optimization
      if (user && !user.hasFeatureAccess('smart_fee_management')) {
        return {
          recommendedFee: baseFee,
          savings: 0,
          confidence: 'low',
          explanation: 'Fee optimization not available on your plan'
        };
      }
      
      // Call AI service
      const result = await aiService.optimizeFees(baseFee, networkConditions);
      
      return result;
    } catch (err) {
      console.error('Fee optimization error:', err);
      setError(err.message || 'Failed to optimize fees');
      
      // Return a safe default
      return {
        recommendedFee: baseFee,
        savings: 0,
        confidence: 'low',
        explanation: 'Error in fee optimization'
      };
    } finally {
      setLoading(false);
    }
  }, [aiService, user]);

  /**
   * Get fraud detection analytics
   * @param {Array} transactions - The transactions to analyze
   * @returns {Promise<Object>} - The fraud detection analytics
   */
  const getFraudAnalytics = useCallback(async (transactions = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has access to fraud detection
      if (user && !user.hasFeatureAccess('basic_fraud_detection')) {
        return {
          totalScanned: 0,
          flaggedCount: 0,
          averageScore: 0,
          topReasons: [],
          riskDistribution: {
            low: 0,
            medium: 0,
            high: 0
          }
        };
      }
      
      // In a real app, this would make an API call to get analytics
      // For demo purposes, we'll calculate analytics from the transactions
      
      // Calculate fraud analytics
      const flaggedTransactions = transactions.filter(t => t.fraudScore > 0.5);
      const averageScore = transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + (t.fraudScore || 0), 0) / transactions.length : 0;
      
      // Count transactions by risk level
      const riskDistribution = {
        low: transactions.filter(t => (t.fraudScore || 0) < 0.3).length,
        medium: transactions.filter(t => (t.fraudScore || 0) >= 0.3 && (t.fraudScore || 0) < 0.7).length,
        high: transactions.filter(t => (t.fraudScore || 0) >= 0.7).length
      };
      
      // Collect fraud reasons
      const allReasons = flaggedTransactions
        .flatMap(t => t.fraudReason ? [t.fraudReason] : [])
        .filter(Boolean);
      
      // Count reason occurrences
      const reasonCounts = allReasons.reduce((counts, reason) => {
        counts[reason] = (counts[reason] || 0) + 1;
        return counts;
      }, {});
      
      // Get top reasons
      const topReasons = Object.entries(reasonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({ reason, count }));
      
      return {
        totalScanned: transactions.length,
        flaggedCount: flaggedTransactions.length,
        averageScore,
        topReasons,
        riskDistribution
      };
    } catch (err) {
      console.error('Fraud analytics error:', err);
      setError(err.message || 'Failed to get fraud analytics');
      
      // Return a safe default
      return {
        totalScanned: 0,
        flaggedCount: 0,
        averageScore: 0,
        topReasons: [],
        riskDistribution: {
          low: 0,
          medium: 0,
          high: 0
        }
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Get fee optimization analytics
   * @param {Array} transactions - The transactions to analyze
   * @returns {Promise<Object>} - The fee optimization analytics
   */
  const getFeeAnalytics = useCallback(async (transactions = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has access to fee optimization
      if (user && !user.hasFeatureAccess('smart_fee_management')) {
        return {
          totalTransactions: 0,
          totalSaved: 0,
          averageSavings: 0,
          savingsPercentage: 0,
          optimizationHistory: []
        };
      }
      
      // In a real app, this would make an API call to get analytics
      // For demo purposes, we'll calculate analytics from the transactions
      
      // Filter completed transactions with fee data
      const completedTransactions = transactions.filter(t => 
        t.status === 'completed' && t.estimatedFee && t.actualFee
      );
      
      // Calculate fee savings
      const totalEstimatedFees = completedTransactions.reduce((sum, t) => 
        sum + parseFloat(t.estimatedFee), 0);
      
      const totalActualFees = completedTransactions.reduce((sum, t) => 
        sum + parseFloat(t.actualFee), 0);
      
      const totalSaved = totalEstimatedFees - totalActualFees;
      const savingsPercentage = totalEstimatedFees > 0 ? 
        (totalSaved / totalEstimatedFees * 100) : 0;
      
      const averageSavings = completedTransactions.length > 0 ? 
        totalSaved / completedTransactions.length : 0;
      
      // Create optimization history for chart
      const optimizationHistory = completedTransactions
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(t => ({
          date: new Date(t.timestamp).toISOString().split('T')[0],
          estimatedFee: parseFloat(t.estimatedFee),
          actualFee: parseFloat(t.actualFee),
          savings: parseFloat(t.estimatedFee) - parseFloat(t.actualFee),
          savingsPercentage: parseFloat(t.feeOptimization) || 0
        }));
      
      return {
        totalTransactions: completedTransactions.length,
        totalSaved,
        averageSavings,
        savingsPercentage,
        optimizationHistory
      };
    } catch (err) {
      console.error('Fee analytics error:', err);
      setError(err.message || 'Failed to get fee analytics');
      
      // Return a safe default
      return {
        totalTransactions: 0,
        totalSaved: 0,
        averageSavings: 0,
        savingsPercentage: 0,
        optimizationHistory: []
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Context value
  const value = {
    loading,
    error,
    detectFraud,
    optimizeFees,
    getFraudAnalytics,
    getFeeAnalytics
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContext;

