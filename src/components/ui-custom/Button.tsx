
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
          // Improved primary button with better contrast
          'bg-hrflow-blue hover:bg-hrflow-blue/90 text-white font-medium': variant === 'primary',
          
          // Enhanced premium button with stronger contrast
          'bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 text-white font-medium shadow-lg': variant === 'premium',
          
          // Improved glass button with better text contrast
          'backdrop-blur-xl bg-white/30 hover:bg-white/40 border border-white/40 text-white font-medium shadow-md': variant === 'glass',
          
          // Better contrast for success button
          'bg-green-600 hover:bg-green-700 text-white font-medium': variant === 'success',
          
          // Improved outline button
          'border-2 border-hrflow-blue text-hrflow-blue hover:bg-hrflow-blue/10 font-medium': variant === 'outline',
          
          // Better secondary button
          'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 font-medium': variant === 'secondary',
          
          // Improved ghost button
          'hover:bg-gray-100 text-hrflow-blue hover:text-hrflow-blue/90 font-medium': variant === 'ghost',
          
          // Better destructive button
          'bg-red-600 hover:bg-red-700 text-white font-medium': variant === 'destructive',
          
          // Enhanced link button
          'text-hrflow-blue hover:text-hrflow-blue/90 underline-offset-4 hover:underline font-medium': variant === 'link',
        },
        // Apply additional styling for xl size
        size === 'xl' && 'h-14 rounded-md px-8 text-lg font-medium',
        // Improved focus state for all buttons
        'focus:ring-2 focus:ring-offset-2 focus:ring-hrflow-blue/40 focus:outline-none',
        // Better disabled state
        disabled && 'opacity-60 cursor-not-allowed hover:bg-opacity-100',
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
