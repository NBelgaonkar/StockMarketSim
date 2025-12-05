import React, { useState, useEffect } from 'react'
import { executeBuyOrder, executeSellOrder, getOrderPreview, getPositionForSymbol } from '../../api'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const TradeForm = ({ stock, onTradeComplete, initialSide = 'BUY' }) => {
  const [side, setSide] = useState(initialSide)
  const [quantity, setQuantity] = useState('')
  const [orderType, setOrderType] = useState('MARKET')
  const [limitPrice, setLimitPrice] = useState('')
  const [preview, setPreview] = useState(null)
  const [position, setPosition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch current position for this stock
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await getPositionForSymbol(stock.symbol)
        setPosition(response.data)
      } catch (error) {
        console.error('Failed to fetch position:', error)
      }
    }
    fetchPosition()
  }, [stock.symbol])

  // Get order preview when inputs change
  useEffect(() => {
    const fetchPreview = async () => {
      if (!quantity || parseInt(quantity) <= 0) {
        setPreview(null)
        return
      }

      setIsLoading(true)
      setError('')
      try {
        const response = await getOrderPreview({
          symbol: stock.symbol,
          quantity: parseInt(quantity),
          side,
          orderType,
        })
        setPreview(response.data)
      } catch (error) {
        setError(error.message)
        setPreview(null)
      } finally {
        setIsLoading(false)
      }
    }

    const timeout = setTimeout(fetchPreview, 300)
    return () => clearTimeout(timeout)
  }, [stock.symbol, quantity, side, orderType])

  const handleQuantityChange = (e) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value)
      setSuccess('')
    }
  }

  const handleExecute = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity')
      return
    }

    if (!preview?.canExecute) {
      setError(side === 'BUY' ? 'Insufficient funds' : 'Insufficient shares')
      return
    }

    setIsExecuting(true)
    setError('')
    setSuccess('')

    try {
      const orderParams = {
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        orderType,
        limitPrice: orderType === 'LIMIT' ? parseFloat(limitPrice) : null,
      }

      const response = side === 'BUY' 
        ? await executeBuyOrder(orderParams)
        : await executeSellOrder(orderParams)

      setSuccess(`Order executed successfully! ${side === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol} at $${response.data.order.price.toFixed(2)}`)
      setQuantity('')
      setPreview(null)
      
      // Refresh position
      const positionResponse = await getPositionForSymbol(stock.symbol)
      setPosition(positionResponse.data)
      
      if (onTradeComplete) {
        onTradeComplete(response.data)
      }
    } catch (error) {
      setError(error.message || 'Failed to execute order')
    } finally {
      setIsExecuting(false)
    }
  }

  const isPositive = stock.change >= 0

  return (
    <Card>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => { setSide('BUY'); setError(''); setSuccess(''); }}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            side === 'BUY'
              ? 'text-success-600 border-b-2 border-success-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => { setSide('SELL'); setError(''); setSuccess(''); }}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            side === 'SELL'
              ? 'text-danger-600 border-b-2 border-danger-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Stock Info */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700">
            {stock.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{stock.symbol}</p>
            <p className="text-sm text-gray-500">{stock.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">${stock.price.toFixed(2)}</p>
          <p className={`text-sm ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Position Info (for selling) */}
      {side === 'SELL' && position && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You own <strong>{position.quantity} shares</strong> at avg cost ${position.avgCost.toFixed(2)}
          </p>
        </div>
      )}

      {side === 'SELL' && !position && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            You don't own any shares of {stock.symbol}
          </p>
        </div>
      )}

      {/* Order Form */}
      <div className="space-y-4">
        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('MARKET')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'MARKET'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('LIMIT')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'LIMIT'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Input
            label="Quantity"
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Enter number of shares"
          />
          {side === 'BUY' && preview && (
            <p className="mt-1 text-xs text-gray-500">
              Cash available: ${preview.availableCash?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          )}
          {side === 'SELL' && position && (
            <p className="mt-1 text-xs text-gray-500">
              Max: {position.quantity} shares
            </p>
          )}
        </div>

        {/* Limit Price (only for limit orders) */}
        {orderType === 'LIMIT' && (
          <div>
            <Input
              label="Limit Price"
              type="number"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="Enter limit price"
            />
          </div>
        )}

        {/* Order Preview */}
        {preview && quantity && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Price</span>
              <span className="font-medium">${preview.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{preview.quantity} shares</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission</span>
              <span className="font-medium text-success-600">$0.00</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium">Estimated Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${preview.estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {side === 'BUY' && (
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-600">Cash After Trade</span>
                <span className={`font-medium ${preview.canExecute ? 'text-gray-900' : 'text-danger-600'}`}>
                  ${preview.remainingCash?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {side === 'SELL' && preview.estimatedGainLoss !== null && (
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-600">Est. Gain/Loss</span>
                <span className={`font-medium ${preview.estimatedGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {preview.estimatedGainLoss >= 0 ? '+' : ''}${preview.estimatedGainLoss.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700">{success}</p>
          </div>
        )}

        {/* Execute Button */}
        <Button
          variant={side === 'BUY' ? 'success' : 'danger'}
          size="lg"
          className="w-full"
          onClick={handleExecute}
          disabled={isExecuting || !quantity || (side === 'SELL' && !position) || !preview?.canExecute}
        >
          {isExecuting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            `${side === 'BUY' ? 'Buy' : 'Sell'} ${stock.symbol}`
          )}
        </Button>
      </div>
    </Card>
  )
}

export default TradeForm

