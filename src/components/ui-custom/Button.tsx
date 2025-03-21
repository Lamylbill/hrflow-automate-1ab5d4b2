
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Completely redesigned button variants with modern, vibrant styles
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 text-base tracking-wide",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm", 
        secondary: "bg-white text-indigo-800 hover:text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm", 
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        ghost: "text-indigo-700 hover:bg-indigo-50",
        link: "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto",
        glass: "bg-white/70 backdrop-blur-xl border border-white/30 text-indigo-900 hover:bg-white/90 shadow-sm",
        premium: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-xl hover:translate-y-[-2px]",
        destructive: "bg-red-500 text-white hover:bg-red-600", 
        success: "bg-emerald-500 text-white hover:bg-emerald-600",
        default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 py-2 text-sm",
        lg: "h-12 rounded-lg px-6 py-3 text-base",
        xl: "h-14 rounded-lg px-8 py-4 text-lg font-semibold",
        icon: "h-10 w-10 rounded-lg p-0",
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
    
    // Enhanced styling with depth effects
    const buttonStyle: React.CSSProperties = {
      fontWeight: 600,
      opacity: 1,
      transition: 'all 0.3s ease',
      // Fixed TypeScript error by using const assertion
      transformStyle: 'preserve-3d' as const,
      ...(style as React.CSSProperties),
    };
    
    // Add appropriate spacing for icons
    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      hasIcons ? "gap-2" : ""
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
