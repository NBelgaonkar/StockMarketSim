import { useState, useEffect } from 'react'
import { mockPortfolio } from '../data/mockStocks'

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(mockPortfolio)
  const [isLoading, setIsLoading] = useState(false)

  const addPosition = (symbol, quantity, price) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPortfolio(prev => {
        const existingPosition = prev.positions.find(p => p.symbol === symbol)
        
        if (existingPosition) {
          // Update existing position
          const newQuantity = existingPosition.quantity + quantity
          const newAvgCost = ((existingPosition.avgCost * existingPosition.quantity) + (price * quantity)) / newQuantity
          
          return {
            ...prev,
            positions: prev.positions.map(p => 
              p.symbol === symbol 
                ? { ...p, quantity: newQuantity, avgCost: newAvgCost }
                : p
            ),
            cash: prev.cash - (price * quantity)
          }
        } else {
          // Add new position
          const newPosition = {
            id: Date.now(),
            symbol,
            name: symbol, // In real app, would fetch from API
            quantity,
            avgCost: price,
            currentPrice: price,
            marketValue: price * quantity,
            gainLoss: 0,
            gainLossPercent: 0
          }
          
          return {
            ...prev,
            positions: [...prev.positions, newPosition],
            cash: prev.cash - (price * quantity)
          }
        }
      })
      setIsLoading(false)
    }, 1000)
  }

  const removePosition = (symbol, quantity) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPortfolio(prev => {
        const position = prev.positions.find(p => p.symbol === symbol)
        if (!position) return prev

        const newQuantity = position.quantity - quantity
        const saleValue = position.currentPrice * quantity

        if (newQuantity <= 0) {
          // Remove position entirely
          return {
            ...prev,
            positions: prev.positions.filter(p => p.symbol !== symbol),
            cash: prev.cash + saleValue
          }
        } else {
          // Update quantity
          return {
            ...prev,
            positions: prev.positions.map(p => 
              p.symbol === symbol 
                ? { ...p, quantity: newQuantity }
                : p
            ),
            cash: prev.cash + saleValue
          }
        }
      })
      setIsLoading(false)
    }, 1000)
  }

  return {
    portfolio,
    isLoading,
    addPosition,
    removePosition
  }
}
