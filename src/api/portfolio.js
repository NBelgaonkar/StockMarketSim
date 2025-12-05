/**
 * Portfolio API
 * 
 * This module handles all portfolio-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/portfolio/summary/
 * - GET /api/portfolio/positions/
 * - GET /api/portfolio/transactions/
 * - GET /api/portfolio/performance/
 */

import { mockRequest } from './client';
import { mockStocksDatabase } from './stocks';

// Demo portfolio for showcase (pre-filled with data)
const DEMO_PORTFOLIO = {
  userId: 'demo',
  cash: 7500.00,
  initialDeposit: 10000.00,
  positions: [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avgCost: 165.00,
      purchaseDate: '2024-10-15',
    },
    {
      id: 2,
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      quantity: 5,
      avgCost: 138.50,
      purchaseDate: '2024-11-01',
    },
    {
      id: 3,
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 3,
      avgCost: 220.00,
      purchaseDate: '2024-11-20',
    },
  ],
  transactions: [
    {
      id: 1,
      type: 'DEPOSIT',
      symbol: null,
      quantity: null,
      price: null,
      total: 10000.00,
      date: '2024-10-01T09:00:00Z',
      status: 'COMPLETED',
    },
    {
      id: 2,
      type: 'BUY',
      symbol: 'AAPL',
      quantity: 10,
      price: 165.00,
      total: 1650.00,
      date: '2024-10-15T10:30:00Z',
      status: 'COMPLETED',
    },
    {
      id: 3,
      type: 'BUY',
      symbol: 'GOOGL',
      quantity: 5,
      price: 138.50,
      total: 692.50,
      date: '2024-11-01T14:15:00Z',
      status: 'COMPLETED',
    },
    {
      id: 4,
      type: 'BUY',
      symbol: 'TSLA',
      quantity: 3,
      price: 220.00,
      total: 660.00,
      date: '2024-11-20T11:45:00Z',
      status: 'COMPLETED',
    },
  ],
};

// Current user's portfolio state - starts empty for new users
let currentUserPortfolio = null;

/**
 * Initialize portfolio for a new user (starts with $0)
 */
export const initializeUserPortfolio = (userId) => {
  currentUserPortfolio = {
    userId,
    cash: 0,
    initialDeposit: 0,
    positions: [],
    transactions: [],
  };
  
  // Persist to localStorage
  localStorage.setItem('userPortfolio', JSON.stringify(currentUserPortfolio));
  
  return currentUserPortfolio;
};

/**
 * Load portfolio from localStorage or initialize new one
 */
export const loadUserPortfolio = (userId) => {
  const saved = localStorage.getItem('userPortfolio');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Only load if it belongs to the same user
    if (parsed.userId === userId) {
      currentUserPortfolio = parsed;
      return currentUserPortfolio;
    }
  }
  
  // Initialize new portfolio for this user
  return initializeUserPortfolio(userId);
};

/**
 * Clear portfolio (on logout)
 */
export const clearUserPortfolio = () => {
  currentUserPortfolio = null;
  // Don't remove from localStorage - keep it for when user logs back in
};

/**
 * Get current user's portfolio state
 */
export const getUserPortfolioState = () => {
  if (!currentUserPortfolio) {
    // Return empty portfolio if not initialized
    return {
      userId: null,
      cash: 0,
      initialDeposit: 0,
      positions: [],
      transactions: [],
    };
  }
  return currentUserPortfolio;
};

/**
 * Update current user's portfolio state
 */
export const updateUserPortfolioState = (updates) => {
  if (!currentUserPortfolio) {
    console.error('No portfolio initialized');
    return;
  }
  
  currentUserPortfolio = { ...currentUserPortfolio, ...updates };
  
  // Update initialDeposit tracking
  if (updates.transactions) {
    const deposits = currentUserPortfolio.transactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.total, 0);
    currentUserPortfolio.initialDeposit = deposits;
  }
  
  // Persist to localStorage
  localStorage.setItem('userPortfolio', JSON.stringify(currentUserPortfolio));
};

