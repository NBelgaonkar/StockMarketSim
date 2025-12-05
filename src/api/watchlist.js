/**
 * Watchlist API
 * 
 * This module handles watchlist-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/watchlist/
 * - POST /api/watchlist/add/
 * - DELETE /api/watchlist/remove/
 */

import { mockRequest } from './client';
import { mockStocksDatabase } from './stocks';

// Watchlist state (persisted in localStorage)
const STORAGE_KEY = 'userWatchlist';

const getWatchlistFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

const saveWatchlistToStorage = (watchlist) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
};

/**
 * Get user's watchlist
 * 
 * Future Django endpoint: GET /api/watchlist/
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Watchlist.jsx, src/components/watchlist/WatchlistSidebar.jsx
 */
export const getWatchlist = async () => {
  const watchlistSymbols = getWatchlistFromStorage();
  
  // Enrich with current stock data
  const watchlistData = watchlistSymbols.map(item => {
    const stock = mockStocksDatabase.find(s => s.symbol === item.symbol);
    if (!stock) return null;
    
    return {
      id: item.id,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      addedAt: item.addedAt,
      hasAlert: item.hasAlert || false,
      alertPrice: item.alertPrice || null,
      alertDirection: item.alertDirection || null,
    };
  }).filter(Boolean);

  return mockRequest(watchlistData);
};

/**
 * Add stock to watchlist
 * 
 * Future Django endpoint: POST /api/watchlist/add/
 * 
 * @param {Object} params
 * @param {string} params.symbol - Stock symbol to add
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/StockCard.jsx, src/components/trade/StockDetailCard.jsx
 */
export const addToWatchlist = async ({ symbol }) => {
  const watchlist = getWatchlistFromStorage();
  
  // Check if already in watchlist
  if (watchlist.some(item => item.symbol === symbol)) {
    throw new Error('Stock is already in your watchlist');
  }

  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  const newItem = {
    id: Date.now(),
    symbol: stock.symbol,
    addedAt: new Date().toISOString(),
    hasAlert: false,
    alertPrice: null,
    alertDirection: null,
  };

  watchlist.push(newItem);
  saveWatchlistToStorage(watchlist);

  return mockRequest({
    success: true,
    item: {
      ...newItem,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
    },
  });
};

/**
 * Remove stock from watchlist
 * 
 * Future Django endpoint: DELETE /api/watchlist/remove/
 * 
 * @param {Object} params
 * @param {string} params.symbol - Stock symbol to remove
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/watchlist/WatchlistItem.jsx, src/pages/Watchlist.jsx
 */
export const removeFromWatchlist = async ({ symbol }) => {
  const watchlist = getWatchlistFromStorage();
  const index = watchlist.findIndex(item => item.symbol === symbol);
  
  if (index === -1) {
    throw new Error('Stock is not in your watchlist');
  }

  watchlist.splice(index, 1);
  saveWatchlistToStorage(watchlist);

  return mockRequest({ success: true, symbol });
};

/**
 * Check if stock is in watchlist
 * 
 * @param {string} symbol - Stock symbol
 * @returns {Promise<{data: boolean}>}
 * 
 * Used in: src/components/StockCard.jsx
 */
export const isInWatchlist = async (symbol) => {
  const watchlist = getWatchlistFromStorage();
  const found = watchlist.some(item => item.symbol.toUpperCase() === symbol.toUpperCase());
  return mockRequest(found);
};

/**
 * Update watchlist item (e.g., add/update alert)
 * 
 * @param {Object} params
 * @param {string} params.symbol
 * @param {Object} params.updates
 * @returns {Promise<{data: Object}>}
 */
export const updateWatchlistItem = async ({ symbol, updates }) => {
  const watchlist = getWatchlistFromStorage();
  const index = watchlist.findIndex(item => item.symbol === symbol);
  
  if (index === -1) {
    throw new Error('Stock is not in your watchlist');
  }

  watchlist[index] = { ...watchlist[index], ...updates };
  saveWatchlistToStorage(watchlist);

  return mockRequest({ success: true, item: watchlist[index] });
};

