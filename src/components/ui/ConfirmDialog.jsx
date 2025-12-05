import React, { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    }
    onClose()
  }

  const variantStyles = {
    danger: 'danger',
    warning: 'primary',
    primary: 'primary',
  }

  const iconStyles = {
    danger: { bg: 'bg-danger-100', color: 'text-danger-600', icon: '⚠️' },
    warning: { bg: 'bg-amber-100', color: 'text-amber-600', icon: '⚠️' },
    primary: { bg: 'bg-primary-100', color: 'text-primary-600', icon: 'ℹ️' },
  }

  const iconStyle = iconStyles[variant] || iconStyles.primary

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${iconStyle.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className="text-3xl">{iconStyle.icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variantStyles[variant]}
            className="flex-1"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Hook for easier usage
export const useConfirmDialog = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger',
  })

  const confirm = ({ title, message, onConfirm, variant = 'danger' }) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        variant,
        onConfirm: async () => {
          if (onConfirm) await onConfirm()
          resolve(true)
        },
        onCancel: () => resolve(false),
      })
    })
  }

  const close = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  const Dialog = () => (
    <ConfirmDialog
      isOpen={state.isOpen}
      onClose={close}
      onConfirm={state.onConfirm}
      title={state.title}
      message={state.message}
      variant={state.variant}
    />
  )

  return { confirm, Dialog, close }
}

export default ConfirmDialog

