import React from 'react'
import Card from './ui/Card'

const StockCard = ({ stock, onTrade }) => {
  const isPositive = stock.change >= 0
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'
  const bgColor = isPositive ? 'bg-success-50' : 'bg-danger-50'

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600">{stock.name}</p>
          <p className="text-xs text-gray-500">{stock.sector}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${changeColor}`}>
            <span className="mr-1">{isPositive ? '↗' : '↘'}</span>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Volume:</span>
          <span className="ml-2 font-medium">{stock.volume.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-500">Market Cap:</span>
          <span className="ml-2 font-medium">${(stock.marketCap / 1e9).toFixed(1)}B</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onTrade(stock, 'BUY')}
          className="flex-1 bg-success-600 hover:bg-success-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Buy
        </button>
        <button
          onClick={() => onTrade(stock, 'SELL')}
          className="flex-1 bg-danger-600 hover:bg-danger-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Sell
        </button>
      </div>
    </Card>
  )
}

export default StockCard
