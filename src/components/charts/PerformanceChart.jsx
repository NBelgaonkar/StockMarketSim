import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getPerformanceHistory } from '../../api'

const PerformanceChart = ({ height = 300, showControls = true }) => {
  const [data, setData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('1M')
  const [isLoading, setIsLoading] = useState(true)

  const periods = ['1D', '1W', '1M', '3M', '1Y']

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await getPerformanceHistory(selectedPeriod)
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch performance data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedPeriod])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-bold">${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.label}</p>
        </div>
      )
    }
    return null
  }

  // Calculate if overall trend is positive
  const isPositive = data.length >= 2 && data[data.length - 1].value >= data[0].value
  const chartColor = isPositive ? '#16a34a' : '#dc2626'
  const gradientId = `performanceGradient-${selectedPeriod}`

  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {showControls && (
        <div className="flex justify-end mb-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={chartColor} 
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart

