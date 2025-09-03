/**
 * PayoutBatch Model
 * 
 * Represents a batch of payouts to multiple recipients.
 * Used for automated distribution of funds to contractors, affiliates, etc.
 */

class PayoutBatch {
  constructor(data = {}) {
    this.batchId = data.batchId || `batch_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
    this.userId = data.userId || '';
    this.name = data.name || `Batch ${new Date().toLocaleDateString()}`;
    this.creationDate = data.creationDate || new Date().toISOString();
    this.status = data.status || 'pending'; // pending, processing, completed, failed, partial
    this.totalAmount = data.totalAmount || '0';
    this.token = data.token || 'SOL';
    this.estimatedFees = data.estimatedFees || '0';
    this.actualFees = data.actualFees || '0';
    this.completedAt = data.completedAt || null;
    this.failureReason = data.failureReason || null;
    this.payouts = data.payouts || [];
    this.schedule = data.schedule || null; // null for one-time, or cron expression for recurring
    this.nextScheduledDate = data.nextScheduledDate || null;
  }

  /**
   * Add a payout to the batch
   * @param {Object} payout - The payout to add
   */
  addPayout(payout) {
    if (!payout.recipientAddress || !payout.amount) {
      throw new Error('Payout must include recipientAddress and amount');
    }
    
    const newPayout = {
      payoutId: `payout_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`,
      recipientAddress: payout.recipientAddress,
      amount: payout.amount,
      memo: payout.memo || '',
      status: 'pending',
      transactionId: null,
      signature: null,
      failureReason: null
    };
    
    this.payouts.push(newPayout);
    this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(payout.amount)).toString();
    
    return newPayout.payoutId;
  }

  /**
   * Update the status of a specific payout
   * @param {string} payoutId - The ID of the payout to update
   * @param {string} status - The new status
   * @param {Object} additionalData - Additional data to update
   */
  updatePayoutStatus(payoutId, status, additionalData = {}) {
    const payout = this.payouts.find(p => p.payoutId === payoutId);
    if (!payout) {
      throw new Error(`Payout with ID ${payoutId} not found`);
    }
    
    if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
      throw new Error('Invalid payout status');
    }
    
    payout.status = status;
    
    if (status === 'completed') {
      payout.transactionId = additionalData.transactionId || payout.transactionId;
      payout.signature = additionalData.signature || payout.signature;
    }
    
    if (status === 'failed') {
      payout.failureReason = additionalData.failureReason || 'Unknown error';
    }
    
    // Update the overall batch status based on payout statuses
    this.updateBatchStatus();
  }

  /**
   * Update the overall batch status based on individual payout statuses
   */
  updateBatchStatus() {
    const statuses = this.payouts.map(p => p.status);
    
    if (statuses.every(s => s === 'completed')) {
      this.status = 'completed';
      this.completedAt = new Date().toISOString();
    } else if (statuses.every(s => s === 'failed')) {
      this.status = 'failed';
    } else if (statuses.some(s => s === 'failed') && statuses.some(s => s === 'completed')) {
      this.status = 'partial';
    } else if (statuses.some(s => s === 'processing')) {
      this.status = 'processing';
    } else {
      this.status = 'pending';
    }
  }

  /**
   * Set up a recurring schedule for this batch
   * @param {string} cronExpression - The cron expression for the schedule
   * @param {string} nextDate - The next scheduled date (ISO string)
   */
  setSchedule(cronExpression, nextDate) {
    this.schedule = cronExpression;
    this.nextScheduledDate = nextDate;
  }

  /**
   * Get the recipient count
   * @returns {number} - The number of recipients
   */
  get recipientCount() {
    return this.payouts.length;
  }

  /**
   * Get a simplified representation of the batch for API responses
   * @returns {Object} - The simplified batch
   */
  toJSON() {
    return {
      batch_id: this.batchId,
      name: this.name,
      status: this.status,
      total_amount: this.totalAmount,
      token: this.token,
      recipient_count: this.recipientCount,
      creation_date: this.creationDate,
      completed_at: this.completedAt,
      estimated_fees: this.estimatedFees,
      actual_fees: this.actualFees,
      schedule: this.schedule,
      next_scheduled_date: this.nextScheduledDate,
      payouts: this.payouts.map(p => ({
        payout_id: p.payoutId,
        recipient: p.recipientAddress,
        amount: p.amount,
        memo: p.memo,
        status: p.status,
        transaction_id: p.transactionId,
        signature: p.signature
      }))
    };
  }
}

export default PayoutBatch;

