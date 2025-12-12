import React, { useState, useEffect } from 'react'
import { getStockHistory } from '../../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import Card from '../ui/Card'

const StockDetailCard = ({ stock, onClose }) => {
  const [chartData, setChartData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('1M')
  const [isLoadingChart, setIsLoadingChart] = useState(true)

  const periods = ['1D', '1W', '1M', '3M', '1Y']

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingChart(true)
      try {
        const response = await getStockHistory(stock.symbol, selectedPeriod)
        const formattedData = response.data.map(item => ({
          ...item,
          label: selectedPeriod === '1D' 
            ? item.date.split('T')[0] 
            : new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }))
        setChartData(formattedData)
      } catch (error) {
        console.error('Failed to fetch stock history:', error)
      } finally {
        setIsLoadingChart(false)
      }
    }
    fetchHistory()
  }, [stock.symbol, selectedPeriod])

  const isPositive = stock.change >= 0
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'
  const bgColor = isPositive ? 'bg-success-50' : 'bg-danger-50'
  const chartColor = isPositive ? '#16a34a' : '#dc2626'

  const formatMarketCap = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">${payload[0].value.toFixed(2)}</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.label}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700">
          {stock.symbol.slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${bgColor} ${changeColor}`}>
              {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-gray-600">{stock.name}</p>
          <p className="text-sm text-gray-500">{stock.sector} • {stock.industry}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} today
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Price Chart</h3>
          <div className="flex gap-1">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-48 bg-gray-50 rounded-lg p-2">
          {isLoadingChart ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={stock.previousClose} 
                  stroke="#9ca3af" 
                  strokeDasharray="3 3" 
                />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke={chartColor} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 uppercase">Open</p>
          <p className="font-semibold text-gray-900">${stock.open?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">High</p>
          <p className="font-semibold text-gray-900">${stock.high?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Low</p>
          <p className="font-semibold text-gray-900">${stock.low?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Prev Close</p>
          <p className="font-semibold text-gray-900">${stock.previousClose?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Volume</p>
          <p className="font-semibold text-gray-900">{stock.volume?.toLocaleString() || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Avg Volume</p>
          <p className="font-semibold text-gray-900">{stock.avgVolume?.toLocaleString() || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Market Cap</p>
          <p className="font-semibold text-gray-900">{formatMarketCap(stock.marketCap)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">P/E Ratio</p>
          <p className="font-semibold text-gray-900">{stock.pe?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">52W High</p>
          <p className="font-semibold text-gray-900">${stock.week52High?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">52W Low</p>
          <p className="font-semibold text-gray-900">${stock.week52Low?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">EPS</p>
          <p className="font-semibold text-gray-900">${stock.eps?.toFixed(2) || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Sector</p>
          <p className="font-semibold text-gray-900 truncate">{stock.sector || '-'}</p>
        </div>
      </div>

      {/* Description */}
      {stock.description && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase mb-2">About</p>
          <p className="text-sm text-gray-700 leading-relaxed">{stock.description}</p>
        </div>
      )}
    </Card>
  )
}

export default StockDetailCard

