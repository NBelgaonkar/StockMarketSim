/**
 * Trades API
 * 
 * This module handles all trading-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - POST /api/trades/buy/
 * - POST /api/trades/sell/
 * - GET /api/trades/orders/
 */

import { mockRequest } from './client';
import { mockStocksDatabase } from './stocks';
import { getPortfolioState, updatePortfolioState } from './portfolio';

/**
 * Execute a buy order
 * 
 * Future Django endpoint: POST /api/trades/buy/
 * 
 * @param {Object} order - Buy order details
 * @param {string} order.symbol - Stock symbol to buy
 * @param {number} order.quantity - Number of shares
 * @param {string} order.orderType - 'MARKET' or 'LIMIT'
 * @param {number} order.limitPrice - Limit price (required for limit orders)
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/pages/Trade.jsx, src/components/trade/TradeForm.jsx
 */
export const executeBuyOrder = async ({ symbol, quantity, orderType = 'MARKET', limitPrice = null }) => {
  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  const price = orderType === 'MARKET' ? stock.price : limitPrice;
  const total = price * quantity;
  const portfolioState = getPortfolioState();

  // Validate cash available
  if (total > portfolioState.cash) {
    throw new Error('Insufficient funds');
  }

  // Check if position already exists
  const existingPositionIndex = portfolioState.positions.findIndex(
    p => p.symbol.toUpperCase() === symbol.toUpperCase()
  );

  let updatedPositions = [...portfolioState.positions];
  
  if (existingPositionIndex >= 0) {
    // Update existing position
    const existingPosition = updatedPositions[existingPositionIndex];
    const newQuantity = existingPosition.quantity + quantity;
    const newAvgCost = ((existingPosition.avgCost * existingPosition.quantity) + (price * quantity)) / newQuantity;
    
    updatedPositions[existingPositionIndex] = {
      ...existingPosition,
      quantity: newQuantity,
      avgCost: newAvgCost,
    };
  } else {
    // Create new position
    const newPosition = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      name: stock.name,
      quantity,
      avgCost: price,
      purchaseDate: new Date().toISOString().split('T')[0],
    };
    updatedPositions.push(newPosition);
  }

  // Create transaction record
  const transaction = {
    id: Date.now(),
    type: 'BUY',
    symbol: symbol.toUpperCase(),
    quantity,
    price,
    total,
    date: new Date().toISOString(),
    status: 'COMPLETED',
    orderType,
  };

  // Update portfolio state
  updatePortfolioState({
    cash: portfolioState.cash - total,
    positions: updatedPositions,
    transactions: [...portfolioState.transactions, transaction],
  });

  return mockRequest({
    success: true,
    order: {
      id: transaction.id,
      symbol: symbol.toUpperCase(),
      side: 'BUY',
      quantity,
      price,
      total,
      status: 'FILLED',
      filledAt: new Date().toISOString(),
    },
    newBalance: portfolioState.cash - total,
  });
};

/**
 * Execute a sell order
 * 
 * Future Django endpoint: POST /api/trades/sell/
 * 
 * @param {Object} order - Sell order details
 * @param {string} order.symbol - Stock symbol to sell
 * @param {number} order.quantity - Number of shares
 * @param {string} order.orderType - 'MARKET' or 'LIMIT'
 * @param {number} order.limitPrice - Limit price (required for limit orders)
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/pages/Trade.jsx, src/components/trade/TradeForm.jsx
 */
