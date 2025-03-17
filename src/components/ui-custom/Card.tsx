
import React from 'react';
import { cn } from '@/lib/utils';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Premium Card variants
const cardVariants = {
  default: "bg-card text-card-foreground shadow-sm hover:shadow transition-shadow duration-200",
  glass: "glass-card bg-white/70 backdrop-blur-lg border border-white/20 shadow-sm",
  premium: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300",
  feature: "border border-hrflow-gray-medium bg-white p-6 rounded-xl hover:shadow-md transition-all duration-300",
};

export interface PremiumCardProps extends React.ComponentProps<typeof ShadcnCard> {
  variant?: keyof typeof cardVariants;
  withHover?: boolean;
  isAnimated?: boolean;
}

// Create our Premium Card component based on shadcn Card
const PremiumCard = React.forwardRef<
  HTMLDivElement,
  PremiumCardProps
>(({ className, variant = "default", withHover = false, isAnimated = false, ...props }, ref) => {
  return (
    <ShadcnCard
      ref={ref}
      className={cn(
        cardVariants[variant],
        withHover && "hover:scale-[1.02] transition-transform duration-300",
        isAnimated && "animate-fade-in-up",
        className
      )}
      {...props}
    />
  );
});

PremiumCard.displayName = "PremiumCard";

export { 
  PremiumCard,
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
};
