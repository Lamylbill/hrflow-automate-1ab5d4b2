
import React from 'react';
import { cn } from '@/lib/utils';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Completely redesigned card variants
const cardVariants = {
  default: "bg-white text-card-foreground shadow-md border-0 rounded-xl hover:shadow-lg transition-all duration-300",
  glass: "bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg rounded-xl",
  premium: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl",
  feature: "border-0 bg-white p-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  flat: "bg-blue-50 border-0 rounded-xl",
  elevated: "bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl",
  outlined: "bg-white border border-blue-100 rounded-xl",
  interactive: "bg-white border-0 shadow-md hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300 cursor-pointer rounded-xl",
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
        withHover && "hover:translate-y-[-3px] transition-transform duration-300",
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
  <CardHeader ref={ref} className={cn("px-7 pt-7", className)} {...props}>
    {children}
    {subtitle && <p className="text-sm text-blue-600 mt-2 font-medium">{subtitle}</p>}
  </CardHeader>
));

EnhancedCardHeader.displayName = "EnhancedCardHeader";

// Improved CardContent with better padding
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("px-7 py-5", className)} {...props} />
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
