import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTopMovers } from '../../api'
import Card from '../ui/Card'

const TopMovers = () => {
  const [movers, setMovers] = useState({ gainers: [], losers: [] })
  const [activeTab, setActiveTab] = useState('gainers')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovers = async () => {
      setIsLoading(true)
      try {
        const response = await getTopMovers()
        setMovers(response.data)
      } catch (error) {
        console.error('Failed to fetch top movers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovers()
  }, [])

  const currentList = activeTab === 'gainers' ? movers.gainers : movers.losers

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="p-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'gainers'
              ? 'text-success-600 border-b-2 border-success-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'losers'
              ? 'text-danger-600 border-b-2 border-danger-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Losers
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {currentList.map((stock) => {
          const isPositive = stock.change >= 0
          return (
            <Link
              key={stock.symbol}
              to={`/trade?symbol=${stock.symbol}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${stock.price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* View All Link */}
      <div className="p-3 border-t border-gray-200">
        <Link 
          to="/trade"
          className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View All Stocks →
        </Link>
      </div>
    </Card>
  )
}

export default TopMovers

