/**
 * AI Service
 * 
 * Provides AI-powered functionality for fraud detection and fee optimization.
 * Uses OpenAI API for advanced pattern recognition and prediction.
 */

import OpenAI from 'openai';

class AIService {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For client-side usage (in production, use server-side API calls)
    });
    
    // Initialize fraud detection model parameters
    this.fraudDetectionThreshold = 0.7;
    this.fraudPatterns = [
      { pattern: 'multiple_small_transactions', weight: 0.6 },
      { pattern: 'unusual_recipient', weight: 0.7 },
      { pattern: 'unusual_time', weight: 0.4 },
      { pattern: 'high_value_transaction', weight: 0.5 },
      { pattern: 'new_recipient', weight: 0.3 },
      { pattern: 'cross_border', weight: 0.4 },
      { pattern: 'velocity_change', weight: 0.8 }
    ];
  }

  /**
   * Detect potential fraud in a transaction
   * @param {Object} transaction - The transaction to analyze
   * @param {Array} userHistory - The user's transaction history
   * @returns {Promise<Object>} - The fraud detection results
   */
  async detectFraud(transaction, userHistory = []) {
    try {
      // For simple cases, use rule-based detection
      if (userHistory.length < 5) {
        return this.simpleRuleBasedDetection(transaction, userHistory);
      }
      
      // For more complex cases with sufficient history, use AI
      return this.aiBasedFraudDetection(transaction, userHistory);
    } catch (error) {
      console.error('Error in fraud detection:', error);
      // Fallback to simple detection if AI fails
      return this.simpleRuleBasedDetection(transaction, userHistory);
    }
  }

  /**
   * Simple rule-based fraud detection for new users or when AI is unavailable
   * @param {Object} transaction - The transaction to analyze
   * @param {Array} userHistory - The user's transaction history
   * @returns {Object} - The fraud detection results
   */
  simpleRuleBasedDetection(transaction, userHistory = []) {
    let fraudScore = 0;
    let reasons = [];
    
    // Check for high-value transactions
    const amount = parseFloat(transaction.amount);
    if (amount > 1000) {
      fraudScore += 0.3;
      reasons.push('High-value transaction');
    }
    
    // Check for new recipients
    const isNewRecipient = !userHistory.some(tx => 
      tx.recipientAddress === transaction.recipientAddress
    );
    
    if (isNewRecipient && userHistory.length > 0) {
      fraudScore += 0.2;
      reasons.push('New recipient');
    }
    
    // Check for unusual transaction patterns
    if (userHistory.length >= 3) {
      const recentTransactions = userHistory.slice(-3);
      const avgAmount = recentTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) / recentTransactions.length;
      
      if (amount > avgAmount * 3) {
        fraudScore += 0.4;
        reasons.push('Unusual transaction amount (3x higher than average)');
      }
    }
    
    // Check for multiple transactions in short time
    const last24Hours = userHistory.filter(tx => {
      const txTime = new Date(tx.timestamp).getTime();
      const now = new Date().getTime();
      return (now - txTime) < 24 * 60 * 60 * 1000;
    });
    
    if (last24Hours.length > 5) {
      fraudScore += 0.1;
      reasons.push('Multiple transactions in 24 hours');
    }
    
    return {
      fraudScore: Math.min(fraudScore, 1),
      isFraudulent: fraudScore > this.fraudDetectionThreshold,
      reasons: reasons.length > 0 ? reasons : ['No suspicious patterns detected']
    };
  }

  /**
   * AI-based fraud detection using OpenAI
   * @param {Object} transaction - The transaction to analyze
   * @param {Array} userHistory - The user's transaction history
   * @returns {Promise<Object>} - The fraud detection results
   */
  async aiBasedFraudDetection(transaction, userHistory) {
    try {
      // Prepare transaction data for analysis
      const transactionData = {
        amount: parseFloat(transaction.amount),
        recipient: transaction.recipientAddress,
        token: transaction.token,
        timestamp: new Date(transaction.timestamp).toISOString(),
        memo: transaction.memo || ''
      };
      
      // Prepare historical data
      const historicalData = userHistory.map(tx => ({
        amount: parseFloat(tx.amount),
        recipient: tx.recipientAddress,
        token: tx.token,
        timestamp: new Date(tx.timestamp).toISOString(),
        status: tx.status
      }));
      
      // Create prompt for OpenAI
      const prompt = `
        Analyze this Solana blockchain transaction for potential fraud:
        
        Current Transaction:
        ${JSON.stringify(transactionData, null, 2)}
        
        User's Transaction History (${historicalData.length} transactions):
        ${JSON.stringify(historicalData.slice(-10), null, 2)}
        
        Provide a fraud risk assessment with:
        1. A fraud score between 0 and 1 (where 1 is highest risk)
        2. Whether the transaction should be flagged as potentially fraudulent
        3. Specific reasons for the assessment
        
        Format your response as a JSON object with keys: fraudScore, isFraudulent, reasons
      `;
      
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a fraud detection AI specializing in cryptocurrency transactions. Analyze the transaction data and provide a fraud risk assessment.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      });
      
      // Parse the response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          fraudScore: result.fraudScore,
          isFraudulent: result.isFraudulent,
          reasons: result.reasons
        };
      }
      
      // Fallback if parsing fails
      return this.simpleRuleBasedDetection(transaction, userHistory);
    } catch (error) {
      console.error('Error in AI fraud detection:', error);
      return this.simpleRuleBasedDetection(transaction, userHistory);
    }
  }

  /**
   * Optimize transaction fees based on network conditions
   * @param {number} baseFee - The base fee estimate
   * @param {Object} networkConditions - Current network conditions
   * @returns {Promise<Object>} - The optimized fee recommendations
   */
  async optimizeFees(baseFee, networkConditions) {
    try {
      // For simple optimization, use rule-based approach
      return this.simpleRuleBasedFeeOptimization(baseFee, networkConditions);
    } catch (error) {
      console.error('Error in fee optimization:', error);
      // Return the base fee if optimization fails
      return {
        recommendedFee: baseFee,
        savings: 0,
        confidence: 'low',
        explanation: 'Fee optimization failed, using base fee'
      };
    }
  }

  /**
   * Simple rule-based fee optimization
   * @param {number} baseFee - The base fee estimate
   * @param {Object} networkConditions - Current network conditions
   * @returns {Object} - The optimized fee recommendations
   */
  simpleRuleBasedFeeOptimization(baseFee, networkConditions) {
    const { tps, avgBlockTime, recentFees } = networkConditions;
    
    let recommendedFee = baseFee;
    let confidence = 'medium';
    let explanation = '';
    
    // Adjust based on transactions per second (network congestion)
    if (tps < 500) {
      // Network is congested, increase fee for faster confirmation
      recommendedFee = baseFee * 1.2;
      explanation = 'Network congestion detected, increased fee for faster confirmation';
    } else if (tps > 2000) {
      // Network is not congested, can reduce fee
      recommendedFee = baseFee * 0.8;
      explanation = 'Network is not congested, reduced fee to save costs';
      confidence = 'high';
    }
    
    // Adjust based on recent block times
    if (avgBlockTime > 0.8) {
      // Blocks are taking longer, increase fee slightly
      recommendedFee = recommendedFee * 1.1;
      explanation += '. Block times are longer than usual, adjusted fee accordingly';
    }
    
    // Adjust based on recent fee trends
    if (recentFees && recentFees.length > 0) {
      const avgRecentFee = recentFees.reduce((sum, fee) => sum + fee, 0) / recentFees.length;
      
      if (recommendedFee < avgRecentFee * 0.7) {
        // Our recommendation is much lower than recent fees, adjust upward
        recommendedFee = avgRecentFee * 0.8;
        explanation += '. Adjusted based on recent fee trends';
      }
    }
    
    // Calculate potential savings
    const savings = baseFee > recommendedFee ? 
      ((baseFee - recommendedFee) / baseFee * 100).toFixed(2) : 0;
    
    return {
      recommendedFee,
      savings: parseFloat(savings),
      confidence,
      explanation: explanation.trim()
    };
  }

  /**
   * AI-based fee optimization using OpenAI
   * @param {number} baseFee - The base fee estimate
   * @param {Object} networkConditions - Current network conditions
   * @returns {Promise<Object>} - The optimized fee recommendations
   */
  async aiBasedFeeOptimization(baseFee, networkConditions) {
    try {
      // Prepare network data for analysis
      const networkData = {
        baseFee,
        tps: networkConditions.tps,
        avgBlockTime: networkConditions.avgBlockTime,
        recentFees: networkConditions.recentFees,
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      };
      
      // Create prompt for OpenAI
      const prompt = `
        Optimize transaction fees for a Solana blockchain transaction based on current network conditions:
        
        Network Data:
        ${JSON.stringify(networkData, null, 2)}
        
        Provide fee optimization recommendations with:
        1. A recommended fee (in SOL)
        2. Potential savings compared to base fee (percentage)
        3. Confidence level in the recommendation (low, medium, high)
        4. Brief explanation for the recommendation
        
        Format your response as a JSON object with keys: recommendedFee, savings, confidence, explanation
      `;
      
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a blockchain fee optimization AI specializing in Solana transactions. Analyze the network conditions and provide fee recommendations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      });
      
      // Parse the response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          recommendedFee: result.recommendedFee,
          savings: result.savings,
          confidence: result.confidence,
          explanation: result.explanation
        };
      }
      
      // Fallback if parsing fails
      return this.simpleRuleBasedFeeOptimization(baseFee, networkConditions);
    } catch (error) {
      console.error('Error in AI fee optimization:', error);
      return this.simpleRuleBasedFeeOptimization(baseFee, networkConditions);
    }
  }
}

export default AIService;

