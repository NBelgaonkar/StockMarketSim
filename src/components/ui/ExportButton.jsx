import React, { useState } from 'react'
import Button from './Button'

const ExportButton = ({ 
  data, 
  filename = 'export.csv', 
  columns, // Optional: specify columns and headers { key: string, header: string }[]
  className = '',
  variant = 'outline',
  size = 'sm',
}) => {
  const [isExporting, setIsExporting] = useState(false)

  const convertToCSV = (data, columns) => {
    if (!data || data.length === 0) return ''

    // Determine columns to export
    let headers, keys
    if (columns) {
      headers = columns.map(c => c.header)
      keys = columns.map(c => c.key)
    } else {
      // Auto-detect from first row
      keys = Object.keys(data[0])
      headers = keys.map(key => 
        key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
      )
    }

    // Create CSV content
    const csvRows = []
    
    // Header row
    csvRows.push(headers.map(h => `"${h}"`).join(','))

    // Data rows
    data.forEach(row => {
      const values = keys.map(key => {
        let value = row[key]
        
        // Handle different types
        if (value === null || value === undefined) {
          value = ''
        } else if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else if (typeof value === 'number') {
          value = value.toString()
        }
        
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  const handleExport = () => {
    if (!data || data.length === 0) {
      console.warn('No data to export')
      return
    }

    setIsExporting(true)

    try {
      const csv = convertToCSV(data, columns)
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      className={className}
    >
      {isExporting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Exporting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </span>
      )}
    </Button>
  )
}

export default ExportButton

