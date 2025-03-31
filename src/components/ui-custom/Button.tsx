
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
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
  };

  const mappedVariant = variantMapping[variant] || variant;

  return (
    <ShadcnButton
      className={cn(
        {
          'bg-hrflow-blue hover:bg-hrflow-blue/90 text-white': variant === 'primary',
        },
        className
      )}
      variant={mappedVariant as any}
      size={size}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  );
};
