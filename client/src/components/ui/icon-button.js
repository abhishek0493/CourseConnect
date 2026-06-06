import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Compact, square button for icon-only actions (votes, toolbar actions).
 */
const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 [&_svg]:size-4',
        default: 'h-9 w-9 [&_svg]:size-[1.15rem]',
        lg: 'h-10 w-10 [&_svg]:size-5',
      },
      tone: {
        default: 'hover:bg-muted hover:text-foreground',
        primary: 'hover:bg-primary/10 hover:text-primary',
        success: 'hover:bg-success/10 hover:text-success',
        accent: 'hover:bg-accent/10 hover:text-accent',
        destructive: 'hover:bg-destructive/10 hover:text-destructive',
      },
    },
    defaultVariants: { size: 'default', tone: 'default' },
  }
);

const IconButton = React.forwardRef(
  ({ className, size, tone, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ size, tone }), className)}
      {...props}
    />
  )
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
