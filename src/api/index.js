/**
 * API Module Index
 * 
 * This file exports all API functions for easy importing throughout the app.
 * 
 * Usage:
 *   import { loginUser, getPortfolioSummary, searchStocks } from '@/api';
 * 
 * Note: All API calls are currently mocked and will work without a backend.
 * The mock implementations simulate realistic delays and data.
 */

// Auth API
export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  restoreSession,
} from './auth';

// Stocks API
export {
  searchStocks,
  getStockQuote,
  getStockHistory,
  getAllStocks,
  getTopMovers,
  mockStocksDatabase,
} from './stocks';

// Portfolio API
export {
  getPortfolioSummary,
  getPositions,
  getTransactions,
  getPerformanceHistory,
  getAllocation,
  getAllocationByTicker,
  loadUserPortfolio,
  clearUserPortfolio,
} from './portfolio';

// Trades API
export {
  executeBuyOrder,
  executeSellOrder,
  getOrderPreview,
  getOrders,
  getPositionForSymbol,
} from './trades';

// Wallet API
export {
  depositFunds,
  getWalletBalance,
} from './wallet';

// Watchlist API
export {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  updateWatchlistItem,
} from './watchlist';

// Alerts API
export {
  getAlerts,
  createAlert,
  deleteAlert,
  getAlertsForSymbol,
} from './alerts';

// News API
export {
  getNews,
  getStockNews,
  getMarketNews,
} from './news';

// Market API
export {
  getMarketStatus,
} from './market';

// API Client
export { apiClient, mockRequest } from './client';

