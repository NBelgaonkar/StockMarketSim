import React, { useState, useEffect } from 'react'
import { getAlerts, deleteAlert } from '../../api'
import { showToast } from '../../context/ToastContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ConfirmDialog from '../ui/ConfirmDialog'

const AlertsList = ({ showTitle = true }) => {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, alertId: null })

  const fetchAlerts = async () => {
    try {
      const response = await getAlerts()
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleDelete = async (alertId) => {
    try {
      await deleteAlert(alertId)
      setAlerts(prev => prev.filter(a => a.id !== alertId))
      showToast({ type: 'success', message: 'Alert deleted' })
    } catch (error) {
      showToast({ type: 'error', message: error.message })
    }
    setDeleteConfirm({ isOpen: false, alertId: null })
  }

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="🔔"
          title="No price alerts"
          description="Set alerts to get notified when stocks reach your target price"
          size="sm"
        />
      </Card>
    )
  }

  return (
    <>
      <Card padding="p-0">
        {showTitle && (
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Price Alerts</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    alert.isTriggered 
                      ? 'bg-success-100 text-success-600' 
                      : alert.direction === 'above'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                  }`}>
                    {alert.isTriggered ? '✓' : alert.direction === 'above' ? '↑' : '↓'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{alert.symbol}</span>
                      {alert.isTriggered && (
                        <span className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full">
                          Triggered
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Alert when price goes {alert.direction}{' '}
                      <span className="font-medium">${alert.targetPrice.toFixed(2)}</span>
                    </p>
                    {alert.note && (
                      <p className="text-xs text-gray-500 mt-1">"{alert.note}"</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${alert.currentPrice.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      alert.difference >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {alert.difference >= 0 ? '+' : ''}{alert.differencePercent.toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, alertId: alert.id })}
                    className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, alertId: null })}
        onConfirm={() => handleDelete(deleteConfirm.alertId)}
        title="Delete Alert"
        message="Are you sure you want to delete this price alert?"
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  )
}

export default AlertsList

