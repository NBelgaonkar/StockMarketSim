import React, { useState } from 'react'
import { depositFunds } from '../../api'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000]

const AddFundsModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAmountChange = (e) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
      setError('')
    }
  }

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString())
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount)
    
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (numAmount > 1000000) {
      setError('Maximum deposit is $1,000,000')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await depositFunds({ amount: numAmount })
      
      // Reset form
      setAmount('')
      
      // Notify parent of success
      if (onSuccess) {
        onSuccess(numAmount)
      }
      
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to add funds. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setAmount('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Funds" size="sm">
      <form onSubmit={handleSubmit}>
        <p className="text-gray-600 text-sm mb-4">
          Add virtual money to your account to start trading. This is simulated — no real money involved.
        </p>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => handleQuickAmount(quickAmount)}
              className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                amount === quickAmount.toString()
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              ${quickAmount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-medium ${
                error ? 'border-danger-500' : 'border-gray-300'
              }`}
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-danger-600">{error}</p>
          )}
        </div>

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm text-success-700">
              <strong>${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> will be added to your account
            </p>
          </div>
        )}

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
            variant="success"
            className="flex-1"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Add Funds'
            )}
          </Button>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Demo mode: This is virtual money for practice trading only.
        </p>
      </form>
    </Modal>
  )
}

export default AddFundsModal

