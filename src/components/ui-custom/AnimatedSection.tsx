
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  animation?: 'fade-in' | 'fade-in-up' | 'slide-in-right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  animation = 'fade-in-up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const animationStyles = {
    'fade-in': 'opacity-0 transition-opacity duration-700',
    'fade-in-up': 'opacity-0 translate-y-8 transition-all duration-700',
    'slide-in-right': 'opacity-0 translate-x-10 transition-all duration-700',
  };

  const visibleStyles = {
    'fade-in': 'opacity-100',
    'fade-in-up': 'opacity-100 translate-y-0',
    'slide-in-right': 'opacity-100 translate-x-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        animationStyles[animation],
        isVisible && visibleStyles[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export { AnimatedSection };
