import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../../lib/utils';

const Separator = React.forwardRef(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

/**
 * A labelled divider — modern take on MUI's <Divider textAlign="left"> with text.
 */
function LabelledSeparator({ className, children, align = 'left' }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {align !== 'left' && <span className="h-px flex-1 bg-border" />}
      {children && <div className="shrink-0">{children}</div>}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export { Separator, LabelledSeparator };
