import React from 'react'

const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  padding = 'p-6',
  ...props 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${padding} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
