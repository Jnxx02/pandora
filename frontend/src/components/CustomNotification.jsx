import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomNotification = ({ notification, setNotification }) => {
  const { show, type, message } = notification;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          borderColor: 'border-green-600',
          iconColor: 'text-green-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          borderColor: 'border-red-600',
          iconColor: 'text-red-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          borderColor: 'border-yellow-600',
          iconColor: 'text-yellow-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500',
          borderColor: 'border-blue-600',
          iconColor: 'text-blue-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          borderColor: 'border-gray-600',
          iconColor: 'text-gray-600',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getNotificationStyles();

  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, setNotification]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bgColor} text-white rounded-lg shadow-lg border ${styles.borderColor} overflow-hidden`}
        >
          <div className="flex items-center p-4">
            <div className={`flex-shrink-0 ${styles.iconColor} mr-3`}>
              {styles.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-1 bg-white/20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomNotification; 