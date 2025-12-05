/**
 * Wallet API
 * 
 * This module handles wallet/funds-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - POST /api/wallet/deposit/
 * - GET /api/wallet/balance/
 */

import { mockRequest } from './client';
import { getUserPortfolioState, updateUserPortfolioState } from './portfolio';

/**
 * Deposit funds into the user's account
 * 
 * Future Django endpoint: POST /api/wallet/deposit/
 * 
 * @param {Object} params - Deposit parameters
 * @param {number} params.amount - Amount to deposit
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/wallet/AddFundsModal.jsx, src/pages/Dashboard.jsx, src/pages/Portfolio.jsx
 */
export const depositFunds = async ({ amount }) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid deposit amount');
  }

  if (amount > 1000000) {
    throw new Error('Maximum deposit is $1,000,000');
  }

  const portfolioState = getUserPortfolioState();
  
  // Create deposit transaction
  const transaction = {
    id: Date.now(),
    type: 'DEPOSIT',
    symbol: null,
    quantity: null,
    price: null,
    total: amount,
    date: new Date().toISOString(),
    status: 'COMPLETED',
  };

  // Update portfolio state
  const newCash = portfolioState.cash + amount;
  updateUserPortfolioState({
    cash: newCash,
    transactions: [...portfolioState.transactions, transaction],
  });

  return mockRequest({
    success: true,
    transaction,
    newBalance: newCash,
  });
};

/**
 * Get current wallet balance
 * 
 * Future Django endpoint: GET /api/wallet/balance/
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/layout/Sidebar.jsx
 */
export const getWalletBalance = async () => {
  const portfolioState = getUserPortfolioState();
  
  return mockRequest({
    cash: portfolioState.cash,
    currency: 'USD',
  });
};

