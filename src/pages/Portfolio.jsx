import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPortfolioSummary, getPositions } from '../api'
import PageHeader from '../components/layout/PageHeader'
import PerformanceChart from '../components/charts/PerformanceChart'
import AllocationChart from '../components/charts/AllocationChart'
import HoldingsTable from '../components/portfolio/HoldingsTable'
import AddFundsModal from '../components/wallet/AddFundsModal'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'

const Portfolio = () => {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [allocationView, setAllocationView] = useState('ticker') // 'ticker' | 'sector'
  const [showAddFunds, setShowAddFunds] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [summaryResponse, positionsResponse] = await Promise.all([
        getPortfolioSummary(),
        getPositions(),
      ])
      setSummary(summaryResponse.data)
      setPositions(positionsResponse.data)
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTrade = (position, action) => {
    navigate(`/trade?symbol=${position.symbol}`)
  }

  const handleAddFundsSuccess = (amount) => {
    // Refresh data after adding funds
    fetchData()
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

  const needsFunding = summary && summary.totalValue === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Portfolio" 
          subtitle="Track your investments and performance"
        >
          <Button variant="success" onClick={() => setShowAddFunds(true)}>
            + Add Funds
          </Button>
          <Button variant="primary" onClick={() => navigate('/trade')}>
            Trade
          </Button>
        </PageHeader>

        {/* Empty State - Needs Funding */}
        {needsFunding && (
          <div className="mb-8">
            <Card className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">🏦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Portfolio</h2>
                <p className="text-gray-600 mb-6">
                  Your account is set up and ready! Add virtual funds to start building your investment portfolio.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="success" size="lg" onClick={() => setShowAddFunds(true)}>
                    Add Funds to Get Started
                  </Button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  This is virtual money for practice trading — no real payment required.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Summary Cards - Always Show */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Value"
              value={`$${summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change={summary.initialDeposit > 0 ? `${summary.overallReturnPercent >= 0 ? '+' : ''}${summary.overallReturnPercent.toFixed(2)}%` : undefined}
              changeLabel={summary.initialDeposit > 0 ? "overall" : undefined}
              trend={summary.overallReturn >= 0 ? 'up' : 'down'}
            />
            <StatCard
              label="Available Cash"
              value={`$${summary.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
            <StatCard
              label="Invested Value"
              value={`$${summary.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
            <StatCard
              label="Total Gain/Loss"
              value={summary.costBasis > 0 
                ? `${summary.totalGainLoss >= 0 ? '+' : ''}$${Math.abs(summary.totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '$0.00'
              }
              change={summary.costBasis > 0 ? `${summary.totalGainLossPercent >= 0 ? '+' : ''}${summary.totalGainLossPercent.toFixed(2)}%` : undefined}
              trend={summary.totalGainLoss >= 0 ? 'up' : 'down'}
            />
          </div>
        )}

        {/* Charts Section - Only show if user has activity */}
        {summary && summary.totalValue > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Performance History">
              <PerformanceChart height={280} showControls={true} />
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Allocation</h3>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAllocationView('ticker')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      allocationView === 'ticker'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    By Ticker
                  </button>
                  <button
                    onClick={() => setAllocationView('sector')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      allocationView === 'sector'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    By Sector
                  </button>
                </div>
              </div>
              <AllocationChart height={240} groupBy={allocationView} />
            </Card>
          </div>
        )}

        {/* Holdings Table */}
        {positions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Holdings</h2>
              <span className="text-sm text-gray-500">
                {positions.length} position{positions.length !== 1 ? 's' : ''}
              </span>
            </div>

            <HoldingsTable 
              positions={positions}
              onTrade={handleTrade}
            />
          </div>
        )}

        {/* No Holdings Yet - But Has Cash */}
        {positions.length === 0 && summary && summary.cash > 0 && (
          <Card className="text-center py-12 mb-8">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Invest</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              You have ${summary.cash.toLocaleString('en-US', { minimumFractionDigits: 2 })} available. 
              Start building your portfolio by buying your first stock!
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/trade')}>
              Browse Stocks to Buy
            </Button>
          </Card>
        )}

        {/* Cash Card - Show if user has holdings */}
        {positions.length > 0 && summary && (
          <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Available Cash</p>
                <p className="text-3xl font-bold">
                  ${summary.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Ready to invest in your next opportunity
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-white hover:bg-gray-700"
                  onClick={() => setShowAddFunds(true)}
                >
                  Add More
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/trade')}
                >
                  Invest Now
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal 
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        onSuccess={handleAddFundsSuccess}
      />
    </div>
  )
}

export default Portfolio
