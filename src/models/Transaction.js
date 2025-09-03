/**
 * Transaction Model
 * 
 * Represents a payment transaction in the Solana PayAI system.
 * Includes details about the sender, recipient, amount, status, and fraud detection.
 */

class Transaction {
  constructor(data = {}) {
    this.transactionId = data.transactionId || `tx_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
    this.userId = data.userId || '';
    this.senderAddress = data.senderAddress || '';
    this.recipientAddress = data.recipientAddress || '';
    this.amount = data.amount || '0';
    this.token = data.token || 'SOL'; // SOL or SPL token
    this.memo = data.memo || '';
    this.timestamp = data.timestamp || new Date().toISOString();
    this.status = data.status || 'pending'; // pending, processing, completed, failed
    this.signature = data.signature || '';
    this.confirmations = data.confirmations || 0;
    this.blockHeight = data.blockHeight || null;
    this.completedAt = data.completedAt || null;
    this.failureReason = data.failureReason || null;
    
    // AI-related fields
    this.isFraudulent = data.isFraudulent || false;
    this.fraudScore = data.fraudScore || 0; // 0-1 score, higher means more likely to be fraudulent
    this.fraudReason = data.fraudReason || null;
    this.estimatedFee = data.estimatedFee || '0';
    this.actualFee = data.actualFee || '0';
    this.feeOptimization = data.feeOptimization || null; // null or percentage saved
  }

  /**
   * Update the transaction status
   * @param {string} status - The new status
   * @param {Object} additionalData - Additional data to update
   */
  updateStatus(status, additionalData = {}) {
    if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
      throw new Error('Invalid transaction status');
    }
    
    this.status = status;
    
    if (status === 'completed') {
      this.completedAt = additionalData.completedAt || new Date().toISOString();
      this.confirmations = additionalData.confirmations || this.confirmations;
      this.blockHeight = additionalData.blockHeight || this.blockHeight;
      this.actualFee = additionalData.actualFee || this.actualFee;
      
      if (this.estimatedFee && this.actualFee) {
        const estimated = parseFloat(this.estimatedFee);
        const actual = parseFloat(this.actualFee);
        if (estimated > actual) {
          this.feeOptimization = ((estimated - actual) / estimated * 100).toFixed(2);
        }
      }
    }
    
    if (status === 'failed') {
      this.failureReason = additionalData.failureReason || 'Unknown error';
    }
    
    if (additionalData.signature) {
      this.signature = additionalData.signature;
    }
  }

  /**
   * Set the fraud detection results
   * @param {number} fraudScore - The fraud score (0-1)
   * @param {string} reason - The reason for the fraud score
   */
  setFraudDetection(fraudScore, reason = null) {
    this.fraudScore = fraudScore;
    this.isFraudulent = fraudScore > 0.7; // Threshold for marking as fraudulent
    this.fraudReason = reason;
  }

  /**
   * Get a simplified representation of the transaction for API responses
   * @returns {Object} - The simplified transaction
   */
  toJSON() {
    return {
      id: this.transactionId,
      sender: this.senderAddress,
      recipient: this.recipientAddress,
      amount: this.amount,
      token: this.token,
      memo: this.memo,
      status: this.status,
      timestamp: this.timestamp,
      signature: this.signature,
      confirmations: this.confirmations,
      fraud_score: this.fraudScore,
      estimated_fee: this.estimatedFee,
      actual_fee: this.actualFee,
      fee_optimization: this.feeOptimization
    };
  }
}

export default Transaction;

