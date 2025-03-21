
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Modernized button variants with more consistent styling
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm", 
        secondary: "bg-gray-700 text-white hover:bg-gray-800 shadow-sm", 
        outline: "border-2 border-hrflow-blue text-hrflow-blue hover:bg-hrflow-blue/10", 
        ghost: "hover:bg-accent hover:text-accent-foreground text-hrflow-blue", 
        link: "text-hrflow-blue underline-offset-4 hover:underline", 
        glass: "bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 hover:bg-white", 
        premium: "bg-gradient-to-r from-hrflow-blue to-hrflow-blue-light text-white shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]", 
        destructive: "bg-red-500 text-white hover:bg-red-600", 
        default: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm", // Alias for primary
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10 flex items-center justify-center rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Button component with enhanced styling
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, style, ...props }, ref) => {
    // Default placeholder text if no children provided
    const buttonContent = children || "Button";
    
    // Special handling for quick action buttons
    const isQuickAction = props['className']?.includes('justify-between');
    
    // Enhanced styling based on the redesign principles
    const buttonStyle = {
      fontWeight: 'medium',
      opacity: 1,
      ...(style as React.CSSProperties),
    };
    
    // Special handling for quick actions to ensure proper styling
    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      isQuickAction ? "justify-between text-left" : ""
    );
    
    return (
      <ShadcnButton
        className={buttonClassName}
        ref={ref}
        data-variant={variant || "primary"}
        style={buttonStyle}
        {...props}
      >
        {buttonContent}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
