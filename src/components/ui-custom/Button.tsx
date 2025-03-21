
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Modernized button variants with consistent styling
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm", 
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200", 
        outline: "border-2 border-hrflow-blue text-hrflow-blue hover:bg-hrflow-blue/10",
        ghost: "text-hrflow-blue hover:bg-gray-100",
        link: "text-hrflow-blue underline-offset-4 hover:underline p-0 h-auto",
        glass: "bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 hover:bg-white shadow-sm",
        premium: "bg-gradient-to-r from-hrflow-blue to-hrflow-blue-light text-white shadow-md hover:shadow-lg hover:translate-y-[-2px]",
        destructive: "bg-red-500 text-white hover:bg-red-600", 
        success: "bg-green-500 text-white hover:bg-green-600",
        default: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        xl: "h-14 rounded-md px-8 text-lg",
        icon: "h-10 w-10 rounded-full p-0",
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
    
    // Enhanced styling based on the redesign principles
    const buttonStyle = {
      fontWeight: 500,
      opacity: 1,
      transition: 'all 0.2s ease',
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
