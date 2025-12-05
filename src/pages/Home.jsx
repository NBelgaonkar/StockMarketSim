import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { usePortfolio } from '../hooks/usePortfolio'
import { mockStocks } from '../data/mockStocks'
import StockCard from '../components/StockCard'
import ChartCard from '../components/ChartCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Home = () => {
  const { user } = useUser()
  const { portfolio } = usePortfolio()

  // Sample chart data for portfolio performance
  const portfolioData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 10500 },
    { name: 'Mar', value: 11000 },
    { name: 'Apr', value: 10800 },
    { name: 'May', value: 11500 },
    { name: 'Jun', value: 12543 }
  ]

  // Sample allocation data
  const allocationData = [
    { name: 'Technology', value: 60 },
    { name: 'Healthcare', value: 20 },
    { name: 'Finance', value: 15 },
    { name: 'Other', value: 5 }
  ]

  const topStocks = mockStocks.slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to StockSim
            </h1>
            <p className="text-xl mb-8">
              Practice trading with virtual money and learn the stock market
            </p>
            {user ? (
              <div className="space-x-4">
                <Link to="/portfolio">
                  <Button variant="secondary" size="lg">
                    View Portfolio
                  </Button>
                </Link>
                <Link to="/trade">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Start Trading
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <>
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${portfolio.cash.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available Cash</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${portfolio.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </Card>
              <Card className="text-center">
                <div className={`text-2xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total P&L</div>
              </Card>
              <Card className="text-center">
                <div className={`text-2xl font-bold ${portfolio.totalGainLossPercent >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Return</div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard 
                title="Portfolio Performance" 
                data={portfolioData} 
                type="line" 
                height={300}
              />
              <ChartCard 
                title="Portfolio Allocation" 
                data={allocationData} 
                type="pie" 
                height={300}
              />
            </div>
          </>
        )}

        {/* Top Stocks Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Stocks</h2>
            <Link to="/trade">
              <Button variant="primary">
                View All Stocks
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStocks.map((stock) => (
              <StockCard 
                key={stock.id} 
                stock={stock} 
                onTrade={(stock, action) => {
                  // Navigate to trade page with pre-selected stock
                  console.log(`${action} ${stock.symbol}`)
                }}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-600">
              Access live market data and make informed trading decisions
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-semibold mb-2">Portfolio Tracking</h3>
            <p className="text-gray-600">
              Monitor your investments with detailed analytics and performance metrics
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Risk-Free Learning</h3>
            <p className="text-gray-600">
              Practice trading strategies without risking real money
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home
