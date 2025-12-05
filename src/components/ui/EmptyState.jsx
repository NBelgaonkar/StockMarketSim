import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nothing here yet',
  description = '',
  action = null, // { label: string, to?: string, onClick?: function }
  secondaryAction = null,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      container: 'py-8',
      icon: 'text-4xl mb-3',
      title: 'text-lg mb-1',
      description: 'text-sm mb-4',
    },
    md: {
      container: 'py-12',
      icon: 'text-5xl mb-4',
      title: 'text-xl mb-2',
      description: 'text-base mb-6',
    },
    lg: {
      container: 'py-16',
      icon: 'text-6xl mb-6',
      title: 'text-2xl mb-3',
      description: 'text-lg mb-8',
    },
  }

  const styles = sizeStyles[size] || sizeStyles.md

  const renderAction = (actionConfig, isPrimary = true) => {
    if (!actionConfig) return null

    const ButtonComponent = (
      <Button
        variant={isPrimary ? 'primary' : 'outline'}
        size={size === 'lg' ? 'lg' : 'md'}
        onClick={actionConfig.onClick}
      >
        {actionConfig.label}
      </Button>
    )

    if (actionConfig.to) {
      return <Link to={actionConfig.to}>{ButtonComponent}</Link>
    }

    return ButtonComponent
  }

  return (
    <div className={`text-center ${styles.container} ${className}`}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={`font-semibold text-gray-900 ${styles.title}`}>{title}</h3>
      {description && (
        <p className={`text-gray-600 max-w-sm mx-auto ${styles.description}`}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {renderAction(action, true)}
          {renderAction(secondaryAction, false)}
        </div>
      )}
    </div>
  )
}

export default EmptyState

