
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-hrflow-blue text-primary-foreground hover:bg-hrflow-blue/90 text-white font-bold shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white font-bold shadow-sm",
        outline:
          "border-2 border-hrflow-blue bg-background hover:bg-hrflow-blue hover:text-white font-bold",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-white font-bold shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground font-bold",
        link: "text-hrflow-blue underline-offset-4 hover:underline font-bold",
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 font-bold shadow-sm", // Added primary variant
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Enhanced styling for maximum visibility with proper typing
    const enhancedStyle: React.CSSProperties = {
      color: variant === 'outline' ? '#2563EB' : 'white',
      textShadow: variant === 'outline' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
      fontWeight: 'bold',
      letterSpacing: '0.25px',
      opacity: 1,
      ...(style as React.CSSProperties),
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-variant={variant}
        style={enhancedStyle}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
