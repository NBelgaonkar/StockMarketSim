/**
 * Stocks API
 * 
 * This module handles all stock-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - GET /api/stocks/search/?q=<query>
 * - GET /api/stocks/quote/<symbol>/
 * - GET /api/stocks/<symbol>/history/
 */

import { mockRequest } from './client';

// Extended mock stocks database
export const mockStocksDatabase = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    previousClose: 173.09,
    change: 2.34,
    changePercent: 1.35,
    open: 173.50,
    high: 176.20,
    low: 172.80,
    volume: 45678900,
    avgVolume: 52000000,
    marketCap: 2750000000000,
    pe: 28.5,
    eps: 6.15,
    week52High: 199.62,
    week52Low: 143.90,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
  },
  {
    id: 2,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    previousClose: 143.79,
    change: -1.23,
    changePercent: -0.86,
    open: 143.00,
    high: 144.50,
    low: 141.80,
    volume: 23456700,
    avgVolume: 28000000,
    marketCap: 1800000000000,
    pe: 25.2,
    eps: 5.66,
    week52High: 153.78,
    week52Low: 102.21,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
  },
  {
    id: 3,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    previousClose: 374.73,
    change: 4.12,
    changePercent: 1.10,
    open: 375.00,
    high: 380.50,
    low: 374.00,
    volume: 34567800,
    avgVolume: 30000000,
    marketCap: 2800000000000,
    pe: 35.8,
    eps: 10.58,
    week52High: 384.30,
    week52Low: 275.37,
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
  },
  {
    id: 4,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 155.23,
    previousClose: 156.10,
    change: -0.87,
    changePercent: -0.56,
    open: 155.50,
    high: 157.20,
    low: 154.00,
    volume: 45678900,
    avgVolume: 48000000,
    marketCap: 1600000000000,
    pe: 78.5,
    eps: 1.98,
    week52High: 161.73,
    week52Low: 101.15,
    sector: 'Consumer Discretionary',
    industry: 'Internet Retail',
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores.',
  },
  {
    id: 5,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    previousClose: 236.08,
    change: 12.34,
    changePercent: 5.22,
    open: 238.00,
    high: 252.00,
    low: 236.50,
    volume: 78901200,
    avgVolume: 95000000,
    marketCap: 780000000000,
    pe: 65.3,
    eps: 3.80,
    week52High: 299.29,
    week52Low: 138.80,
    sector: 'Automotive',
    industry: 'Auto Manufacturers',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
  },
  {
    id: 6,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.23,
    previousClose: 851.78,
    change: 23.45,
    changePercent: 2.76,
    open: 855.00,
    high: 880.00,
    low: 850.00,
    volume: 56789000,
    avgVolume: 42000000,
    marketCap: 2200000000000,
    pe: 68.9,
    eps: 12.71,
    week52High: 974.00,
    week52Low: 222.97,
    sector: 'Technology',
    industry: 'Semiconductors',
    description: 'NVIDIA Corporation provides graphics, compute and networking solutions in the United States, Taiwan, China, and internationally.',
  },
  {
    id: 7,
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 485.67,
    previousClose: 494.57,
    change: -8.90,
    changePercent: -1.80,
    open: 492.00,
    high: 496.50,
    low: 483.00,
    volume: 34567800,
    avgVolume: 18000000,
    marketCap: 1200000000000,
    pe: 32.4,
    eps: 14.99,
    week52High: 531.49,
    week52Low: 274.38,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description: 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family.',
  },
  {
    id: 8,
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 178.34,
    previousClose: 177.11,
    change: 1.23,
    changePercent: 0.69,
    open: 177.50,
    high: 179.50,
    low: 176.80,
    volume: 23456700,
    avgVolume: 12000000,
    marketCap: 520000000000,
    pe: 11.2,
    eps: 15.92,
    week52High: 200.94,
    week52Low: 135.19,
    sector: 'Financial Services',
    industry: 'Banks—Diversified',
    description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.',
  },
  {
    id: 9,
    symbol: 'V',
    name: 'Visa Inc.',
    price: 267.89,
    previousClose: 265.45,
    change: 2.44,
    changePercent: 0.92,
    open: 266.00,
    high: 269.00,
    low: 265.00,
    volume: 8765400,
    avgVolume: 7500000,
    marketCap: 550000000000,
    pe: 29.8,
    eps: 8.99,
    week52High: 290.96,
    week52Low: 227.79,
    sector: 'Financial Services',
    industry: 'Credit Services',
    description: 'Visa Inc. operates as a payments technology company worldwide.',
  },
  {
    id: 10,
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    price: 156.78,
    previousClose: 158.23,
    change: -1.45,
    changePercent: -0.92,
    open: 157.50,
    high: 158.80,
    low: 155.90,
    volume: 12345600,
    avgVolume: 8500000,
    marketCap: 380000000000,
    pe: 15.6,
    eps: 10.05,
    week52High: 175.97,
    week52Low: 143.13,
    sector: 'Healthcare',
    industry: 'Drug Manufacturers—General',
    description: 'Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field worldwide.',
  },
  {
    id: 11,
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 162.45,
    previousClose: 160.89,
    change: 1.56,
    changePercent: 0.97,
    open: 161.00,
    high: 163.50,
    low: 160.50,
    volume: 9876500,
    avgVolume: 7800000,
    marketCap: 440000000000,
    pe: 28.9,
    eps: 5.62,
    week52High: 169.94,
    week52Low: 143.40,
    sector: 'Consumer Defensive',
    industry: 'Discount Stores',
    description: 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.',
  },
  {
    id: 12,
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    price: 98.34,
    previousClose: 99.87,
    change: -1.53,
    changePercent: -1.53,
    open: 99.50,
    high: 100.20,
    low: 97.80,
    volume: 15678900,
    avgVolume: 12000000,
    marketCap: 180000000000,
    pe: 45.2,
    eps: 2.17,
    week52High: 123.74,
    week52Low: 78.73,
    sector: 'Communication Services',
    industry: 'Entertainment',
    description: 'The Walt Disney Company operates as an entertainment company worldwide.',
  },
];