// Helper to calculate position values with current prices
const enrichPositionWithCurrentPrice = (position) => {
  const stock = mockStocksDatabase.find(s => s.symbol === position.symbol);
  if (!stock) return position;

  const currentPrice = stock.price;
  const marketValue = position.quantity * currentPrice;
  const costBasis = position.quantity * position.avgCost;
  const gainLoss = marketValue - costBasis;
  const gainLossPercent = ((currentPrice - position.avgCost) / position.avgCost) * 100;

  return {
    ...position,
    currentPrice,
    marketValue,
    costBasis,
    gainLoss,
    gainLossPercent,
    sector: stock.sector,
  };
};

/**
 * Get portfolio summary (total value, cash, P&L)
 * 
 * Future Django endpoint: GET /api/portfolio/summary/
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/pages/Dashboard.jsx, src/pages/Portfolio.jsx, src/components/layout/Sidebar.jsx
 */
export const getPortfolioSummary = async () => {
  const portfolioState = getUserPortfolioState();
  const positions = portfolioState.positions.map(enrichPositionWithCurrentPrice);
  
  const investedValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalValue = portfolioState.cash + investedValue;
  const costBasis = positions.reduce((sum, p) => sum + p.costBasis, 0);
  const totalGainLoss = investedValue - costBasis;
  const totalGainLossPercent = costBasis > 0 ? (totalGainLoss / costBasis) * 100 : 0;
  
  // Calculate from initial deposits
  const overallReturn = totalValue - portfolioState.initialDeposit;
  const overallReturnPercent = portfolioState.initialDeposit > 0 
    ? (overallReturn / portfolioState.initialDeposit) * 100 
    : 0;

  const summary = {
    totalValue,
    cash: portfolioState.cash,
    investedValue,
    costBasis,
    totalGainLoss,
    totalGainLossPercent,
    overallReturn,
    overallReturnPercent,
    positionCount: positions.length,
    todayChange: positions.reduce((sum, p) => {
      const stock = mockStocksDatabase.find(s => s.symbol === p.symbol);
      return sum + (stock ? stock.change * p.quantity : 0);
    }, 0),
  };

  return mockRequest(summary);
};

/**
 * Get all portfolio positions
 * 
 * Future Django endpoint: GET /api/portfolio/positions/
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Portfolio.jsx, src/components/portfolio/HoldingsTable.jsx
 */
export const getPositions = async () => {
  const portfolioState = getUserPortfolioState();
  const positions = portfolioState.positions.map(enrichPositionWithCurrentPrice);
  return mockRequest(positions);
};

/**
 * Get transaction history
 * 
 * Future Django endpoint: GET /api/portfolio/transactions/?type=<type>&page=<page>
 * 
 * @param {Object} filters - Filter options
 * @param {string} filters.type - Transaction type ('BUY', 'SELL', 'DEPOSIT', 'ALL')
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Items per page
 * 
 * @returns {Promise<{data: {transactions: Array, total: number, page: number}}>}
 * 
 * Used in: src/pages/Activity.jsx, src/components/portfolio/TransactionHistory.jsx
 */
