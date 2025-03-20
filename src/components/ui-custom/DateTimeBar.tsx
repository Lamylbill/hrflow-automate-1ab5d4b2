
import React, { useState, useEffect } from 'react';

interface DateTimeBarProps {
  position?: 'top-right' | 'top-left' | 'sidebar';
  className?: string;
  collapsed?: boolean;
}

const DateTimeBar = ({ position = 'sidebar', className = '', collapsed = false }: DateTimeBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const positionClasses = {
    'top-right': 'absolute top-0 right-0 mr-6 mt-4',
    'top-left': 'absolute top-0 left-0 ml-6 mt-4',
    'sidebar': 'w-full px-4 py-2',
  };
  
  if (position === 'sidebar' && collapsed) {
    return null;
  }
  
  return (
    <div className={`${positionClasses[position]} flex items-center justify-center ${className}`}>
      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium non-clickable w-full text-center">
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | {currentTime}
      </span>
    </div>
  );
};

export default DateTimeBar;
