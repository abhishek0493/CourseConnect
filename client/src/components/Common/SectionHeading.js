import React from 'react';
import { cn } from '../../lib/utils';

export function SectionHeading({ icon: Icon, children, action, className, subtitle }) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-3 border-b border-border pb-3', className)}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-[1.15rem] w-[1.15rem]" />
            </span>
          )}
          <span className="truncate">{children}</span>
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
