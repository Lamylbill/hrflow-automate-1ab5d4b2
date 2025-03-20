
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Simplify the button variants with more consistent styling and HRFlow color scheme
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm font-bold uppercase", 
        secondary: "bg-secondary text-white hover:bg-secondary/80 font-bold uppercase", 
        outline: "border-2 border-hrflow-blue text-hrflow-blue hover:bg-hrflow-blue hover:text-white font-bold uppercase", 
        ghost: "hover:bg-accent hover:text-accent-foreground text-hrflow-blue font-bold", 
        link: "text-hrflow-blue underline-offset-4 hover:underline font-bold", 
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 font-bold uppercase", 
        premium: "bg-gradient-to-r from-hrflow-blue to-hrflow-blue-light text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-bold uppercase", 
        destructive: "bg-red-500 text-white hover:bg-red-600 font-bold uppercase", 
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10 flex items-center justify-center",
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

// Button component with enhanced styling based on the image
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, style, ...props }, ref) => {
    // Default placeholder text if no children provided
    const buttonContent = children || "Button";
    
    // Special handling for quick action buttons
    const isQuickAction = props['className']?.includes('normal-case') || 
                          props['className']?.includes('justify-between');
    
    // Enhanced styling based on the image reference
    const buttonStyle = {
      color: variant === 'outline' && !props.disabled ? '#2563EB' : 'white',
      fontWeight: 'bold',
      opacity: 1, // Ensure buttons are fully visible
      textShadow: variant !== 'outline' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
      letterSpacing: '0.5px',
      ...(isQuickAction ? { textTransform: 'none' as const } : { textTransform: 'uppercase' as const }),
      ...style,
    };
    
    // Special handling for quick actions to ensure proper styling
    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      isQuickAction ? "normal-case justify-between text-left" : ""
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
