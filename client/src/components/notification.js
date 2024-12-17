import React, { useEffect } from 'react'

export const Notification = ({ message, onClose, className }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${className} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  )
}
