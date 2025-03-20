
import React, { useState, useEffect } from 'react';

interface DateTimeBarProps {
  position?: 'top-right' | 'top-left' | 'fixed';
  className?: string;
}

const DateTimeBar = ({ position = 'top-right', className = '' }: DateTimeBarProps) => {
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
    'fixed': 'fixed top-0 right-0 mr-6 mt-4 z-50',
  };
  
  return (
    <div className={`${positionClasses[position]} flex items-center ${className}`}>
      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium non-clickable">
        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | {currentTime}
      </span>
    </div>
  );
};

export default DateTimeBar;
