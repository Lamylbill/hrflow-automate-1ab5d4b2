
import React from 'react';
import { cn } from '@/lib/utils';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Modern card variants with cleaner styling
const cardVariants = {
  default: "bg-white text-card-foreground shadow-sm border border-gray-100 hover:shadow transition-shadow duration-200",
  glass: "bg-white/90 backdrop-blur-lg border border-gray-100 shadow-sm",
  premium: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300",
  feature: "border border-gray-100 bg-white p-6 rounded-xl hover:shadow-md transition-all duration-300",
  flat: "bg-gray-50 border-none",
  elevated: "bg-white shadow-md hover:shadow-lg transition-all duration-300",
  outlined: "bg-white border border-gray-200",
  interactive: "bg-white border border-gray-100 hover:border-hrflow-blue hover:shadow-md transition-all duration-300 cursor-pointer",
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
        withHover && "hover:translate-y-[-2px] transition-transform duration-300",
        isAnimated && "animate-fade-in-up",
        className
      )}
      {...props}
    />
  );
});

PremiumCard.displayName = "PremiumCard";

// Enhanced CardHeader with optional subtitle
interface EnhancedCardHeaderProps extends React.ComponentProps<typeof CardHeader> {
  subtitle?: string;
}

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement, 
  EnhancedCardHeaderProps
>(({ className, subtitle, children, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("px-6 pt-6", className)} {...props}>
    {children}
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </CardHeader>
));

EnhancedCardHeader.displayName = "EnhancedCardHeader";

// Improved CardContent with better padding
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("px-6 py-4", className)} {...props} />
));

EnhancedCardContent.displayName = "EnhancedCardContent";

export { 
  PremiumCard,
  EnhancedCardHeader as CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  EnhancedCardContent as CardContent 
};