// Generate mock historical data for a stock
const generateHistoricalData = (symbol, days = 30) => {
  const stock = mockStocksDatabase.find(s => s.symbol === symbol);
  if (!stock) return [];

  const data = [];
  let price = stock.price;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random price movement
    const change = (Math.random() - 0.5) * stock.price * 0.03;
    price = Math.max(price + change, stock.price * 0.7);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: price - Math.random() * 2,
      high: price + Math.random() * 3,
      low: price - Math.random() * 3,
      close: price,
      volume: Math.floor(stock.avgVolume * (0.8 + Math.random() * 0.4)),
    });
  }

  // Ensure last price matches current price
  if (data.length > 0) {
    data[data.length - 1].close = stock.price;
  }

  return data;
};

/**
 * Search for stocks by symbol or name
 * 
 * Future Django endpoint: GET /api/stocks/search/?q=<query>
 * 
 * @param {string} query - Search query (symbol or company name)
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Trade.jsx, src/components/trade/StockSearchBar.jsx
 */
export const searchStocks = async (query) => {
  if (!query || query.length < 1) {
    return mockRequest([]);
  }

  const normalizedQuery = query.toLowerCase();
  const results = mockStocksDatabase.filter(stock => 
    stock.symbol.toLowerCase().includes(normalizedQuery) ||
    stock.name.toLowerCase().includes(normalizedQuery)
  ).map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    sector: stock.sector,
  }));

  return mockRequest(results);
};

/**
 * Get detailed quote for a specific stock
 * 
 * Future Django endpoint: GET /api/stocks/quote/<symbol>/
 * 
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @returns {Promise<{data: Object}>}
 * 
 * Used in: src/pages/Trade.jsx, src/components/trade/StockDetailCard.jsx
 */
export const getStockQuote = async (symbol) => {
  const stock = mockStocksDatabase.find(s => 
    s.symbol.toLowerCase() === symbol.toLowerCase()
  );

  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`);
  }

  return mockRequest(stock);
};

/**
 * Get historical price data for a stock
 * 
 * Future Django endpoint: GET /api/stocks/<symbol>/history/?period=<period>
 * 
 * @param {string} symbol - Stock symbol
 * @param {string} period - Time period ('1D', '1W', '1M', '3M', '1Y')
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/components/charts/StockChart.jsx
 */
export const getStockHistory = async (symbol, period = '1M') => {
  const daysMap = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
  };

  const days = daysMap[period] || 30;
  const history = generateHistoricalData(symbol, days);

  return mockRequest(history);
};

/**
 * Get list of all available stocks (for browsing)
 * 
 * Future Django endpoint: GET /api/stocks/
 * 
 * @returns {Promise<{data: Array<Object>}>}
 * 
 * Used in: src/pages/Trade.jsx
 */
export const getAllStocks = async () => {
  const stocks = mockStocksDatabase.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volume,
    marketCap: stock.marketCap,
    sector: stock.sector,
  }));

  return mockRequest(stocks);
};

/**
 * Get top movers (biggest gainers and losers)
 * 
 * Future Django endpoint: GET /api/stocks/movers/
 * 
 * @returns {Promise<{data: {gainers: Array, losers: Array}}>}
 * 
 * Used in: src/pages/Dashboard.jsx, src/components/dashboard/TopMovers.jsx
 */
export const getTopMovers = async () => {
  const sorted = [...mockStocksDatabase].sort((a, b) => b.changePercent - a.changePercent);
  
  const gainers = sorted.slice(0, 3).map(s => ({
    symbol: s.symbol,
    name: s.name,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
  }));

  const losers = sorted.slice(-3).reverse().map(s => ({
    symbol: s.symbol,
    name: s.name,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
  }));

  return mockRequest({ gainers, losers });
};

