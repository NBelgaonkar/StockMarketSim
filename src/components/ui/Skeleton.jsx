import React from 'react'

const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  const variantClasses = {
    text: 'h-4',
    title: 'h-8',
    card: 'h-32',
    circle: 'rounded-full',
    button: 'h-10',
  }

  const style = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
      style={style}
    />
  )
}

// Composite skeletons
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Skeleton className="w-1/3 mb-4" variant="text" />
    <Skeleton className="w-2/3 mb-2" variant="title" />
    <Skeleton className="w-1/2" variant="text" />
  </div>
)

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="w-full" variant="text" />
      </td>
    ))}
  </tr>
)

export const ChartSkeleton = ({ height = 300 }) => (
  <div className="bg-gray-50 rounded-lg flex items-center justify-center" style={{ height }}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-500">Loading chart...</p>
    </div>
  </div>
)

export default Skeleton

