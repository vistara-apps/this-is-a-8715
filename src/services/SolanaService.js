/**
 * Solana Service
 * 
 * Provides functionality for interacting with the Solana blockchain,
 * including sending transactions, checking balances, and managing tokens.
 */

import { 
  Connection, 
  PublicKey, 
  Transaction as SolanaTransaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';

class SolanaService {
  constructor(endpoint = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(endpoint);
    this.network = endpoint.includes('mainnet') ? 'mainnet' : 'devnet';
  }

  /**
   * Get the SOL balance for a wallet address
   * @param {string} address - The wallet address
   * @returns {Promise<number>} - The balance in SOL
   */
  async getBalance(address) {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  /**
   * Get the SPL token balance for a wallet address
   * @param {string} walletAddress - The wallet address
   * @param {string} tokenMintAddress - The token mint address
   * @returns {Promise<number>} - The token balance
   */
  async getTokenBalance(walletAddress, tokenMintAddress) {
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(tokenMintAddress);
      
      const tokenAccount = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        walletPublicKey
      );
      
      const tokenAccountInfo = await this.connection.getAccountInfo(tokenAccount);
      
      if (!tokenAccountInfo) {
        return 0;
      }
      
      const tokenBalance = await this.connection.getTokenAccountBalance(tokenAccount);
      return parseFloat(tokenBalance.value.uiAmount);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  /**
   * Send SOL from one wallet to another
   * @param {Object} keypair - The sender's keypair
   * @param {string} recipientAddress - The recipient's wallet address
   * @param {number} amount - The amount to send in SOL
   * @returns {Promise<string>} - The transaction signature
   */
  async sendSol(keypair, recipientAddress, amount) {
    try {
      const recipientPublicKey = new PublicKey(recipientAddress);
      const lamports = amount * LAMPORTS_PER_SOL;
      
      const transaction = new SolanaTransaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports
        })
      );
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [keypair]
      );
      
      return signature;
    } catch (error) {
      console.error('Error sending SOL:', error);
      throw new Error(`Failed to send SOL: ${error.message}`);
    }
  }

  /**
   * Send SPL tokens from one wallet to another
   * @param {Object} keypair - The sender's keypair
   * @param {string} recipientAddress - The recipient's wallet address
   * @param {string} tokenMintAddress - The token mint address
   * @param {number} amount - The amount to send
   * @param {number} decimals - The token decimals
   * @returns {Promise<string>} - The transaction signature
   */
  async sendToken(keypair, recipientAddress, tokenMintAddress, amount, decimals = 9) {
    try {
      const recipientPublicKey = new PublicKey(recipientAddress);
      const tokenMintPublicKey = new PublicKey(tokenMintAddress);
      
      // Get the token accounts
      const senderTokenAccount = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        keypair.publicKey
      );
      
      const recipientTokenAccount = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        recipientPublicKey
      );
      
      // Check if recipient token account exists
      const recipientTokenAccountInfo = await this.connection.getAccountInfo(recipientTokenAccount);
      
      // Create transaction
      const transaction = new SolanaTransaction();
      
      // If recipient token account doesn't exist, create it
      if (!recipientTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            keypair.publicKey,
            recipientTokenAccount,
            recipientPublicKey,
            tokenMintPublicKey
          )
        );
      }
      
      // Add transfer instruction
      const tokenAmount = amount * (10 ** decimals);
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          keypair.publicKey,
          BigInt(Math.floor(tokenAmount))
        )
      );
      
      // Send transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [keypair]
      );
      
      return signature;
    } catch (error) {
      console.error('Error sending token:', error);
      throw new Error(`Failed to send token: ${error.message}`);
    }
  }

  /**
   * Get transaction details
   * @param {string} signature - The transaction signature
   * @returns {Promise<Object>} - The transaction details
   */
  async getTransaction(signature) {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });
      
      return transaction;
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw new Error(`Failed to get transaction: ${error.message}`);
    }
  }

  /**
   * Get the current network fee estimate
   * @returns {Promise<number>} - The estimated fee in SOL
   */
  async getEstimatedFee() {
    try {
      // Get recent blockhash and fee calculator
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      
      // Estimate fee for a simple transfer
      const lamportsPerSignature = feeCalculator.lamportsPerSignature;
      
      // Convert to SOL
      return lamportsPerSignature / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error estimating fee:', error);
      throw new Error(`Failed to estimate fee: ${error.message}`);
    }
  }

  /**
   * Get the optimal fee based on current network conditions
   * @returns {Promise<number>} - The optimal fee in SOL
   */
  async getOptimalFee() {
    try {
      // Get recent performance samples
      const perfSamples = await this.connection.getRecentPerformanceSamples(10);
      
      // Calculate average transactions per second
      const avgTps = perfSamples.reduce((sum, sample) => sum + sample.numTransactions / sample.samplePeriodSecs, 0) / perfSamples.length;
      
      // Get base fee
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      const baseFee = feeCalculator.lamportsPerSignature;
      
      // Adjust fee based on network congestion
      let adjustedFee = baseFee;
      
      // If network is congested (low TPS), increase fee
      if (avgTps < 1000) {
        adjustedFee = baseFee * 1.5;
      } else if (avgTps < 500) {
        adjustedFee = baseFee * 2;
      }
      
      // Convert to SOL
      return adjustedFee / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error calculating optimal fee:', error);
      // Fall back to regular fee estimation
      return this.getEstimatedFee();
    }
  }

  /**
   * Get the confirmation status of a transaction
   * @param {string} signature - The transaction signature
   * @returns {Promise<Object>} - The confirmation status
   */
  async getConfirmationStatus(signature) {
    try {
      const status = await this.connection.getSignatureStatus(signature, {
        searchTransactionHistory: true
      });
      
      return {
        confirmations: status.value?.confirmations || 0,
        status: status.value?.confirmationStatus || 'unknown'
      };
    } catch (error) {
      console.error('Error getting confirmation status:', error);
      throw new Error(`Failed to get confirmation status: ${error.message}`);
    }
  }
}

export default SolanaService;

