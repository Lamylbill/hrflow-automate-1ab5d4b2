
import React from 'react';
import { cn } from '@/lib/utils';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Completely redesigned card variants
const cardVariants = {
  default: "bg-white text-card-foreground shadow-xl border-0 rounded-3xl hover:shadow-2xl transition-all duration-300",
  glass: "bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl",
  premium: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl",
  feature: "border-0 bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300",
  flat: "bg-indigo-50 border-0 rounded-3xl",
  elevated: "bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl",
  outlined: "bg-white border border-indigo-100 rounded-3xl",
  interactive: "bg-white border-0 shadow-xl hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-300 cursor-pointer rounded-3xl",
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
        withHover && "hover:translate-y-[-6px] transition-transform duration-300",
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
  <CardHeader ref={ref} className={cn("px-8 pt-8", className)} {...props}>
    {children}
    {subtitle && <p className="text-sm text-indigo-600 mt-2 font-medium">{subtitle}</p>}
  </CardHeader>
));

EnhancedCardHeader.displayName = "EnhancedCardHeader";

// Improved CardContent with better padding
const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("px-8 py-6", className)} {...props} />
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
