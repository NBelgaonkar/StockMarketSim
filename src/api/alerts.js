/**
 * Price Alerts API
 * 
 * This module handles price alert-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/alerts/
 * - POST /api/alerts/
 * - DELETE /api/alerts/<id>/
 */

import { mockRequest } from './client';
import { mockStocksDatabase } from './stocks';

// Alerts state (persisted in localStorage)
const STORAGE_KEY = 'userAlerts';

const getAlertsFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

const saveAlertsToStorage = (alerts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
};

/**
 * Get all price alerts
 * 
 * Future Django endpoint: GET /api/alerts/
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Watchlist.jsx, src/pages/Profile.jsx
 */
export const getAlerts = async () => {
  const alerts = getAlertsFromStorage();
  
  // Enrich with current stock data and check if triggered
  const enrichedAlerts = alerts.map(alert => {
    const stock = mockStocksDatabase.find(s => s.symbol === alert.symbol);
    if (!stock) return null;

    // Check if alert would be triggered
    const isTriggered = alert.direction === 'above' 
      ? stock.price >= alert.targetPrice
      : stock.price <= alert.targetPrice;
    
    return {
      ...alert,
      stockName: stock.name,
      currentPrice: stock.price,
      isTriggered,
      difference: alert.targetPrice - stock.price,
      differencePercent: ((alert.targetPrice - stock.price) / stock.price) * 100,
    };
  }).filter(Boolean);

  return mockRequest(enrichedAlerts);
};

/**
 * Create a new price alert
 * 
 * Future Django endpoint: POST /api/alerts/
 * 
 * @param {Object} params
 * @param {string} params.symbol - Stock symbol
 * @param {number} params.targetPrice - Target price for alert
 * @param {string} params.direction - 'above' or 'below'
 * @param {string} params.note - Optional note
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/alerts/PriceAlertModal.jsx
 */
export const createAlert = async ({ symbol, targetPrice, direction, note = '' }) => {
  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  if (targetPrice <= 0) {
    throw new Error('Target price must be positive');
  }

  const alerts = getAlertsFromStorage();
  
  // Check for duplicate alert
  const duplicate = alerts.find(a => 
    a.symbol === symbol && 
    a.targetPrice === targetPrice && 
    a.direction === direction
  );
  
  if (duplicate) {
    throw new Error('A similar alert already exists');
  }

  const newAlert = {
    id: Date.now(),
    symbol: stock.symbol,
    targetPrice,
    direction,
    note,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  alerts.push(newAlert);
  saveAlertsToStorage(alerts);

  return mockRequest({
    success: true,
    alert: {
      ...newAlert,
      stockName: stock.name,
      currentPrice: stock.price,
    },
  });
};

/**
 * Delete a price alert
 * 
 * Future Django endpoint: DELETE /api/alerts/<id>/
 * 
 * @param {number} alertId - Alert ID to delete
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/alerts/AlertsList.jsx
 */
export const deleteAlert = async (alertId) => {
  const alerts = getAlertsFromStorage();
  const index = alerts.findIndex(a => a.id === alertId);
  
  if (index === -1) {
    throw new Error('Alert not found');
  }

  alerts.splice(index, 1);
  saveAlertsToStorage(alerts);

  return mockRequest({ success: true, alertId });
};

/**
 * Get alerts for a specific symbol
 * 
 * @param {string} symbol - Stock symbol
 * @returns {Promise<{data: Array<Object>}>}
 */
export const getAlertsForSymbol = async (symbol) => {
  const alerts = getAlertsFromStorage();
  const symbolAlerts = alerts.filter(a => a.symbol.toUpperCase() === symbol.toUpperCase());
  
  const stock = mockStocksDatabase.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  
  const enrichedAlerts = symbolAlerts.map(alert => ({
    ...alert,
    currentPrice: stock?.price || 0,
    isTriggered: stock 
      ? (alert.direction === 'above' ? stock.price >= alert.targetPrice : stock.price <= alert.targetPrice)
      : false,
  }));

  return mockRequest(enrichedAlerts);
};

