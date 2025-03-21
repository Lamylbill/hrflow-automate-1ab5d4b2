
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm",
        destructive:
          "bg-red-500 text-white hover:bg-red-600/90 shadow-sm",
        outline:
          "border-2 border-hrflow-blue bg-transparent text-hrflow-blue hover:bg-hrflow-blue/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-hrflow-blue underline-offset-4 hover:underline",
        primary: "bg-hrflow-blue text-white hover:bg-hrflow-blue/90 shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10 flex items-center justify-center rounded-full",
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
    
    // Enhanced styling with proper typing
    const enhancedStyle: React.CSSProperties = {
      fontWeight: 'medium',
      letterSpacing: '0.01em',
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
