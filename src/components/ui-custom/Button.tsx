
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
  // Map our custom variants to the ones expected by Shadcn if needed
  const variantMapping: Record<string, string | undefined> = {
    // We can now pass premium, glass, and success directly since they are implemented in the base component
  };

  // Map size xl to lg for the Shadcn button
  const sizeMapping: Record<string, string | undefined> = {
    // xl is now implemented in the base component
  };

  const mappedVariant = variantMapping[variant] || variant;
  const mappedSize = sizeMapping[size as string] || size;

  return (
    <ShadcnButton
      className={cn(
        // Additional styling can go here if needed
        className
      )}
      variant={mappedVariant as any}
      size={mappedSize as any}
      disabled={isLoading || disabled}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};
