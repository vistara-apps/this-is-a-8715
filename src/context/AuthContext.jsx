/**
 * Authentication Context
 * 
 * Provides authentication state and methods for the application.
 * Handles user login, logout, and session management.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import User from '../models/User';

// Create context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored user data
        const storedUser = localStorage.getItem('solanaPayAI_user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(new User(userData));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in a user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<User>} - The logged in user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to authenticate
      // For demo purposes, we'll create a mock user
      const mockUser = new User({
        userId: 'user_' + Math.random().toString(36).substring(2, 9),
        email,
        apiKey: 'sk_live_' + Math.random().toString(36).substring(2, 15),
        subscriptionTier: 'basic',
        walletAddress: '7xKXtg2aB5nC8dE9fGhIjK...',
        createdAt: new Date().toISOString()
      });
      
      // Store user data in localStorage
      localStorage.setItem('solanaPayAI_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @param {Object} additionalData - Additional user data
   * @returns {Promise<User>} - The registered user
   */
  const register = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to register
      // For demo purposes, we'll create a mock user
      const mockUser = new User({
        userId: 'user_' + Math.random().toString(36).substring(2, 9),
        email,
        apiKey: 'sk_live_' + Math.random().toString(36).substring(2, 15),
        subscriptionTier: 'free',
        walletAddress: additionalData.walletAddress || '',
        createdAt: new Date().toISOString()
      });
      
      // Store user data in localStorage
      localStorage.setItem('solanaPayAI_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    localStorage.removeItem('solanaPayAI_user');
    setUser(null);
  };

  /**
   * Update the user's profile
   * @param {Object} userData - The updated user data
   * @returns {Promise<User>} - The updated user
   */
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to update the profile
      const updatedUser = new User({
        ...user,
        ...userData,
        updatedAt: new Date().toISOString()
      });
      
      // Store updated user data in localStorage
      localStorage.setItem('solanaPayAI_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a new API key for the user
   * @returns {Promise<string>} - The new API key
   */
  const generateApiKey = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to generate a new key
      const newApiKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
      
      const updatedUser = new User({
        ...user,
        apiKey: newApiKey,
        updatedAt: new Date().toISOString()
      });
      
      // Store updated user data in localStorage
      localStorage.setItem('solanaPayAI_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return newApiKey;
    } catch (err) {
      console.error('API key generation error:', err);
      setError(err.message || 'Failed to generate API key');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the user's subscription tier
   * @param {string} tier - The new subscription tier
   * @returns {Promise<User>} - The updated user
   */
  const updateSubscription = async (tier) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to update the subscription
      const updatedUser = new User({
        ...user,
        subscriptionTier: tier,
        updatedAt: new Date().toISOString()
      });
      
      // Store updated user data in localStorage
      localStorage.setItem('solanaPayAI_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Subscription update error:', err);
      setError(err.message || 'Failed to update subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    generateApiKey,
    updateSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

