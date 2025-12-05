/**
 * Market API
 * 
 * This module handles market status and general market data API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/market/status/
 */

import { mockRequest } from './client';

/**
 * Get market status (open/closed)
 * 
 * Future Django endpoint: GET /api/market/status/
 * 
 * Simulates NYSE hours:
 * - Weekdays: 9:30 AM - 4:00 PM Eastern Time
 * - Closed on weekends
 * - Note: Does not account for holidays in this mock
 * 
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/components/market/MarketStatusBadge.jsx
 */
export const getMarketStatus = async () => {
  const now = new Date();
  
  // Convert to Eastern Time (approximate - doesn't handle DST perfectly)
  const utcHour = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const etOffset = -5; // EST (would be -4 for EDT)
  
  let etHour = utcHour + etOffset;
  if (etHour < 0) etHour += 24;
  
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if it's a weekend
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Market hours: 9:30 AM - 4:00 PM ET
  const marketOpenHour = 9;
  const marketOpenMinute = 30;
  const marketCloseHour = 16;
  const marketCloseMinute = 0;
  
  const currentTimeMinutes = etHour * 60 + utcMinutes;
  const marketOpenMinutes = marketOpenHour * 60 + marketOpenMinute;
  const marketCloseMinutes = marketCloseHour * 60 + marketCloseMinute;
  
  const isMarketHours = currentTimeMinutes >= marketOpenMinutes && currentTimeMinutes < marketCloseMinutes;
  const isOpen = !isWeekend && isMarketHours;
  
  // Calculate time until next open/close
  let nextEvent = null;
  let minutesUntilEvent = null;
  
  if (isOpen) {
    // Market is open, calculate time until close
    nextEvent = 'close';
    minutesUntilEvent = marketCloseMinutes - currentTimeMinutes;
  } else {
    // Market is closed, calculate time until open
    nextEvent = 'open';
    
    if (isWeekend) {
      // Calculate minutes until Monday 9:30 AM
      const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
      minutesUntilEvent = (daysUntilMonday * 24 * 60) + (marketOpenMinutes - currentTimeMinutes);
    } else if (currentTimeMinutes < marketOpenMinutes) {
      // Before market open today
      minutesUntilEvent = marketOpenMinutes - currentTimeMinutes;
    } else {
      // After market close today
      minutesUntilEvent = (24 * 60 - currentTimeMinutes) + marketOpenMinutes;
    }
  }

  const formatTimeUntil = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return `${hours}h ${mins}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  return mockRequest({
    isOpen,
    status: isOpen ? 'OPEN' : 'CLOSED',
    exchange: 'NYSE',
    timezone: 'America/New_York',
    currentTime: now.toISOString(),
    nextEvent,
    timeUntilNextEvent: formatTimeUntil(minutesUntilEvent),
    tradingHours: {
      open: '9:30 AM ET',
      close: '4:00 PM ET',
    },
    isWeekend,
    message: isOpen 
      ? `Market closes in ${formatTimeUntil(minutesUntilEvent)}`
      : isWeekend 
        ? 'Market closed for the weekend'
        : `Market opens in ${formatTimeUntil(minutesUntilEvent)}`,
  });
};

