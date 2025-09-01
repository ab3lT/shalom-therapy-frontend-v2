import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000,
  position = 'top-right'
}) => {
  // Auto-close the notification after the specified duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Define styles based on notification type
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  };

  // Define positions
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const { bg, border, text, icon } = typeStyles[type];
  const positionClass = positionStyles[position];

  return (
    <div className={`fixed ${positionClass} z-50 max-w-sm w-full`}>
      <div className={`${bg} ${border} ${text} border rounded-lg shadow-lg overflow-hidden`}>
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`${text} hover:${text.replace('800', '900')} focus:outline-none`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {duration && (
          <div className="w-full bg-gray-200 h-1">
            <div 
              className={`h-full ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ 
                animation: `progress ${duration}ms linear forwards`,
                width: '100%',
                transformOrigin: 'left'
              }}
            />
          </div>
        )}
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default Notification;