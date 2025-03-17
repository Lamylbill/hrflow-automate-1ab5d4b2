
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Button as ShadcnButton } from '@/components/ui/button';

// Extend the button variants with our premium styles and improved contrast
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm font-bold text-white", // Force white text
        secondary: "bg-secondary text-white hover:bg-secondary/80 font-bold text-white", // Force white text
        outline: "border border-hrflow-blue text-hrflow-blue hover:bg-hrflow-blue hover:text-white font-bold", // Updated to match primary font-weight
        ghost: "hover:bg-accent hover:text-accent-foreground text-hrflow-blue font-medium", // Improved text visibility
        link: "text-hrflow-blue underline-offset-4 hover:underline font-medium", // Better contrast
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 font-bold text-white", // Force white text
        premium: "bg-gradient-to-r from-hrflow-blue to-hrflow-blue-light text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-bold text-white", // Force white text
        destructive: "bg-red-500 text-white hover:bg-red-600 font-bold text-white", // Force white text
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "premium", // Default is premium
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Create our custom Button component based on shadcn Button with enforced text visibility
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    // Default placeholder text if no children provided
    const buttonContent = children || "Button";
    
    // Add even more explicit styling to ensure text visibility
    const buttonTextClass = 
      variant === 'outline' && !props.disabled 
        ? 'text-hrflow-blue hover:text-white' 
        : 'text-white';
    
    return (
      <ShadcnButton
        className={cn(
          buttonVariants({ variant, size, className }), 
          "button-high-contrast uppercase", 
          buttonTextClass
        )}
        ref={ref}
        data-variant={variant || "premium"}
        {...props}
      >
        {buttonContent}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
