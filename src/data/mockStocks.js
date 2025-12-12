export const mockStocks = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: 45678900,
    marketCap: 2750000000000,
    sector: 'Technology'
  },
  {
    id: 2,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.86,
    volume: 23456700,
    marketCap: 1800000000000,
    sector: 'Technology'
  },
  {
    id: 3,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    volume: 34567800,
    marketCap: 2800000000000,
    sector: 'Technology'
  },
  {
    id: 4,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 155.23,
    change: -0.87,
    changePercent: -0.56,
    volume: 45678900,
    marketCap: 1600000000000,
    sector: 'Consumer Discretionary'
  },
  {
    id: 5,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: 12.34,
    changePercent: 5.22,
    volume: 78901200,
    marketCap: 780000000000,
    sector: 'Automotive'
  },
  {
    id: 6,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.23,
    change: 23.45,
    changePercent: 2.76,
    volume: 56789000,
    marketCap: 2200000000000,
    sector: 'Technology'
  },
  {
    id: 7,
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 485.67,
    change: -8.90,
    changePercent: -1.80,
    volume: 34567800,
    marketCap: 1200000000000,
    sector: 'Technology'
  },
  {
    id: 8,
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 178.34,
    change: 1.23,
    changePercent: 0.69,
    volume: 23456700,
    marketCap: 520000000000,
    sector: 'Financial Services'
  }
]

export const mockPortfolio = {
  cash: 10000.00,
  totalValue: 12543.67,
  totalGainLoss: 2543.67,
  totalGainLossPercent: 25.44,
  positions: [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avgCost: 150.00,
      currentPrice: 175.43,
      marketValue: 1754.30,
      gainLoss: 254.30,
      gainLossPercent: 16.95
    },
    {
      id: 2,
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      quantity: 5,
      avgCost: 140.00,
      currentPrice: 142.56,
      marketValue: 712.80,
      gainLoss: 12.80,
      gainLossPercent: 1.83
    },
    {
      id: 3,
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 3,
      avgCost: 200.00,
      currentPrice: 248.42,
      marketValue: 745.26,
      gainLoss: 145.26,
      gainLossPercent: 24.21
    }
  ]
}

export const mockOrders = [
  {
    id: 1,
    symbol: 'AAPL',
    side: 'BUY',
    type: 'MARKET',
    quantity: 5,
    price: 175.43,
    status: 'FILLED',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    symbol: 'GOOGL',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 2,
    price: 145.00,
    status: 'PENDING',
    timestamp: '2024-01-15T11:15:00Z'
  }
]