export const getTransactions = async ({ type = 'ALL', page = 1, limit = 10 } = {}) => {
  const portfolioState = getUserPortfolioState();
  let transactions = [...portfolioState.transactions];

  // Filter by type
  if (type !== 'ALL') {
    transactions = transactions.filter(t => t.type === type);
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Paginate
  const total = transactions.length;
  const startIndex = (page - 1) * limit;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + limit);

  return mockRequest({
    transactions: paginatedTransactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

/**
 * Get portfolio performance history
 * 
 * Future Django endpoint: GET /api/portfolio/performance/?period=<period>
 * 
 * @param {string} period - Time period ('1D', '1W', '1M', '3M', '1Y')
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Dashboard.jsx, src/pages/Portfolio.jsx, src/components/charts/PerformanceChart.jsx
 */
export const getPerformanceHistory = async (period = '1M') => {
  const daysMap = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
  };

  const days = daysMap[period] || 30;
  const data = [];
  const now = new Date();
  
  const portfolioState = getUserPortfolioState();
  const positions = portfolioState.positions.map(enrichPositionWithCurrentPrice);
  const currentValue = portfolioState.cash + positions.reduce((sum, p) => sum + p.marketValue, 0);
  
  // If user has no deposits yet, show flat line at 0
  if (portfolioState.initialDeposit === 0) {
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let label;
      if (period === '1D') {
        const hour = 9 + Math.floor((i / days) * 7);
        label = `${hour}:${i % 2 === 0 ? '00' : '30'}`;
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      data.push({
        date: date.toISOString().split('T')[0],
        label,
        value: 0,
      });
    }
    return mockRequest(data);
  }
  
  // Generate historical data with some randomness
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate portfolio growth with some variance
    const progress = 1 - (i / days);
    const baseValue = portfolioState.initialDeposit;
    const targetGrowth = (currentValue - baseValue) * progress;
    const variance = (Math.random() - 0.5) * currentValue * 0.02;
    const value = baseValue + targetGrowth + variance;
    
    // For 1D, use time labels
    let label;
    if (period === '1D') {
      const hour = 9 + Math.floor((i / days) * 7);
      label = `${hour}:${i % 2 === 0 ? '00' : '30'}`;
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    data.push({
      date: date.toISOString().split('T')[0],
      label,
      value: Math.max(value, 0),
    });
  }

  // Ensure last value matches current
  if (data.length > 0) {
    data[data.length - 1].value = currentValue;
  }

  return mockRequest(data);
};

/**
 * Get portfolio allocation by sector
 * 
 * Future Django endpoint: GET /api/portfolio/allocation/
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Portfolio.jsx, src/components/charts/AllocationChart.jsx
 */
export const getAllocation = async () => {
  const portfolioState = getUserPortfolioState();
  const positions = portfolioState.positions.map(enrichPositionWithCurrentPrice);
  const totalInvested = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalValue = totalInvested + portfolioState.cash;

  if (totalValue === 0) {
    return mockRequest([{ name: 'Cash', value: 0, percent: 100 }]);
  }

  // Group by sector
  const sectorAllocation = {};
  positions.forEach(p => {
    const sector = p.sector || 'Other';
    if (!sectorAllocation[sector]) {
      sectorAllocation[sector] = 0;
    }
    sectorAllocation[sector] += p.marketValue;
  });
  
  const allocation = Object.entries(sectorAllocation).map(([name, value]) => ({
    name,
    value: value,
    percent: (value / totalValue) * 100,
  }));

  // Add cash to allocation
  if (portfolioState.cash > 0) {
    allocation.push({
      name: 'Cash',
      value: portfolioState.cash,
      percent: (portfolioState.cash / totalValue) * 100,
    });
  }

  return mockRequest(allocation);
};

/**
 * Get allocation by ticker symbol
 * 
 * Future Django endpoint: GET /api/portfolio/allocation/?by=ticker
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Portfolio.jsx
 */
export const getAllocationByTicker = async () => {
  const portfolioState = getUserPortfolioState();
  const positions = portfolioState.positions.map(enrichPositionWithCurrentPrice);
  const totalInvested = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalValue = totalInvested + portfolioState.cash;

  if (totalValue === 0) {
    return mockRequest([{ name: 'Cash', value: 0, percent: 100 }]);
  }

  const allocation = positions.map(p => ({
    name: p.symbol,
    value: p.marketValue,
    percent: (p.marketValue / totalValue) * 100,
  }));

  if (portfolioState.cash > 0) {
    allocation.push({
      name: 'Cash',
      value: portfolioState.cash,
      percent: (portfolioState.cash / totalValue) * 100,
    });
  }

  return mockRequest(allocation);
};

// Legacy exports for backward compatibility with trades.js
export const getPortfolioState = getUserPortfolioState;
export const updatePortfolioState = updateUserPortfolioState;
