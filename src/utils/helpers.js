/**
 * Helper Utilities
 * 
 * Common utility functions used throughout the application.
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format a number as SOL
 * @param {number} amount - The amount to format
 * @returns {string} - The formatted SOL string
 */
export const formatSOL = (amount) => {
  return `${parseFloat(amount).toFixed(6)} SOL`;
};

/**
 * Format a date
 * @param {string} dateString - The date string to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    ...options
  }).format(date);
};

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated string
 */
export const truncateString = (str, length = 10) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Truncate a wallet address
 * @param {string} address - The wallet address
 * @returns {string} - The truncated address
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Calculate the percentage change between two values
 * @param {number} oldValue - The old value
 * @param {number} newValue - The new value
 * @returns {number} - The percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

/**
 * Format a percentage
 * @param {number} percentage - The percentage to format
 * @param {number} decimals - The number of decimal places
 * @returns {string} - The formatted percentage string
 */
export const formatPercentage = (percentage, decimals = 2) => {
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Get a color based on a value's relationship to a threshold
 * @param {number} value - The value to check
 * @param {number} threshold - The threshold value
 * @param {Object} colors - The colors to use
 * @returns {string} - The color
 */
export const getColorByThreshold = (value, threshold, colors = { high: 'red', medium: 'yellow', low: 'green' }) => {
  if (value >= threshold) {
    return colors.high;
  } else if (value >= threshold / 2) {
    return colors.medium;
  } else {
    return colors.low;
  }
};

/**
 * Get a color based on a transaction status
 * @param {string} status - The transaction status
 * @returns {string} - The color
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'processing':
      return 'blue';
    case 'failed':
      return 'red';
    case 'partial':
      return 'orange';
    default:
      return 'gray';
  }
};

/**
 * Validate a Solana wallet address
 * @param {string} address - The wallet address to validate
 * @returns {boolean} - Whether the address is valid
 */
export const isValidSolanaAddress = (address) => {
  try {
    if (!address) return false;
    
    // Check length (Solana addresses are 44 characters long in base58)
    if (address.length !== 44) return false;
    
    // Check for valid base58 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(address);
  } catch (error) {
    return false;
  }
};

/**
 * Validate an amount
 * @param {string|number} amount - The amount to validate
 * @param {number} min - The minimum allowed amount
 * @param {number} max - The maximum allowed amount
 * @returns {boolean} - Whether the amount is valid
 */
export const isValidAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsedAmount = parseFloat(amount);
  return !isNaN(parsedAmount) && parsedAmount >= min && parsedAmount <= max;
};

/**
 * Generate a random ID
 * @param {number} length - The length of the ID
 * @returns {string} - The random ID
 */
export const generateId = (length = 10) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Delay execution for a specified time
 * @param {number} ms - The time to delay in milliseconds
 * @returns {Promise<void>} - A promise that resolves after the delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function until it succeeds or reaches the maximum number of attempts
 * @param {Function} fn - The function to retry
 * @param {number} maxAttempts - The maximum number of attempts
 * @param {number} delayMs - The delay between attempts in milliseconds
 * @returns {Promise<any>} - The result of the function
 */
export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
};

