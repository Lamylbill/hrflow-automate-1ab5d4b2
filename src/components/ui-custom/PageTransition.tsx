
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Start loading animation when location changes
    setIsLoading(true);
    
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short timeout for better UX
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner size="lg" />
          <p className="text-hrflow-blue font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};
