import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Helper function to show toast from anywhere
let globalShowToast = null
export const showToast = (options) => {
  if (globalShowToast) {
    globalShowToast(options)
  } else {
    console.warn('ToastProvider not mounted')
  }
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = Date.now() + Math.random()
    
    const toast = {
      id,
      type,
      message,
      duration,
    }

    setToasts(prev => [...prev, toast])

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Set global function
  globalShowToast = addToast

  const value = {
    toasts,
    addToast,
    removeToast,
    showToast: addToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container Component
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Individual Toast Component
const Toast = ({ toast, onDismiss }) => {
  const { id, type, message } = toast

  const typeStyles = {
    success: {
      bg: 'bg-success-50 border-success-200',
      icon: '✓',
      iconBg: 'bg-success-500',
      text: 'text-success-800',
    },
    error: {
      bg: 'bg-danger-50 border-danger-200',
      icon: '✕',
      iconBg: 'bg-danger-500',
      text: 'text-danger-800',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: '!',
      iconBg: 'bg-amber-500',
      text: 'text-amber-800',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'i',
      iconBg: 'bg-blue-500',
      text: 'text-blue-800',
    },
  }

  const style = typeStyles[type] || typeStyles.info

  return (
    <div 
      className={`${style.bg} border rounded-lg shadow-lg p-4 pointer-events-auto animate-slide-up flex items-start gap-3`}
      role="alert"
    >
      <div className={`${style.iconBg} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {style.icon}
      </div>
      <p className={`${style.text} text-sm flex-1`}>{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default ToastProvider

