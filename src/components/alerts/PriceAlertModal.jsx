import React, { useState } from 'react'
import { createAlert } from '../../api'
import { showToast } from '../../context/ToastContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

const PriceAlertModal = ({ isOpen, onClose, symbol, stockName, currentPrice, onSuccess }) => {
  const [targetPrice, setTargetPrice] = useState('')
  const [direction, setDirection] = useState('above')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const price = parseFloat(targetPrice)
    if (!price || price <= 0) {
      setError('Please enter a valid price')
      return
    }

    // Validate direction makes sense
    if (direction === 'above' && price <= currentPrice) {
      setError('Target price should be above current price for "above" alerts')
      return
    }
    if (direction === 'below' && price >= currentPrice) {
      setError('Target price should be below current price for "below" alerts')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await createAlert({
        symbol,
        targetPrice: price,
        direction,
        note,
      })
      
      showToast({ 
        type: 'success', 
        message: `Alert set for ${symbol} when price goes ${direction} $${price.toFixed(2)}` 
      })
      
      if (onSuccess) onSuccess()
      handleClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTargetPrice('')
    setDirection('above')
    setNote('')
    setError('')
    onClose()
  }

  const percentDiff = targetPrice 
    ? (((parseFloat(targetPrice) - currentPrice) / currentPrice) * 100).toFixed(2)
    : null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Set Price Alert" size="sm">
      <form onSubmit={handleSubmit}>
        {/* Stock Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700">
            {symbol?.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{symbol}</p>
            <p className="text-sm text-gray-500">{stockName}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-semibold text-gray-900">${currentPrice?.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Current price</p>
          </div>
        </div>

        {/* Direction */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alert me when price goes
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDirection('above')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                direction === 'above'
                  ? 'bg-success-100 text-success-700 border-2 border-success-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              <span>↑</span> Above
            </button>
            <button
              type="button"
              onClick={() => setDirection('below')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                direction === 'below'
                  ? 'bg-danger-100 text-danger-700 border-2 border-danger-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              <span>↓</span> Below
            </button>
          </div>
        </div>

        {/* Target Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => {
                setTargetPrice(e.target.value)
                setError('')
              }}
              placeholder={currentPrice?.toFixed(2)}
              className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                error ? 'border-danger-500' : 'border-gray-300'
              }`}
            />
          </div>
          {targetPrice && percentDiff && (
            <p className={`mt-1 text-sm ${
              parseFloat(percentDiff) >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {parseFloat(percentDiff) >= 0 ? '+' : ''}{percentDiff}% from current price
            </p>
          )}
          {error && (
            <p className="mt-1 text-sm text-danger-600">{error}</p>
          )}
        </div>

        {/* Note (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Buy opportunity"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={100}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading || !targetPrice}
          >
            {isLoading ? 'Creating...' : 'Create Alert'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PriceAlertModal

