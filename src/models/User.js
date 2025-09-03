/**
 * User Model
 * 
 * Represents a user in the Solana PayAI system with their account details,
 * subscription information, and API keys.
 */

class User {
  constructor(data = {}) {
    this.userId = data.userId || '';
    this.email = data.email || '';
    this.apiKey = data.apiKey || '';
    this.subscriptionTier = data.subscriptionTier || 'free'; // free, basic, pro
    this.walletAddress = data.walletAddress || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.paymentHistory = data.paymentHistory || [];
  }

  /**
   * Check if the user has access to a specific feature based on their subscription tier
   * @param {string} feature - The feature to check access for
   * @returns {boolean} - Whether the user has access to the feature
   */
  hasFeatureAccess(feature) {
    const tierFeatures = {
      free: ['basic_payments', 'basic_analytics'],
      basic: ['basic_payments', 'basic_analytics', 'basic_fraud_detection', 'api_access'],
      pro: ['basic_payments', 'basic_analytics', 'basic_fraud_detection', 'api_access', 
            'advanced_fraud_detection', 'smart_fee_management', 'batch_payouts']
    };
    
    return tierFeatures[this.subscriptionTier]?.includes(feature) || false;
  }

  /**
   * Get the transaction limits for the user based on their subscription tier
   * @returns {Object} - The transaction limits
   */
  getTransactionLimits() {
    const limits = {
      free: {
        paymentsPerDay: 10,
        payoutsPerDay: 1,
        maxTransactionAmount: 100
      },
      basic: {
        paymentsPerDay: 1000,
        payoutsPerDay: 10,
        maxTransactionAmount: 10000
      },
      pro: {
        paymentsPerDay: 5000,
        payoutsPerDay: 100,
        maxTransactionAmount: 100000
      }
    };
    
    return limits[this.subscriptionTier] || limits.free;
  }

  /**
   * Generate a new API key for the user
   * @returns {string} - The new API key
   */
  generateApiKey() {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    this.apiKey = `sk_live_${randomString}${timestamp}`;
    this.updatedAt = new Date().toISOString();
    return this.apiKey;
  }

  /**
   * Update the user's subscription tier
   * @param {string} tier - The new subscription tier
   */
  updateSubscription(tier) {
    if (['free', 'basic', 'pro'].includes(tier)) {
      this.subscriptionTier = tier;
      this.updatedAt = new Date().toISOString();
    } else {
      throw new Error('Invalid subscription tier');
    }
  }
}

export default User;

