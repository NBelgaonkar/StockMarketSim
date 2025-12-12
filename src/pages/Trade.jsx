import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllStocks, getStockQuote } from '../api'
import PageHeader from '../components/layout/PageHeader'
import StockSearchBar from '../components/trade/StockSearchBar'
import StockDetailCard from '../components/trade/StockDetailCard'
import TradeForm from '../components/trade/TradeForm'
import StockCard from '../components/StockCard'
import Card from '../components/ui/Card'

const Trade = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedStock, setSelectedStock] = useState(null)
  const [allStocks, setAllStocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStock, setLoadingStock] = useState(false)

  // Check for symbol in URL query params
  useEffect(() => {
    const symbolParam = searchParams.get('symbol')
    if (symbolParam) {
      handleSelectSymbol(symbolParam)
    }
  }, [])

  // Fetch all stocks for browsing
  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true)
      try {
        const response = await getAllStocks()
        setAllStocks(response.data)
      } catch (error) {
        console.error('Failed to fetch stocks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStocks()
  }, [])

  const handleSelectSymbol = async (symbol) => {
    setLoadingStock(true)
    try {
      const response = await getStockQuote(symbol)
      setSelectedStock(response.data)
      setSearchParams({ symbol })
    } catch (error) {
      console.error('Failed to fetch stock:', error)
    } finally {
      setLoadingStock(false)
    }
  }

  const handleSelectStock = (stock) => {
    handleSelectSymbol(stock.symbol)
  }

  const handleCloseDetail = () => {
    setSelectedStock(null)
    setSearchParams({})
  }

  const handleTradeFromCard = (stock, action) => {
    handleSelectSymbol(stock.symbol)
  }

  const handleTradeComplete = (orderResult) => {
    // Refresh stock data after trade
    if (selectedStock) {
      handleSelectSymbol(selectedStock.symbol)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Trade" 
          subtitle="Search for stocks and execute trades"
        />

        {/* Search Bar */}
        <div className="mb-8">
          <StockSearchBar 
            onSelectStock={handleSelectStock}
            placeholder="Search for a stock by symbol or company name..."
          />
        </div>

        {/* Selected Stock View */}
        {loadingStock && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        )}

        {selectedStock && !loadingStock && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <StockDetailCard 
                stock={selectedStock} 
                onClose={handleCloseDetail}
              />
            </div>
            <div>
              <TradeForm 
                stock={selectedStock}
                onTradeComplete={handleTradeComplete}
              />
            </div>
          </div>
        )}

        {/* Stock Browser */}
        {!selectedStock && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Browse Stocks</h2>
              <span className="text-sm text-gray-500">{allStocks.length} stocks available</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allStocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onTrade={handleTradeFromCard}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Trade

