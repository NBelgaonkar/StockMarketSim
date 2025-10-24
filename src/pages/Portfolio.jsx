import React, { useState } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import PortfolioTable from '../components/PortfolioTable'
import ChartCard from '../components/ChartCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Portfolio = () => {
  const { portfolio, isLoading } = usePortfolio()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')

  // Sample performance data for different timeframes
  const performanceData = {
    '1D': [
      { name: '9:30', value: 12500 },
      { name: '10:00', value: 12550 },
      { name: '10:30', value: 12520 },
      { name: '11:00', value: 12580 },
      { name: '11:30', value: 12543 }
    ],
    '1W': [
      { name: 'Mon', value: 12000 },
      { name: 'Tue', value: 12100 },
      { name: 'Wed', value: 12200 },
      { name: 'Thu', value: 12300 },
      { name: 'Fri', value: 12543 }
    ],
    '1M': [
      { name: 'Week 1', value: 10000 },
      { name: 'Week 2', value: 10500 },
      { name: 'Week 3', value: 11000 },
      { name: 'Week 4', value: 12543 }
    ],
    '1Y': [
      { name: 'Jan', value: 8000 },
      { name: 'Apr', value: 9000 },
      { name: 'Jul', value: 10000 },
      { name: 'Oct', value: 11500 },
      { name: 'Dec', value: 12543 }
    ]
  }

  const allocationData = [
    { name: 'AAPL', value: 40 },
    { name: 'GOOGL', value: 25 },
    { name: 'TSLA', value: 20 },
    { name: 'Cash', value: 15 }
  ]

  const timeframes = ['1D', '1W', '1M', '1Y']

  const handleTrade = (position, action) => {
    // Navigate to trade page with pre-selected position
    console.log(`${action} ${position.symbol}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your investments and performance</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${portfolio.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${portfolio.cash.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Available Cash</div>
          </Card>
          <Card className="text-center">
            <div className={`text-3xl font-bold mb-1 ${portfolio.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total P&L</div>
          </Card>
          <Card className="text-center">
            <div className={`text-3xl font-bold mb-1 ${portfolio.totalGainLossPercent >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Return</div>
          </Card>
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Portfolio Performance</h3>
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            <ChartCard 
              data={performanceData[selectedTimeframe]} 
              type="line" 
              height={300}
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
            <ChartCard 
              data={allocationData} 
              type="pie" 
              height={300}
            />
          </Card>
        </div>

        {/* Positions Table */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Positions</h2>
            <Button variant="primary">
              Add Position
            </Button>
          </div>
          {portfolio.positions.length > 0 ? (
            <PortfolioTable 
              positions={portfolio.positions} 
              onTrade={handleTrade}
            />
          ) : (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Positions Yet</h3>
              <p className="text-gray-600 mb-6">Start building your portfolio by making your first trade</p>
              <Button variant="primary" size="lg">
                Start Trading
              </Button>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Bought 5 shares of AAPL</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <span className="text-success-600 font-medium">+$250.00</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Sold 2 shares of GOOGL</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
              <span className="text-danger-600 font-medium">-$15.20</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Initial deposit</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
              <span className="text-primary-600 font-medium">+$10,000.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Portfolio
