
/**
 * News API
 * 
 * This module handles market news-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/news/
 * - GET /api/news/?symbol=<symbol>
 */

import { mockRequest } from './client';

// Mock news data
const mockNewsData = [
  {
    id: 1,
    headline: 'Tech Stocks Rally as AI Optimism Continues',
    summary: 'Major technology companies saw significant gains today as investors remain bullish on artificial intelligence developments.',
    source: 'Market Watch',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    symbols: ['AAPL', 'GOOGL', 'MSFT', 'NVDA'],
    category: 'Technology',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 2,
    headline: 'Federal Reserve Signals Potential Rate Changes',
    summary: 'The Federal Reserve hinted at possible interest rate adjustments in upcoming meetings, causing market volatility.',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    symbols: ['JPM', 'V'],
    category: 'Economy',
    sentiment: 'neutral',
    imageUrl: null,
  },
  {
    id: 3,
    headline: 'Electric Vehicle Sales Surge in Q4',
    summary: 'Tesla and other EV makers report record deliveries as consumer demand for electric vehicles continues to grow.',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    symbols: ['TSLA'],
    category: 'Automotive',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 4,
    headline: 'Meta Faces Regulatory Scrutiny in Europe',
    summary: 'European regulators announce new investigation into Meta\'s data practices, shares dip in pre-market trading.',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    symbols: ['META'],
    category: 'Technology',
    sentiment: 'bearish',
    imageUrl: null,
  },
  {
    id: 5,
    headline: 'Amazon Expands Same-Day Delivery Network',
    summary: 'Amazon announces plans to open 50 new distribution centers, aiming to reach 90% of US population with same-day delivery.',
    source: 'CNBC',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    symbols: ['AMZN'],
    category: 'Retail',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 6,
    headline: 'Apple Announces New Product Event',
    summary: 'Apple sends invites for spring product event, rumored to unveil new MacBook lineup and mixed reality headset updates.',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    symbols: ['AAPL'],
    category: 'Technology',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 7,
    headline: 'Healthcare Stocks Under Pressure',
    summary: 'Healthcare sector faces headwinds as Congress debates drug pricing reforms.',
    source: 'Wall Street Journal',
    publishedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    symbols: ['JNJ'],
    category: 'Healthcare',
    sentiment: 'bearish',
    imageUrl: null,
  },
  {
    id: 8,
    headline: 'NVIDIA Reports Record Data Center Revenue',
    summary: 'NVIDIA\'s data center segment posts 200% year-over-year growth driven by AI chip demand.',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    symbols: ['NVDA'],
    category: 'Technology',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 9,
    headline: 'Walmart Partners with Tech Startup for Automation',
    summary: 'Retail giant announces strategic partnership to automate warehouse operations using robotics.',
    source: 'Business Insider',
    publishedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    symbols: ['WMT'],
    category: 'Retail',
    sentiment: 'bullish',
    imageUrl: null,
  },
  {
    id: 10,
    headline: 'Market Volatility Expected Ahead of Earnings Season',
    summary: 'Analysts warn of increased market volatility as major companies prepare to report quarterly results.',
    source: 'MarketWatch',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    symbols: [],
    category: 'Markets',
    sentiment: 'neutral',
    imageUrl: null,
  },
];

/**
 * Get market news
 * 
 * Future Django endpoint: GET /api/news/
 * 
 * @param {Object} params
 * @param {string} params.symbol - Filter by stock symbol (optional)
 * @param {string} params.category - Filter by category (optional)
 * @param {number} params.limit - Number of items to return
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/components/news/NewsFeed.jsx, src/components/news/MarketNews.jsx
 */
export const getNews = async ({ symbol, category, limit = 10 } = {}) => {
  let news = [...mockNewsData];

  // Filter by symbol
  if (symbol) {
    news = news.filter(item => 
      item.symbols.some(s => s.toUpperCase() === symbol.toUpperCase())
    );
  }

  // Filter by category
  if (category) {
    news = news.filter(item => item.category === category);
  }

  // Sort by date descending
  news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Limit results
  news = news.slice(0, limit);

  // Add relative time
  news = news.map(item => ({
    ...item,
    relativeTime: getRelativeTime(new Date(item.publishedAt)),
  }));

  return mockRequest(news);
};

/**
 * Get news for a specific stock
 * 
 * Future Django endpoint: GET /api/news/?symbol=<symbol>
 * 
 * @param {string} symbol - Stock symbol
 * @param {number} limit - Number of items
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/components/trade/StockDetailCard.jsx
 */
export const getStockNews = async (symbol, limit = 5) => {
  return getNews({ symbol, limit });
};

/**
 * Get general market news
 * 
 * @param {number} limit - Number of items
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Dashboard.jsx
 */
export const getMarketNews = async (limit = 5) => {
  return getNews({ limit });
};

// Helper function for relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

