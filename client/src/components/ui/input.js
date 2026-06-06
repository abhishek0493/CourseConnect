import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm shadow-soft transition-colors',
      'placeholder:text-muted-foreground/70',
      'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
