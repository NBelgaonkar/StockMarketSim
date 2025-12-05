import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWatchlist, removeFromWatchlist } from '../api'
import { showToast } from '../context/ToastContext'
import PageHeader from '../components/layout/PageHeader'
import AlertsList from '../components/alerts/AlertsList'
import PriceAlertModal from '../components/alerts/PriceAlertModal'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [alertModal, setAlertModal] = useState({ isOpen: false, stock: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, symbol: null })

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
    setDeleteConfirm({ isOpen: false, symbol: null })
  }

  const handleSetAlert = (stock) => {
    setAlertModal({
      isOpen: true,
      stock: {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Watchlist" 
          subtitle="Track stocks you're interested in"
        >
          <Link to="/trade">
            <Button variant="primary">+ Add Stocks</Button>
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Watchlist */}
          <div className="lg:col-span-2">
            {watchlist.length === 0 ? (
              <Card className="py-16">
                <EmptyState
                  icon="⭐"
                  title="Your watchlist is empty"
                  description="Add stocks to your watchlist to track their prices and set alerts"
                  action={{ label: "Browse Stocks", to: "/trade" }}
                />
              </Card>
            ) : (
              <Card padding="p-0">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    Watching {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {watchlist.map((stock) => {
                    const isPositive = stock.change >= 0
                    return (
                      <div 
                        key={stock.symbol}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-700">
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <Link 
                                to={`/trade?symbol=${stock.symbol}`}
                                className="font-semibold text-gray-900 hover:text-primary-600"
                              >
                                {stock.symbol}
                              </Link>
                              <p className="text-sm text-gray-500">{stock.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">${stock.price.toFixed(2)}</p>
                              <p className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSetAlert(stock)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Set price alert"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </button>
                              <Link
                                to={`/trade?symbol=${stock.symbol}`}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Trade"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                              </Link>
                              <button
                                onClick={() => setDeleteConfirm({ isOpen: true, symbol: stock.symbol })}
                                className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                title="Remove from watchlist"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {stock.hasAlert && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            Alert set at ${stock.alertPrice?.toFixed(2)} ({stock.alertDirection})
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Alerts Sidebar */}
          <div>
            <AlertsList showTitle={true} />
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.stock && (
        <PriceAlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ isOpen: false, stock: null })}
          symbol={alertModal.stock.symbol}
          stockName={alertModal.stock.name}
          currentPrice={alertModal.stock.price}
          onSuccess={fetchWatchlist}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, symbol: null })}
        onConfirm={() => handleRemove(deleteConfirm.symbol)}
        title="Remove from Watchlist"
        message={`Are you sure you want to remove ${deleteConfirm.symbol} from your watchlist?`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  )
}

export default Watchlist

