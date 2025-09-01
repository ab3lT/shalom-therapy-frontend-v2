import React from 'react';

const Select = ({ 
  children, 
  title, 
  className = '', 
  onClick,
  hoverEffect = false 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md p-6';
  const hoverClasses = hoverEffect ? 'transition-transform duration-200 hover:shadow-lg hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="mb-4 border-b border-gray-200 pb-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Select;