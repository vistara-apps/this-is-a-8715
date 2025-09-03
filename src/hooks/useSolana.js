/**
 * Custom hook for Solana blockchain interactions
 * 
 * Provides methods for connecting to wallets, sending transactions,
 * and managing Solana tokens.
 */

import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import SolanaService from '../services/SolanaService';

const useSolana = (endpoint = 'https://api.mainnet-beta.solana.com') => {
  const [connection, setConnection] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [solanaService, setSolanaService] = useState(null);

  // Initialize Solana connection and service
  useEffect(() => {
    try {
      const conn = new Connection(endpoint);
      setConnection(conn);
      
      const service = new SolanaService(endpoint);
      setSolanaService(service);
    } catch (err) {
      console.error('Error initializing Solana connection:', err);
      setError('Failed to connect to Solana network');
    }
  }, [endpoint]);

  /**
   * Connect to a wallet
   * @param {Object} walletProvider - The wallet provider (e.g., Phantom, Solflare)
   * @returns {Promise<Object>} - The connected wallet
   */
  const connectWallet = useCallback(async (walletProvider) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if wallet adapter is available
      if (!walletProvider) {
        throw new Error('Wallet provider not found');
      }
      
      // Connect to wallet
      await walletProvider.connect();
      
      // Get wallet public key
      const publicKey = walletProvider.publicKey.toString();
      
      // Create wallet object
      const connectedWallet = {
        publicKey,
        provider: walletProvider,
        disconnect: walletProvider.disconnect
      };
      
      setWallet(connectedWallet);
      
      // Get wallet balance
      if (solanaService) {
        const walletBalance = await solanaService.getBalance(publicKey);
        setBalance(walletBalance);
      }
      
      return connectedWallet;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [solanaService]);

  /**
   * Disconnect the current wallet
   */
  const disconnectWallet = useCallback(() => {
    if (wallet && wallet.disconnect) {
      wallet.disconnect();
    }
    
    setWallet(null);
    setBalance(null);
  }, [wallet]);

  /**
   * Get the balance of the connected wallet
   * @returns {Promise<number>} - The wallet balance in SOL
   */
  const getBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet || !solanaService) {
        throw new Error('Wallet not connected');
      }
      
      const walletBalance = await solanaService.getBalance(wallet.publicKey);
      setBalance(walletBalance);
      
      return walletBalance;
    } catch (err) {
      console.error('Error getting balance:', err);
      setError(err.message || 'Failed to get balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, solanaService]);

  /**
   * Get the token balance of the connected wallet
   * @param {string} tokenMintAddress - The token mint address
   * @returns {Promise<number>} - The token balance
   */
  const getTokenBalance = useCallback(async (tokenMintAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet || !solanaService) {
        throw new Error('Wallet not connected');
      }
      
      const tokenBalance = await solanaService.getTokenBalance(wallet.publicKey, tokenMintAddress);
      
      return tokenBalance;
    } catch (err) {
      console.error('Error getting token balance:', err);
      setError(err.message || 'Failed to get token balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, solanaService]);

  /**
   * Send SOL to a recipient
   * @param {string} recipientAddress - The recipient's wallet address
   * @param {number} amount - The amount to send in SOL
   * @returns {Promise<string>} - The transaction signature
   */
  const sendSol = useCallback(async (recipientAddress, amount) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!wallet || !solanaService) {
        throw new Error('Wallet not connected');
      }
      
      // In a real app, this would use the wallet adapter to sign and send the transaction
      // For demo purposes, we'll simulate a transaction
      
      // Create a mock transaction signature
      const signature = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update balance after sending
      const newBalance = balance - amount;
      setBalance(newBalance);
      
      return signature;
    } catch (err) {
      console.error('Error sending SOL:', err);
      setError(err.message || 'Failed to send SOL');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, solanaService, balance]);

  /**
   * Get the estimated fee for a transaction
   * @returns {Promise<number>} - The estimated fee in SOL
   */
  const getEstimatedFee = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!solanaService) {
        throw new Error('Solana service not initialized');
      }
      
      const fee = await solanaService.getEstimatedFee();
      
      return fee;
    } catch (err) {
      console.error('Error estimating fee:', err);
      setError(err.message || 'Failed to estimate fee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [solanaService]);

  /**
   * Get the optimal fee based on current network conditions
   * @returns {Promise<number>} - The optimal fee in SOL
   */
  const getOptimalFee = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!solanaService) {
        throw new Error('Solana service not initialized');
      }
      
      const fee = await solanaService.getOptimalFee();
      
      return fee;
    } catch (err) {
      console.error('Error calculating optimal fee:', err);
      setError(err.message || 'Failed to calculate optimal fee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [solanaService]);

  /**
   * Get the confirmation status of a transaction
   * @param {string} signature - The transaction signature
   * @returns {Promise<Object>} - The confirmation status
   */
  const getConfirmationStatus = useCallback(async (signature) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!solanaService) {
        throw new Error('Solana service not initialized');
      }
      
      // In a real app, this would call the Solana service
      // For demo purposes, we'll simulate a confirmation status
      
      // Simulate confirmation status
      const status = {
        confirmations: Math.floor(Math.random() * 32) + 1,
        status: ['confirmed', 'finalized'][Math.floor(Math.random() * 2)]
      };
      
      return status;
    } catch (err) {
      console.error('Error getting confirmation status:', err);
      setError(err.message || 'Failed to get confirmation status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [solanaService]);

  return {
    connection,
    wallet,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getBalance,
    getTokenBalance,
    sendSol,
    getEstimatedFee,
    getOptimalFee,
    getConfirmationStatus
  };
};

export default useSolana;

