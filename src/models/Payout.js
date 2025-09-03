/**
 * Payout Model
 * 
 * Represents an individual payout within a batch.
 * Contains details about the recipient, amount, and status.
 */

class Payout {
  constructor(data = {}) {
    this.payoutId = data.payoutId || `payout_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;
    this.batchId = data.batchId || null;
    this.recipientAddress = data.recipientAddress || '';
    this.amount = data.amount || '0';
    this.token = data.token || 'SOL';
    this.memo = data.memo || '';
    this.status = data.status || 'pending'; // pending, processing, completed, failed
    this.transactionId = data.transactionId || null;
    this.signature = data.signature || null;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.completedAt = data.completedAt || null;
    this.failureReason = data.failureReason || null;
  }

  /**
   * Update the payout status
   * @param {string} status - The new status
   * @param {Object} additionalData - Additional data to update
   */
  updateStatus(status, additionalData = {}) {
    if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
      throw new Error('Invalid payout status');
    }
    
    this.status = status;
    
    if (status === 'completed') {
      this.completedAt = additionalData.completedAt || new Date().toISOString();
      this.transactionId = additionalData.transactionId || this.transactionId;
      this.signature = additionalData.signature || this.signature;
    }
    
    if (status === 'failed') {
      this.failureReason = additionalData.failureReason || 'Unknown error';
    }
  }

  /**
   * Get a simplified representation of the payout for API responses
   * @returns {Object} - The simplified payout
   */
  toJSON() {
    return {
      payout_id: this.payoutId,
      batch_id: this.batchId,
      recipient: this.recipientAddress,
      amount: this.amount,
      token: this.token,
      memo: this.memo,
      status: this.status,
      transaction_id: this.transactionId,
      signature: this.signature,
      timestamp: this.timestamp,
      completed_at: this.completedAt
    };
  }
}

export default Payout;

