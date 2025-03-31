
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium' | 'glass' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  className?: string;
  isLoading?: boolean;
}

// This is a custom extension of the Shadcn button that includes our HRFlow styling
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'default',
  size,
  isLoading = false,
  disabled,
  ...props
}) => {
  // Translate our variant names to the ones expected by Shadcn
  const variantMapping: Record<string, string> = {
    primary: 'default',
    premium: 'default',
    glass: 'outline',
    success: 'default'
  };

  // Map size xl to lg for the Shadcn button
  const sizeMapping: Record<string, string> = {
    xl: 'lg'
  };

  const mappedVariant = variantMapping[variant] || variant;
  const mappedSize = sizeMapping[size as string] || size;

  return (
    <ShadcnButton
      className={cn(
        {
          'bg-hrflow-blue hover:bg-hrflow-blue/90 text-white': variant === 'primary',
          'bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 text-white shadow-lg': variant === 'premium',
          'backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30': variant === 'glass',
          'bg-green-500 hover:bg-green-600 text-white': variant === 'success',
        },
        // Apply additional styling for xl size
        size === 'xl' && 'h-14 rounded-md px-8 text-lg',
        className
      )}
      variant={mappedVariant as any}
      size={mappedSize as any}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  );
};