export const executeSellOrder = async ({ symbol, quantity, orderType = 'MARKET', limitPrice = null }) => {
  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  const portfolioState = getPortfolioState();
  
  // Find existing position
  const existingPositionIndex = portfolioState.positions.findIndex(
    p => p.symbol.toUpperCase() === symbol.toUpperCase()
  );

  if (existingPositionIndex < 0) {
    throw new Error(`No position found for ${symbol}`);
  }

  const existingPosition = portfolioState.positions[existingPositionIndex];
  
  if (quantity > existingPosition.quantity) {
    throw new Error(`Insufficient shares. You own ${existingPosition.quantity} shares of ${symbol}`);
  }

  const price = orderType === 'MARKET' ? stock.price : limitPrice;
  const total = price * quantity;

  let updatedPositions = [...portfolioState.positions];
  
  if (quantity === existingPosition.quantity) {
    // Remove position entirely
    updatedPositions.splice(existingPositionIndex, 1);
  } else {
    // Reduce position
    updatedPositions[existingPositionIndex] = {
      ...existingPosition,
      quantity: existingPosition.quantity - quantity,
    };
  }

  // Create transaction record
  const transaction = {
    id: Date.now(),
    type: 'SELL',
    symbol: symbol.toUpperCase(),
    quantity,
    price,
    total,
    date: new Date().toISOString(),
    status: 'COMPLETED',
    orderType,
  };

  // Update portfolio state
  updatePortfolioState({
    cash: portfolioState.cash + total,
    positions: updatedPositions,
    transactions: [...portfolioState.transactions, transaction],
  });

  // Calculate realized gain/loss
  const costBasis = existingPosition.avgCost * quantity;
  const realizedGainLoss = total - costBasis;

  return mockRequest({
    success: true,
    order: {
      id: transaction.id,
      symbol: symbol.toUpperCase(),
      side: 'SELL',
      quantity,
      price,
      total,
      status: 'FILLED',
      filledAt: new Date().toISOString(),
      realizedGainLoss,
    },
    newBalance: portfolioState.cash + total,
  });
};

/**
 * Get order preview (estimate before executing)
 * 
 * Future Django endpoint: POST /api/trades/preview/
 * 
 * @param {Object} order - Order details
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/trade/TradeForm.jsx
 */
export const getOrderPreview = async ({ symbol, quantity, side, orderType = 'MARKET' }) => {
  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  const portfolioState = getPortfolioState();
  const price = stock.price;
  const total = price * quantity;

  const preview = {
    symbol: symbol.toUpperCase(),
    stockName: stock.name,
    side,
    quantity,
    price,
    estimatedTotal: total,
    commission: 0, // Free trades in simulation
    orderType,
  };

  if (side === 'BUY') {
    preview.availableCash = portfolioState.cash;
    preview.canExecute = total <= portfolioState.cash;
    preview.remainingCash = portfolioState.cash - total;
  } else {
    const position = portfolioState.positions.find(
      p => p.symbol.toUpperCase() === symbol.toUpperCase()
    );
    preview.sharesOwned = position ? position.quantity : 0;
    preview.canExecute = position && quantity <= position.quantity;
    preview.avgCost = position ? position.avgCost : null;
    preview.estimatedGainLoss = position ? (price - position.avgCost) * quantity : null;
  }

  return mockRequest(preview);
};

/**
 * Get recent orders
 * 
 * Future Django endpoint: GET /api/trades/orders/
 * 
 * @param {Object} filters - Filter options
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Activity.jsx
 */
export const getOrders = async ({ status = 'ALL', limit = 10 } = {}) => {
  const portfolioState = getPortfolioState();
  
  let orders = portfolioState.transactions
    .filter(t => t.type === 'BUY' || t.type === 'SELL')
    .map(t => ({
      id: t.id,
      symbol: t.symbol,
      side: t.type,
      quantity: t.quantity,
      price: t.price,
      total: t.total,
      status: t.status,
      orderType: t.orderType || 'MARKET',
      createdAt: t.date,
      filledAt: t.date,
    }));

  // Sort by date descending
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Apply limit
  orders = orders.slice(0, limit);

  return mockRequest(orders);
};

/**
 * Get position for a specific symbol (for trade form)
 * 
 * @param {string} symbol - Stock symbol
 * @returns {Promise<{data: Object|null}>}
 * 
 * Used in: src/components/trade/TradeForm.jsx
 */
export const getPositionForSymbol = async (symbol) => {
  const portfolioState = getPortfolioState();
  const position = portfolioState.positions.find(
    p => p.symbol.toUpperCase() === symbol.toUpperCase()
  );
  
  return mockRequest(position || null);
};

