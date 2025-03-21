
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Completely redesigned button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 text-base tracking-wide",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700", 
        secondary: "bg-white text-blue-800 hover:text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm", 
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
        ghost: "text-blue-700 hover:bg-blue-50",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
        glass: "bg-white/70 backdrop-blur-xl border border-white/30 text-blue-900 hover:bg-white/90 shadow-sm",
        premium: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-xl hover:translate-y-[-2px]",
        destructive: "bg-red-500 text-white hover:bg-red-600", 
        success: "bg-green-500 text-white hover:bg-green-600",
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2 text-sm",
        lg: "h-14 rounded-xl px-8 py-4 text-lg",
        xl: "h-16 rounded-xl px-10 py-4 text-xl font-semibold",
        icon: "h-11 w-11 rounded-full p-0",
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Button component with enhanced styling
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, leftIcon, rightIcon, style, ...props }, ref) => {
    // Default placeholder text if no children provided
    const buttonContent = children || "Button";
    
    // Determine if additional styles are needed for icons
    const hasIcons = leftIcon || rightIcon;
    
    // Enhanced styling for the new design system
    const buttonStyle = {
      fontWeight: 500,
      opacity: 1,
      transition: 'all 0.3s ease',
      ...(style as React.CSSProperties),
    };
    
    // Add appropriate spacing for icons
    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      hasIcons ? "gap-3" : ""
    );
    
    return (
      <ShadcnButton
        className={buttonClassName}
        ref={ref}
        data-variant={variant || "primary"}
        style={buttonStyle}
        {...props}
      >
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {buttonContent}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
