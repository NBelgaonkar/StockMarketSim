import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getPortfolioSummary } from '../api'
import PageHeader from '../components/layout/PageHeader'
import PerformanceChart from '../components/charts/PerformanceChart'
import AllocationChart from '../components/charts/AllocationChart'
import TopMovers from '../components/dashboard/TopMovers'
import RecentActivity from '../components/dashboard/RecentActivity'
import AddFundsModal from '../components/wallet/AddFundsModal'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Button from '../components/ui/Button'

const Dashboard = () => {
  const { user } = useUser()
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)

  const fetchSummary = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await getPortfolioSummary()
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch portfolio summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [user])

  const handleAddFundsSuccess = (amount) => {
    // Refresh the summary after adding funds
    fetchSummary()
  }

  // Landing page for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Learn to Trade
              <span className="block text-primary-400">Without the Risk</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Practice stock trading with virtual money. Build your skills and confidence before investing real money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <button className="w-full sm:w-auto px-8 py-3 text-lg font-medium rounded-lg border border-slate-500 text-white bg-transparent hover:bg-slate-700 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <p className="text-amber-200 text-sm">
              <strong>Note:</strong> You must log in or create an account to access trading, portfolio, and activity features.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sign Up</h3>
              <p className="text-slate-400 text-sm">
                Create your free account in seconds
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 text-center">
              <div className="w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Add Funds</h3>
              <p className="text-slate-400 text-sm">
                Deposit virtual money to your account
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trade</h3>
              <p className="text-slate-400 text-sm">
                Buy and sell stocks with real market data
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                4️⃣
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn</h3>
              <p className="text-slate-400 text-sm">
                Track your performance and improve
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
              <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center text-3xl mb-6">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real Market Data</h3>
              <p className="text-slate-400">
                Trade with realistic stock prices and market conditions to simulate the real trading experience.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
              <div className="w-14 h-14 bg-success-500/20 rounded-xl flex items-center justify-center text-3xl mb-6">
                💼
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Track Performance</h3>
              <p className="text-slate-400">
                Monitor your portfolio with detailed analytics, charts, and performance metrics.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Zero Risk</h3>
              <p className="text-slate-400">
                Learn trading strategies and test your theories without risking any real money.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to start your trading journey?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Join thousands of students learning to invest with StockSim's risk-free platform.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="px-8">
                Get Started Now — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard for logged-in users
  const needsFunding = summary && summary.totalValue === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title={`Welcome back, ${user.firstName || user.name || 'Trader'}!`}
          subtitle="Here's how your portfolio is performing today"
        >
          <Button variant="success" onClick={() => setShowAddFunds(true)}>
            + Add Funds
          </Button>
          <Link to="/trade">
            <Button variant="primary">Trade Now</Button>
          </Link>
        </PageHeader>

        {/* New User - Needs Funding Banner */}
        {needsFunding && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                  💰
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Get Started with Virtual Money</h3>
                  <p className="text-amber-700 text-sm">
                    Add funds to your account to start trading. This is simulated money — no real payment required!
                  </p>
                </div>
              </div>
              <Button variant="success" size="lg" onClick={() => setShowAddFunds(true)}>
                Add Funds to Start
              </Button>
            </div>
          </div>
        )}

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </Card>
            ))
          ) : summary && (
            <>
              <StatCard
                label="Total Portfolio Value"
                value={`$${summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={summary.initialDeposit > 0 ? `${summary.overallReturnPercent >= 0 ? '+' : ''}${summary.overallReturnPercent.toFixed(2)}%` : undefined}
                changeLabel={summary.initialDeposit > 0 ? "all time" : undefined}
                trend={summary.overallReturn >= 0 ? 'up' : 'down'}
                icon="💰"
              />
              <StatCard
                label="Today's Change"
                value={`${summary.todayChange >= 0 ? '+' : ''}$${Math.abs(summary.todayChange).toFixed(2)}`}
                trend={summary.todayChange >= 0 ? 'up' : 'down'}
                icon="📊"
              />
              <StatCard
                label="Available Cash"
                value={`$${summary.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon="💵"
              />
              <StatCard
                label="Total Positions"
                value={summary.positionCount.toString()}
                changeLabel="stocks"
                icon="📈"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Performance Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Portfolio Performance">
              {summary && summary.totalValue > 0 ? (
                <PerformanceChart height={320} showControls={true} />
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-500">Add funds and make trades to see your performance</p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Portfolio Allocation">
              {summary && summary.positionCount > 0 ? (
                <AllocationChart height={280} groupBy="ticker" />
              ) : (
                <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-gray-500">Your allocation will appear here after your first trade</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            {/* Quick Add Funds Card */}
            {summary && summary.cash < 1000 && (
              <Card className="bg-gradient-to-br from-success-50 to-emerald-50 border border-success-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-success-900 mb-1">Add More Funds</h4>
                    <p className="text-sm text-success-700 mb-3">
                      {summary.cash === 0 
                        ? "Deposit virtual money to start trading"
                        : `You have $${summary.cash.toFixed(2)} available`
                      }
                    </p>
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowAddFunds(true)}
                    >
                      Add Funds
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <TopMovers />
            <RecentActivity limit={5} />

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Link to="/trade" className="block">
                  <Button variant="primary" className="w-full justify-between">
                    <span>Buy Stocks</span>
                    <span>→</span>
                  </Button>
                </Link>
                <Link to="/portfolio" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span>View Portfolio</span>
                    <span>→</span>
                  </Button>
                </Link>
                <Link to="/activity" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Transaction History</span>
                    <span>→</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Trading Tip</h4>
                  <p className="text-sm text-amber-800">
                    Diversify your portfolio across different sectors to reduce risk. Don't put all your eggs in one basket!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
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

export default Dashboard
