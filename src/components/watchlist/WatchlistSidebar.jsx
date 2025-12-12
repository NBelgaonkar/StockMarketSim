import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWatchlist, removeFromWatchlist } from '../../api'
import { showToast } from '../../context/ToastContext'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'

const WatchlistSidebar = ({ maxItems = 5 }) => {
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchWatchlist = async () => {
    try {
      const response = await getWatchlist()
      setWatchlist(response.data)
    } catch (error) {
      console.error('Failed to fetch watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist({ symbol })
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol))
      showToast({ type: 'success', message: `${symbol} removed from watchlist` })
    } catch (error) {
      showToast({ type: 'error', message: error.message })
    }
  }

  if (isLoading) {
    return (
      <Card padding="p-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Watchlist</h3>
        </div>
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    )
  }

  const displayItems = watchlist.slice(0, maxItems)

  return (
    <Card padding="p-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Watchlist</h3>
        {watchlist.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {watchlist.length}
          </span>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon="⭐"
            title="No stocks watched"
            description="Add stocks to track their performance"
            size="sm"
          />
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {displayItems.map(item => (
              <Link
                key={item.symbol}
                to={`/trade?symbol=${item.symbol}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700">
                    {item.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.symbol}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[100px]">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${
                      item.change >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(item.symbol)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-danger-600 transition-all"
                    title="Remove from watchlist"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {watchlist.length > maxItems && (
            <div className="p-3 border-t border-gray-200">
              <Link 
                to="/watchlist"
                className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All ({watchlist.length}) →
              </Link>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export default WatchlistSidebar

