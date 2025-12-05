import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getStockHistory } from '../../api'
import Card from '../ui/Card'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const StockComparisonChart = ({ symbols = [], height = 300, showCard = true }) => {
  const [data, setData] = useState([])
  const [period, setPeriod] = useState('1M')
  const [isLoading, setIsLoading] = useState(true)

  const periods = ['1W', '1M', '3M', '1Y']

  useEffect(() => {
    const fetchData = async () => {
      if (symbols.length === 0) {
        setData([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Fetch history for all symbols
        const histories = await Promise.all(
          symbols.map(symbol => getStockHistory(symbol, period))
        )

        // Normalize data - convert to percentage change from start
        const normalizedData = []
        const baseValues = histories.map(h => h.data[0]?.close || 1)

        // Get all dates from the first symbol
        histories[0].data.forEach((item, index) => {
          const dataPoint = {
            date: item.date,
            label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          }

          symbols.forEach((symbol, symbolIndex) => {
            const value = histories[symbolIndex].data[index]?.close || 0
            const percentChange = ((value - baseValues[symbolIndex]) / baseValues[symbolIndex]) * 100
            dataPoint[symbol] = percentChange
          })

          normalizedData.push(dataPoint)
        })

        setData(normalizedData)
      } catch (error) {
        console.error('Failed to fetch comparison data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [symbols.join(','), period])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className={entry.value >= 0 ? 'text-success-400' : 'text-danger-400'}>
                {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {symbols.map((symbol, index) => (
            <span 
              key={symbol}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full text-sm"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              {symbol}
            </span>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : symbols.length === 0 ? (
        <div className="flex items-center justify-center text-gray-500" style={{ height }}>
          Select stocks to compare
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10, fill: '#6b7280' }} 
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(0)}%`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
            {/* Reference line at 0% */}
            <Line 
              type="monotone" 
              dataKey={() => 0} 
              stroke="#e5e7eb" 
              strokeDasharray="3 3"
              dot={false}
              name="Baseline"
              legendType="none"
            />
            {symbols.map((symbol, index) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                name={symbol}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  )

  if (showCard) {
    return <Card title="Performance Comparison">{content}</Card>
  }

  return content
}

export default StockComparisonChart

